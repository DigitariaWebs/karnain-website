import { type StateStorage, createJSONStorage, devtools, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";
import type { CartItemInput, CartLine } from "./types";

/** No-op storage so `persist` is inert on the server (no `localStorage` there). */
const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

/**
 * Guest bag store — the mandatory SSR-safe factory (docs/conventions/state.md): created
 * per mount by provider.tsx, never a module-level singleton. `persist` keeps the bag across
 * reloads (lines only — `isOpen` is ephemeral); storage is guarded so it no-ops on the
 * server. Tests use this factory headlessly.
 */

export type CartState = {
  lines: CartLine[];
  isOpen: boolean;
  addItem: (item: CartItemInput, quantity?: number) => void;
  setQuantity: (slug: string, quantity: number) => void;
  removeItem: (slug: string) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
};

export type CartStore = ReturnType<typeof createCartStore>;

export function createCartStore(initialLines: CartLine[] = []) {
  return createStore<CartState>()(
    devtools(
      persist(
        (set) => ({
          lines: initialLines,
          isOpen: false,
          addItem: (item, quantity = 1) =>
            set(
              (state) => {
                const existing = state.lines.find((line) => line.slug === item.slug);
                const lines = existing
                  ? state.lines.map((line) =>
                      line.slug === item.slug
                        ? { ...line, quantity: line.quantity + quantity }
                        : line,
                    )
                  : [...state.lines, { ...item, quantity }];
                return { lines, isOpen: true };
              },
              undefined,
              "cart/addItem",
            ),
          setQuantity: (slug, quantity) =>
            set(
              (state) => ({
                lines:
                  quantity <= 0
                    ? state.lines.filter((line) => line.slug !== slug)
                    : state.lines.map((line) =>
                        line.slug === slug ? { ...line, quantity } : line,
                      ),
              }),
              undefined,
              "cart/setQuantity",
            ),
          removeItem: (slug) =>
            set(
              (state) => ({ lines: state.lines.filter((line) => line.slug !== slug) }),
              undefined,
              "cart/removeItem",
            ),
          clear: () => set({ lines: [] }, undefined, "cart/clear"),
          openCart: () => set({ isOpen: true }, undefined, "cart/openCart"),
          closeCart: () => set({ isOpen: false }, undefined, "cart/closeCart"),
        }),
        {
          name: "karnain-cart",
          storage: createJSONStorage(() =>
            typeof window !== "undefined" ? window.localStorage : noopStorage,
          ),
          partialize: (state) => ({ lines: state.lines }),
        },
      ),
      { name: "cart" },
    ),
  );
}
