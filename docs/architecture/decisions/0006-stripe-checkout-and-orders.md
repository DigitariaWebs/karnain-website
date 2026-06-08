# ADR-0006 — Stripe Checkout (hosted) + orders with a service-role write path

- **Status:** accepted
- **Date:** 2026-06-08
- **Context spec:** 011-checkout-orders

## Context

The store needs payments and an orders back office. The maison already sells (41 orders on the
old WooCommerce site). We want to take card payments without handling card data ourselves, keep
the app shippable with no keys, and store orders securely in the existing Supabase project.

## Decision

- **Stripe Checkout (hosted Session)** for payment: redirect to Stripe’s PCI-compliant page,
  return to a thank-you URL, confirm via webhook. Minimal surface, no card data on our servers.
- Checkout **orchestration lives in `app/` route handlers** (`/api/checkout`,
  `/api/stripe/webhook`), not a feature — because the layer rule forbids feature→feature imports
  and pricing lives in the `catalog` feature, which `app` may compose.
- Orders are written by the **Supabase service-role key** (server-only, bypasses RLS). Orders
  RLS is **admin-only** (role claim) for reads/updates; there is **no anon access** to orders.
- Server **re-prices every line from the catalog**; client-sent prices are never trusted.
- Everything is gated by `isStripeConfigured()` / `isCheckoutConfigured()` — with no keys the bag
  shows “paiement bientôt” and `pnpm verify` stays green. Adds the `stripe` dependency.

## Alternatives considered

| Option                                         | Why not                                                                                      |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Stripe Payment Intents / embedded Elements     | More client code + PCI scope; hosted Checkout is enough for a single-currency catalog.       |
| Anon `insert` RLS for orders (no service role) | Public could spam/forge orders; service-role keeps writes trusted and server-only.           |
| A bespoke payments backend                     | Far more to build/operate; Stripe gives checkout, webhooks, dashboard.                       |
| Put checkout logic in a `checkout` feature     | Would need to import the `catalog` feature (boundary violation); app routes compose instead. |

## Addendum (spec 012) — admin-managed credentials

Stripe credentials can be entered from the admin (`/admin/parametres`) instead of env. They live
in an `app_settings` table with **RLS enabled and no policies** — unreachable via any browser
token (even an admin’s); only the **service-role** server reads/writes it. `getStripeCredentials()`
resolves settings first, then env. The save action verifies the caller’s `role = 'admin'` claim
before writing via the service role, and secrets are never returned to the browser (the settings
UI shows only masked status). The **service-role key itself stays in env** — it bootstraps the
ability to read the stored settings, so it cannot be self-managed.

## Consequences

- Positive: no card data on our infra; orders centralized in Supabase with admin-only access;
  ships green without keys and flips live by adding env.
- Negative / accepted: a second external dependency (Stripe) + its webhook secret; the
  service-role key must be set in the server env (never exposed to the browser); inventory
  decrement and tax/shipping are deferred.
- Follow-ups: client provides Stripe keys + `SUPABASE_SERVICE_ROLE_KEY`; configure the webhook
  endpoint in the Stripe dashboard; later add coupons, email receipts, and stock.
