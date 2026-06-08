# Plan 011 — Checkout + Orders

Boundary note: the **layer rule** forbids feature→feature imports, and pricing lives in the
`catalog` feature. So checkout **orchestration lives in `app/` routes** (app may import any
feature); the `checkout`/`cart` features hold only UI that calls those routes.

## Schema (Supabase via MCP; mirror in `supabase/migrations`)

- `orders` (id uuid pk, status `pending|paid|fulfilled|cancelled`, email, customer_name,
  total_eur int, stripe_session_id, created_at) and `order_items` (order_id fk cascade, slug,
  name, price_eur, quantity).
- RLS on both: **admin‑only** (`app_metadata.role='admin'`) for all ops; no anon. Server writes
  use the service‑role key (bypasses RLS). Seed one demo order to exercise the admin.

## Core

- `src/core/stripe/config.ts`: `stripeConfig` (secret, webhook secret, publishable),
  `isStripeConfigured()` (secret present).
- `src/core/stripe/server.ts` (`server-only`): lazy `getStripe()` (the `stripe` SDK).
- `src/core/supabase/service.ts` (`server-only`): `getServiceClient()` using
  `SUPABASE_SERVICE_ROLE_KEY`; `hasServiceRole()`. `isCheckoutConfigured()` =
  Supabase + service role + Stripe.

## App routes (orchestration)

- `app/api/checkout/route.ts` (POST): body `{ items: {slug, quantity}[] }`. Re‑price each slug
  from `catalog.getFragrance` (ignore client prices); if not configured → `{ error:
"not-configured" }` (200). Else create a `pending` order + items (service client), create a
  Stripe Checkout Session (line items, success/cancel URLs, `metadata.order_id`), return
  `{ url }`.
- `app/api/stripe/webhook/route.ts` (POST): read raw body, `stripe.webhooks.constructEvent` with
  the webhook secret; on `checkout.session.completed` set the order `paid` + capture
  email/name. Returns 200 quickly.
- `app/(site)/commande/merci/page.tsx`: thank‑you; a small client effect clears the bag.

## Features (UI only)

- `src/features/checkout/components/checkout-button.tsx` (client): reads cart lines (cart
  provider), POSTs to `/api/checkout`; on `{url}` `window.location = url`; on `not-configured`
  shows the “bientôt” note; disabled while pending. Public API via `index.ts`.
- `cart-view.tsx`: swap the disabled button for `<CheckoutButton/>`.
- `src/features/admin`: `orders.ts` (`server-only`, admin session read — RLS), components
  `order-table.tsx` + `order-status-form.tsx`; `actions.ts` gains `updateOrderStatus` (zod,
  admin client). Admin nav: add “Commandes”.
- `app/(admin)/admin/commandes/page.tsx` (list) + `.../commandes/[id]/page.tsx` (detail).

## i18n / env / docs

- `messages/fr.ts`: checkout + orders strings.
- `.env.example`: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`,
  `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
- **ADR‑0006**: Stripe Checkout (hosted) + the service‑role write path; alternatives (Payment
  Intents/embedded, anon‑insert RLS) and why not.

## Verification

- `pnpm verify` green **with no keys** (graceful paths). CUJ‑A/B/C pass.
- Seed a demo order → verify `/admin/commandes` lists it and status update works (live, admin).
- Bag “Commander” with no keys → shows “bientôt” (no crash). Stripe happy path is
  build‑verified + ready to flip on once keys land.

## Conflict check

New slices + app routes; touches cart‑view + admin nav + env. Builds on 005 (supabase), 009
(catalog), 010 (storage). No overlap with active specs.
