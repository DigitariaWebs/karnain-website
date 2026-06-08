# Spec 009 — Catalog enrichment: real content, draft status, merchandising

- **Status:** active
- **Type:** feature
- **Requested by / owner:** Karnain (client) / Achraf Arabi
- **Date:** 2026-06-08
- **Slice / areas touched:** `src/features/catalog` (types, data, repo, components), `src/features/admin` (form, actions, dashboard), `src/app/(site)` (product/collection rendering), `supabase/migrations`

## Problem (the why)

The new admin manages a thinner catalog than the brand actually runs. The old WooCommerce
admin (karnain.fr) shows each fragrance with **fuller scent notes** and a **rich multi‑paragraph
description**, a **draft/published** status (it keeps several products as drafts), and
**merchandising categories** (Nouveau, Best‑seller). Our catalog uses one‑line descriptions,
no status (everything is live), and only a scent `family`. To be the brand’s real back office
and show its real copy, the catalog needs to carry this.

## Desired behavior (the what)

Each fragrance shows its authentic, multi‑paragraph description and full notes. An admin can
mark a fragrance **draft** (hidden from the public site, visible only in admin) or
**published**, and flag it **Nouveau** and/or **Best‑seller**; those flags show as discreet
badges on the storefront. Visitors only ever see published fragrances. Existing behaviour
(filters, bag, product pages) is unchanged otherwise.

## Acceptance criteria

- **AC-1:** Fragrances carry a `status` (`published` | `draft`), `is_new`, and `is_best_seller`.
  The public site shows **only published** fragrances (cards, collection, product pages,
  `generateStaticParams`); a draft slug returns the friendly not‑found publicly.
- **AC-2:** Product pages render the **full multi‑paragraph description** (paragraphs, not one
  block) and the real, fuller notes.
- **AC-3:** Cards show a discreet **“Nouveau”** and/or **“Best‑seller”** badge when flagged.
- **AC-4:** The admin product form edits status, `is_new`, `is_best_seller` (zod‑validated);
  the admin dashboard lists drafts (with a badge) alongside published, and can edit them.
- **AC-5:** The real descriptions + notes for the published fragrances are synced into Supabase
  (and the in‑code seed stays a faithful mirror for the fallback).
- **AC-6:** Schema change is applied to the live Supabase project with RLS intact; `pnpm verify`
  green; CUJ‑A/B/C still pass.

## Out of scope

- Image upload to Supabase Storage (next spec) — images stay path‑based here.
- Stock/inventory, SKU, sale prices, orders/customers/coupons, Stripe checkout (later specs).
- Adding the old site’s draft‑only products (Mon Chéri, Nuit Parisienne) — their content isn’t
  public; tracked as a follow‑up once sourced. Whether Rose des Bois should be a draft is a
  product decision left to the owner (the status field now makes it a one‑click change).

## CUJ impact

- No new CUJ. CUJ‑A/B/C unchanged (drafts simply never appear publicly).

## Open questions

- [ ] Should Rose des Bois be set to draft to match the old site? (Owner decision; field ready.)
