import { beforeEach, describe, expect, it } from "vitest";
import { createCartStore } from "./store";

// Headless store tests. Clear persisted storage between tests so rehydration can't leak.
beforeEach(() => {
  localStorage.clear();
});

const tobacco = { slug: "tobacco", name: "Tobacco", priceEur: 195 };
const cuir = { slug: "cuir-90", name: "Cuir 90", priceEur: 195 };

describe("cart store", () => {
  it("adds an item and opens the bag (AC-3)", () => {
    const store = createCartStore();
    store.getState().addItem(tobacco);
    expect(store.getState().lines).toEqual([{ ...tobacco, quantity: 1 }]);
    expect(store.getState().isOpen).toBe(true);
  });

  it("merges quantity when the same fragrance is added again", () => {
    const store = createCartStore();
    store.getState().addItem(tobacco);
    store.getState().addItem(tobacco, 2);
    expect(store.getState().lines).toHaveLength(1);
    expect(store.getState().lines[0]?.quantity).toBe(3);
  });

  it("setQuantity updates, and a quantity of 0 removes the line", () => {
    const store = createCartStore([{ ...tobacco, quantity: 1 }]);
    store.getState().setQuantity("tobacco", 4);
    expect(store.getState().lines[0]?.quantity).toBe(4);
    store.getState().setQuantity("tobacco", 0);
    expect(store.getState().lines).toHaveLength(0);
  });

  it("removeItem and clear empty the bag", () => {
    const store = createCartStore([
      { ...tobacco, quantity: 1 },
      { ...cuir, quantity: 2 },
    ]);
    store.getState().removeItem("tobacco");
    expect(store.getState().lines.map((line) => line.slug)).toEqual(["cuir-90"]);
    store.getState().clear();
    expect(store.getState().lines).toHaveLength(0);
  });

  it("openCart/closeCart toggle bag visibility", () => {
    const store = createCartStore();
    store.getState().openCart();
    expect(store.getState().isOpen).toBe(true);
    store.getState().closeCart();
    expect(store.getState().isOpen).toBe(false);
  });
});
