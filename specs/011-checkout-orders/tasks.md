# Tasks 011 — Checkout + Orders

## Schema

- [x] `orders` + `order_items` + admin-only RLS; apply to Supabase + mirror; seed demo order — AC-1

## Core

- [x] `core/stripe` (config + server), `core/supabase/service.ts`, `isCheckoutConfigured()` — AC-2
- [x] `stripe` dependency + ADR-0006 — AC-6

## App routes

- [x] `app/api/checkout/route.ts` (re-price, order, Stripe session) — AC-2
- [x] `app/api/stripe/webhook/route.ts` (mark paid) — AC-3
- [x] `app/(site)/commande/merci` thank-you (clears bag) — AC-4

## Features

- [x] `checkout` slice: `CheckoutButton`; wire into `cart-view` — AC-2
- [x] admin orders: `orders.ts`, `order-table`, status update action, nav link — AC-5
- [x] `app/(admin)/admin/commandes` list + `[id]` detail — AC-5

## Glue

- [x] i18n strings; `.env.example`; docs (admin + overview + CUJ) — AC-6

## Verify

- [x] `pnpm verify` green (no keys); CUJ-A/B/C pass — AC-6
- [x] Live: seeded order shows in `/admin/commandes`, status update works; bag shows “bientôt” — AC-5/6
