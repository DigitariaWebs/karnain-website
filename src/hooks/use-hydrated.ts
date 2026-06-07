"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * `true` only after hydration. `useSyncExternalStore` returns the server snapshot (`false`)
 * during SSR and the first client render, then the client snapshot (`true`) — so gating
 * client-only values (e.g. a persisted bag count) on it avoids any hydration mismatch.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
