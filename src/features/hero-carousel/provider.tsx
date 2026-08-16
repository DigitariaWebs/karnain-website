"use client";

import { createContext, useContext, useState } from "react";
import { useStore } from "zustand";
import { type HeroCarouselState, type HeroCarouselStore, createHeroCarouselStore } from "./store";

const HeroCarouselStoreContext = createContext<HeroCarouselStore | null>(null);

type HeroCarouselStoreProviderProps = {
  count: number;
  children: React.ReactNode;
};

/** One carousel store per mount (SSR-request safe). */
export function HeroCarouselStoreProvider({ count, children }: HeroCarouselStoreProviderProps) {
  const [store] = useState<HeroCarouselStore>(() => createHeroCarouselStore(count));
  return (
    <HeroCarouselStoreContext.Provider value={store}>{children}</HeroCarouselStoreContext.Provider>
  );
}

/** Always subscribe through a selector — whole-store subscriptions fail review. */
export function useHeroCarouselStore<T>(selector: (state: HeroCarouselState) => T): T {
  const store = useContext(HeroCarouselStoreContext);
  if (!store) {
    throw new Error("useHeroCarouselStore must be used within a HeroCarouselStoreProvider.");
  }
  return useStore(store, selector);
}

/**
 * The raw store handle, for the frame loop. Reading `getState()` inside `useFrame` keeps the
 * 3D scene off React's render path entirely (see docs/conventions/motion.md).
 */
export function useHeroCarouselStoreApi(): HeroCarouselStore {
  const store = useContext(HeroCarouselStoreContext);
  if (!store) {
    throw new Error("useHeroCarouselStoreApi must be used within a HeroCarouselStoreProvider.");
  }
  return store;
}
