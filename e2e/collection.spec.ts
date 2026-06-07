import { expect, test } from "@playwright/test";
import { shot } from "./utils/shot";

// CUJ-C — Browse the collection (docs/product/critical-user-journeys.md)
test("@cuj CUJ-C: visitor browses the collection, filters, opens a fragrance", async ({ page }) => {
  await page.goto("/collection");

  await expect(page.getByRole("heading", { name: "Karnain Addicte", level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: "Tobacco" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Rose des Îles" })).toBeVisible();
  await shot(page, "collection-desktop");

  // Filter by a scent family → URL reflects it and the grid narrows
  await page.getByRole("link", { name: "Floraux" }).click();
  await expect(page).toHaveURL(/famille=/);
  await expect(page.getByRole("link", { name: "Rose des Îles" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Tobacco" })).toHaveCount(0);
  await shot(page, "collection-filtered");

  // Open a fragrance from the filtered grid
  await page.getByRole("link", { name: "Rose des Îles" }).click();
  await expect(page).toHaveURL(/\/parfums\/rose-des-iles/);
  await expect(page.getByRole("heading", { name: "Rose des Îles", level: 1 })).toBeVisible();

  // Mobile
  await page.goto("/collection");
  await page.setViewportSize({ width: 390, height: 844 });
  await shot(page, "collection-mobile");
});
