import { describe, expect, it } from "vitest";
import { cartCount, cartSubtotal } from "./lib";

const lines = [
  { slug: "tobacco", name: "Tobacco", priceEur: 195, quantity: 2 },
  { slug: "cuir-90", name: "Cuir 90", priceEur: 195, quantity: 1 },
];

describe("cart lib", () => {
  it("counts all items across lines", () => {
    expect(cartCount(lines)).toBe(3);
    expect(cartCount([])).toBe(0);
  });

  it("sums the subtotal in euros", () => {
    expect(cartSubtotal(lines)).toBe(585);
    expect(cartSubtotal([])).toBe(0);
  });
});
