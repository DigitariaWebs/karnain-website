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

  // Inquiry converts through WhatsApp — no checkout, no login on the page
  const whatsapp = page.getByRole("link", { name: /Commander sur WhatsApp/ }).first();
  await expect(whatsapp).toHaveAttribute("href", /wa\.me/);
  await expect(page.getByRole("button", { name: /panier|ajouter au panier/i })).toHaveCount(0);

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
