"use client";

import { createContext, useContext, useState } from "react";
import { useStore } from "zustand";
import { type CartState, type CartStore, createCartStore } from "./store";

const CartStoreContext = createContext<CartStore | null>(null);

type CartStoreProviderProps = {
  children: React.ReactNode;
};

/** One bag store per mount (SSR-request safe); rehydrated from local storage on the client. */
export function CartStoreProvider({ children }: CartStoreProviderProps) {
  const [store] = useState<CartStore>(() => createCartStore());
  return <CartStoreContext.Provider value={store}>{children}</CartStoreContext.Provider>;
}

/** Always subscribe through a selector — whole-store subscriptions fail review. */
export function useCartStore<T>(selector: (state: CartState) => T): T {
  const store = useContext(CartStoreContext);
  if (!store) {
    throw new Error("useCartStore must be used within a CartStoreProvider.");
  }
  return useStore(store, selector);
}
