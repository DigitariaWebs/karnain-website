"use client";

import { useEffect } from "react";
import { useCartStore } from "../provider";

/** Empties the bag on mount — rendered on the order thank-you page after a successful payment. */
export function ClearBag() {
  const clear = useCartStore((state) => state.clear);
  useEffect(() => {
    clear();
  }, [clear]);
  return null;
}
