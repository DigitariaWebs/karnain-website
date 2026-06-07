# Spec 003 — Collection page

- **Status:** active
- **Type:** feature
- **Requested by / owner:** Karnain (client, via Marouane) / progix
- **Date:** 2026-06-07
- **Slice / areas touched:** `src/features/catalog` (scent family + helper), route `src/app/collection`

## Problem (the why)

There is no dedicated place to browse the whole house. The homepage previews the
collection and product pages sell one fragrance, but a visitor who wants to scan everything
and narrow by what they like has nowhere to go — and the header’s “Collection” only jumps
to a homepage section. A maison needs a proper catalog page with light filtering.

## Desired behavior (the what)

A visitor opens the collection page and sees every Karnain fragrance in an elegant grid.
They can narrow by scent family (e.g. floral, woody, gourmand) with simple filters, and the
choice is reflected in the URL so it can be shared or bookmarked. Each fragrance links to
its product page. Everything is French, responsive, and never dead-ends.

## Acceptance criteria

- **AC-1:** `/collection` lists all fragrances in a grid, each linking to its product page.
- **AC-2:** Simple scent-family filters let the visitor narrow the grid; the active filter
  is shown and reflected in the URL (`/collection?famille=…`), shareable and bookmarkable.
- **AC-3:** A “Tout” option clears the filter; an unknown/empty family shows all (no crash,
  no empty dead-end).
- **AC-4:** The header/footer “Collection”, the hero CTA, and product “Retour à la
  collection” lead here.
- **AC-5:** Responsive at 390 px and 1440 px, screenshot-verified; works without client JS
  (filters are links, server-rendered).

## Out of scope

- Search, sorting, pagination, price/àvailability filters (only simple family filters).
- Real Supabase data + admin (own spec) — still the in-code seed.
- Multiple collections (only “Karnain Addicte” exists today).

## CUJ impact

- Registers **CUJ-C — Browse the collection**: open `/collection` → filter by family →
  open a fragrance. Added to `../../docs/product/critical-user-journeys.md` at ship.

## Open questions

- Delete when empty.
