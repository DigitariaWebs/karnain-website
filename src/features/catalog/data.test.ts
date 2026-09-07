import { describe, expect, it } from "vitest";
import {
  getCollection,
  getFeaturedFragrances,
  getFragrance,
  getFragrances,
  getFragrancesByCollection,
} from "./data";

describe("catalog data", () => {
  it("exposes the full seed catalog with valid prices", async () => {
    const all = await getFragrances();
    expect(all.length).toBe(6);
    expect(all.every((fragrance) => fragrance.priceEur > 0)).toBe(true);
    expect(new Set(all.map((fragrance) => fragrance.slug)).size).toBe(all.length);
  });

  it("limits featured fragrances and only returns featured ones", async () => {
    const featured = await getFeaturedFragrances(3);
    expect(featured.length).toBe(3);
    expect(featured.every((fragrance) => fragrance.featured)).toBe(true);
  });

  it("looks up a fragrance and a collection by slug", async () => {
    const fragrance = await getFragrance("tentation");
    expect(fragrance?.name).toBe("Tentation");
    expect(await getFragrance("does-not-exist")).toBeUndefined();

    const collection = await getCollection("karnain-addicte");
    expect(collection?.name).toBe("Karnain Addicte");
  });

  it("groups fragrances by collection", async () => {
    const inCollection = await getFragrancesByCollection("karnain-addicte");
    expect(inCollection.length).toBe(6);
  });
});
