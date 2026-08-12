import { expect, test } from "@playwright/test";
import { shot } from "./utils/shot";

// CUJ-A — Discover the house (docs/product/critical-user-journeys.md)
// The brand story lives on its own page; the header and the homepage both lead there.
test("@cuj CUJ-A: visitor reaches the maison page and enters the brand universe", async ({
  page,
}) => {
  await page.goto("/");

  // The homepage story section teases through to the dedicated page.
  await page.getByRole("link", { name: "Découvrir la maison" }).click();
  await expect(page).toHaveURL(/\/maison$/);

  // The page opens on the brand statement (the only h1) and its chapters.
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Karnain/);
  await expect(page.getByRole("heading", { name: "L’origine" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "La composition" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Le flacon" })).toBeVisible();

  await shot(page, "maison-desktop");

  // The journey continues into the collection.
  await page.getByRole("link", { name: "Découvrir la collection" }).click();
  await expect(page).toHaveURL(/\/collection$/);
});

test("@cuj CUJ-A: the header nav points at the maison page", async ({ page }) => {
  await page.goto("/");

  // The header nav is labelled with the brand name; the footer nav also lists “La maison”.
  await page
    .getByRole("navigation", { name: "Karnain" })
    .getByRole("link", { name: "La maison" })
    .click();
  await expect(page).toHaveURL(/\/maison$/);

  await page.setViewportSize({ width: 390, height: 844 });
  await shot(page, "maison-mobile");
});
