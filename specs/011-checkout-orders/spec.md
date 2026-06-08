# Spec 011 — Checkout (Stripe) + Orders back office

- **Status:** active
- **Type:** feature
- **Requested by / owner:** Karnain (client) / Achraf Arabi
- **Date:** 2026-06-08
- **Slice / areas touched:** `src/core/stripe` (new), `src/core/supabase` (service client),
  `src/features/checkout` (new, UI), `src/features/admin` (orders), `src/app/api/*` (checkout +
  webhook routes), `src/app/(admin)`, `supabase/migrations`, ADR-0006

## Problem (the why)

The bag has no way to pay — checkout was deferred at launch. The old WooCommerce site has **41
completed orders**, so the maison genuinely sells and needs (a) a real checkout and (b) an
**Orders back office** to see and manage them. We add both, integrated with Stripe, built so the
app stays green and shippable **with no Stripe keys** (graceful “bientôt” state) and flips live
the moment keys are added — the same pattern as the Supabase catalog.

## Desired behavior (the what)

From the bag, a visitor clicks **Commander**. When Stripe is configured, they’re sent to Stripe
Checkout (hosted, PCI‑handled); on success they land on a thank‑you page and an **order** is
recorded (status `paid`). When Stripe is **not** configured, the button shows the existing
“paiement bientôt” state — nothing breaks. An admin sees all orders at `/admin/commandes`
(date, customer, total, status), opens one to see its line items, and updates its status.

## Acceptance criteria

- **AC-1:** `orders` + `order_items` tables exist with **admin‑only RLS** (role claim); no public
  access. Order writes happen server‑side via the **service‑role** key (bypasses RLS).
- **AC-2:** `POST /api/checkout` **re‑prices items from the catalog** (never trusts client
  prices), creates a `pending` order, and — when Stripe is configured — returns a Stripe Checkout
  Session URL (order id in metadata). Unconfigured → a clear `not-configured` response and the
  bag shows “bientôt”.
- **AC-3:** `POST /api/stripe/webhook` verifies the Stripe signature and marks the order `paid`
  on `checkout.session.completed`.
- **AC-4:** A thank‑you page (`/commande/merci`) confirms the order; the bag clears.
- **AC-5:** `/admin/commandes` lists orders (admin‑only); an order detail shows items and a
  **status update** action.
- **AC-6:** `pnpm verify` green with **no Stripe keys set**; CUJ‑A/B/C still pass; the Orders
  admin verified live against a seeded order. New dependency (`stripe`) recorded in **ADR‑0006**.

## Out of scope

- Customer accounts, saved carts, coupons/discounts, shipping rates/tax, email receipts,
  refunds (all later). Inventory decrement on sale (later — catalog has no stock field yet).

## CUJ impact

- Extends CUJ‑B (fill the bag → **pay**). Adds an internal Orders journey (no public CUJ).

## Open questions

- [ ] Stripe account + test/live keys + `SUPABASE_SERVICE_ROLE_KEY` (client to provide → live).
- [ ] Currency/tax/shipping model for France (CGV) — flat for now.
