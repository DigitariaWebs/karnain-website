import { expect, test } from "@playwright/test";
import { shot } from "./utils/shot";

// CUJ-B — Explore a fragrance and fill the bag (docs/product/critical-user-journeys.md)
test("@cuj CUJ-B: visitor opens a fragrance, reads it, adds it to the bag", async ({ page }) => {
  await page.goto("/parfums/tentation");

  await expect(page.getByRole("heading", { name: "Tentation", level: 1 })).toBeVisible();
  await expect(page.getByText("Note de cœur")).toBeVisible();
  await expect(page.getByText(/195,00/).first()).toBeVisible();
  await shot(page, "product-desktop");

  // Gallery lightbox opens and closes with the keyboard
  await page.getByRole("button", { name: "Agrandir l’image" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await shot(page, "product-lightbox");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();

  // Add to bag → the drawer opens with the line and a subtotal
  await page.getByRole("button", { name: "Ajouter au panier" }).click();
  const bag = page.getByRole("dialog", { name: "Votre panier" });
  await expect(bag).toBeVisible();
  await expect(bag.getByText("Tentation")).toBeVisible();
  await expect(bag.getByText("Sous-total")).toBeVisible();
  await shot(page, "bag-drawer");

  // Open the full cart page
  await bag.getByRole("link", { name: "Voir le panier" }).click();
  await expect(page).toHaveURL(/\/panier/);
  await expect(page.getByRole("heading", { name: "Votre panier" })).toBeVisible();
  await expect(bag).toBeHidden(); // the drawer closes on navigation
  await shot(page, "cart-page");

  // Mobile product view
  await page.goto("/parfums/tentation");
  await page.setViewportSize({ width: 390, height: 844 });
  await shot(page, "product-mobile");
});

test("unknown fragrance shows a friendly not-found", async ({ page }) => {
  await page.goto("/parfums/does-not-exist");
  // The user-facing guarantee is the friendly French not-found, not a crash.
  await expect(page.getByRole("heading", { name: "Fragrance introuvable" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Retour à la collection" })).toBeVisible();
});
