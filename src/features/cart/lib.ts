import type { CartLine } from "./types";

/** Total number of items in the bag. */
export function cartCount(lines: readonly CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}

/** Bag subtotal in euros (before any future shipping/taxes). */
export function cartSubtotal(lines: readonly CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.priceEur * line.quantity, 0);
}
