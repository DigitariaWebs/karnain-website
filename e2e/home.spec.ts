import { expect, test } from "@playwright/test";
import { shot } from "./utils/shot";

// CUJ-A — Discover the house (docs/product/critical-user-journeys.md)
test("@cuj CUJ-A: visitor lands, understands the maison, finds a way forward", async ({ page }) => {
  await page.goto("/");

  // Hero brand statement (the only h1)
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  // The four sections of the homepage are present, in French
  await expect(page.getByRole("heading", { name: "Les signatures" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Karnain Addicte" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "L’art du parfum", exact: true })).toBeVisible();

  // The collection lists the seed fragrances
  await expect(page.getByRole("heading", { name: "Tentation" }).first()).toBeVisible();

  // Cart-based commerce: the bag is reachable from the header; WhatsApp appears nowhere.
  await expect(page.getByRole("button", { name: "Ouvrir le panier" })).toBeVisible();
  await expect(page.getByRole("link", { name: /whatsapp/i })).toHaveCount(0);

  // Editorial: the Instagram strip links out to the brand’s Instagram.
  const instagram = page.getByRole("link", { name: "Nous suivre sur Instagram" }).first();
  await expect(instagram).toHaveAttribute("href", /instagram\.com/);

  await shot(page, "home-desktop");

  // Responsive: mobile layout + working menu
  await page.setViewportSize({ width: 390, height: 844 });
  await shot(page, "home-mobile");

  await page.getByRole("button", { name: "Ouvrir le menu" }).click();
  const menu = page.getByRole("dialog");
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("link", { name: "Collection" })).toBeVisible();
  await shot(page, "home-mobile-menu");
});
