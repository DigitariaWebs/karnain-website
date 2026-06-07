# Spec 002 — Shop: fragrance product page & bag

- **Status:** active
- **Type:** feature
- **Requested by / owner:** Karnain (client, via Marouane) / progix
- **Date:** 2026-06-07
- **Slice / areas touched:** `src/features/catalog` (product UI), `src/features/cart` (new), `src/components/layout` (header bag), routes `src/app/parfums/[slug]` + `src/app/panier`

## Problem (the why)

The homepage presents the collection but a visitor can’t act on a fragrance. A luxury
e-commerce house (LV, Jean Paul Gaultier) converts through a bag: add to bag → review the
bag → checkout. Karnain wants this standard, premium pattern — not an inquiry/WhatsApp
flow, which reads as mass-market. This spec builds the shopping foundation: a product page
that sells each fragrance and a guest bag the visitor can fill and review. Online payment
is deferred (Stripe in a later spec); v1 delivers the full bag experience up to checkout.

## Desired behavior (the what)

From the collection a visitor opens a fragrance and sees a page dedicated to it: an
enlargeable gallery, its name and collection, mood and description, scent notes, and price,
with an “add to bag” action. Adding opens a bag drawer (and a header bag count) showing the
lines, quantities, and subtotal; they can adjust quantities, remove items, keep shopping,
or open a full cart page. The cart page shows the order and the path to checkout (online
payment marked as coming soon). Everything is French, responsive, persists the bag across
reloads, and never dead-ends. No customer login; no WhatsApp.

## Acceptance criteria

- **AC-1:** Each fragrance has a page at `/parfums/<slug>` showing name, collection, mood,
  description, scent notes (head/heart/base), price, and an “Ajouter au panier” action.
- **AC-2:** The product gallery’s images can be enlarged in a lightbox that is
  keyboard-operable (open, navigate, close) and reduced-motion safe; imagery uses
  intentional placeholders until the asset zip arrives.
- **AC-3:** Adding to the bag updates a header bag count and opens a bag drawer listing the
  lines with quantity controls, per-line removal, and a subtotal (French euro format).
- **AC-4:** The bag persists across page reloads (guest bag, local) with no hydration flash
  of a wrong count.
- **AC-5:** `/panier` shows the full bag (or a styled empty state) and the checkout step,
  with online payment clearly marked as coming soon (no broken payment, no login).
- **AC-6:** Fragrance cards link to the product page; the header exposes the bag from every
  page; WhatsApp appears nowhere.
- **AC-7:** Responsive at 390 px and 1440 px (screenshot-verified); unknown slug shows a
  friendly French not-found; the product route ships loading + error states.

## Out of scope

- Online payment / Stripe checkout (own spec, pending payment + legal/CGV).
- Real Supabase data + admin (own spec) — still the in-code seed behind the same API.
- Customer accounts, real photography, collection filtering page (spec 003).

## CUJ impact

- Registers **CUJ-B — Explore a fragrance and fill the bag**: open a fragrance → read it,
  enlarge the gallery → add to bag → see the bag drawer/subtotal → open the cart page.
  Added to `../../docs/product/critical-user-journeys.md` at ship.

## Open questions

- [ ] Stripe + legal/CGV before checkout/payment can ship (separate spec).
- [ ] Real imagery + confirmed per-fragrance copy (placeholders/seed used meanwhile).
