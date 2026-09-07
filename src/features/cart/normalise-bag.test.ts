import { describe, expect, it } from "vitest";
import { MAX_ITEMS, MAX_QUANTITY, normaliseBagLines } from "./normalise-bag";

const catalog = new Map([
  ["tobacco", { name: "Tobacco", priceEur: 195 }],
  ["cuir-90", { name: "Cuir 90", priceEur: 195 }],
]);

describe("normaliseBagLines", () => {
  it("prices from the catalog, never from the request", () => {
    expect(
      normaliseBagLines([{ slug: "tobacco", quantity: 2, priceEur: 1 } as never], catalog),
    ).toEqual([{ slug: "tobacco", name: "Tobacco", priceEur: 195, quantity: 2 }]);
  });

  it("drops slugs the catalog does not have, keeping the rest of the bag", () => {
    const lines = normaliseBagLines([{ slug: "rose-des-bois" }, { slug: "tobacco" }], catalog);
    expect(lines.map((line) => line.slug)).toEqual(["tobacco"]);
  });

  it("merges a repeated slug into one line instead of many", () => {
    const repeated = Array.from({ length: 40 }, () => ({ slug: "tobacco", quantity: 1 }));
    expect(normaliseBagLines(repeated, catalog)).toEqual([
      { slug: "tobacco", name: "Tobacco", priceEur: 195, quantity: 40 },
    ]);
  });

  it("never returns more lines than the catalog has, however long the bag", () => {
    const flood = Array.from({ length: 5000 }, (_, i) => ({
      slug: i % 2 === 0 ? "tobacco" : "cuir-90",
      quantity: 99,
    }));
    const lines = normaliseBagLines(flood, catalog);
    expect(lines).toHaveLength(2);
    expect(lines.every((line) => line.quantity <= MAX_QUANTITY)).toBe(true);
  });

  it("clamps hostile quantities to a sane range", () => {
    const cases = [
      [{ slug: "tobacco", quantity: -5 }, 1],
      [{ slug: "tobacco", quantity: 0 }, 1],
      [{ slug: "tobacco", quantity: 1e9 }, MAX_QUANTITY],
      [{ slug: "tobacco", quantity: 2.9 }, 2],
      [{ slug: "tobacco", quantity: "3" }, 3],
      [{ slug: "tobacco", quantity: Number.NaN }, 1],
      [{ slug: "tobacco", quantity: null }, 1],
      [{ slug: "tobacco" }, 1],
    ] as const;
    for (const [item, expected] of cases) {
      expect(normaliseBagLines([item], catalog)[0]?.quantity, JSON.stringify(item)).toBe(expected);
    }
  });

  it("ignores anything past the item cap", () => {
    const bag = [
      ...Array.from({ length: MAX_ITEMS }, () => ({ slug: "tobacco", quantity: 1 })),
      { slug: "cuir-90", quantity: 1 },
    ];
    expect(normaliseBagLines(bag, catalog).map((line) => line.slug)).toEqual(["tobacco"]);
  });

  it("returns nothing for an empty bag", () => {
    expect(normaliseBagLines([], catalog)).toEqual([]);
  });
});
