import { describe, expect, it } from "vitest";
import { getStudioProductImage } from "./product-imagery";

describe("getStudioProductImage", () => {
  it("covers all six approved bottle treatments", () => {
    expect(
      ["tobacco", "cuir-90", "rose-des-iles", "tentation", "cherry-je-taime", "sucre-addictee"].map(
        getStudioProductImage,
      ),
    ).toEqual([
      "/images/fragrances/tobacco-studio-v3.png",
      "/images/fragrances/cuir-90-studio-v3.png",
      "/images/fragrances/rose-des-iles-studio-v3.png",
      "/images/fragrances/tentation-studio-v3.png",
      "/images/fragrances/cherry-je-taime-studio-v3.png",
      "/images/fragrances/sucre-addictee-studio-v3.png",
    ]);
  });

  it("leaves unapproved fragrances on their catalog imagery", () => {
    expect(getStudioProductImage("rose-des-bois")).toBeUndefined();
  });
});
