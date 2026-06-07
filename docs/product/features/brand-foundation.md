# Brand foundation & homepage

**Status:** live · **Slice:** src/features/catalog (+ shared shell, design tokens) · **Routes:** /
**Spec history:** specs/001-brand-foundation-homepage (active 2026-06-07)

## What it does (user terms)

The visitor lands on a French luxury homepage for Karnain: a refined hero, the signature
fragrances, the full “Karnain Addicte” collection, a short brand story, and a contact CTA
that opens WhatsApp. A persistent header (with a mobile menu) and footer frame every page.
No checkout, no customer login — purchase converts through inquiry.

## How it works

- **Design system** lives in `src/app/globals.css` (ivory/ink/gold tokens, crisp radius)
  and `src/app/layout.tsx` (Cormorant Garamond serif + Jost sans via `next/font`, `lang="fr"`).
- **i18n** is `src/core/i18n` — French-only dictionary today, structured so locales are
  additive. Brand/contact config (incl. the WhatsApp/email link builders) is `src/core/site.ts`.
- **Shell** is `src/components/layout` (`Container`, `SiteHeader` + `MobileNav` client leaf,
  `SiteFooter`); inline icons in `src/components/ui/icons.tsx`.
- **Catalog** is the `catalog` slice: types + an async, Supabase-shaped seed data layer
  (`getFragrances`, `getFeaturedFragrances`, `getCollection`, …) and presentational
  `FragranceCard` / `FragranceGrid`. The homepage (`src/app/page.tsx`) fetches on the
  server and composes the sections; `Reveal` (in `components/motion.tsx`) adds calm,
  reduced-motion-safe entrances.

## Decisions & gotchas

- 2026-06-07: v1 catalog is an **in-code seed** behind async selectors — swap the bodies in
  `catalog/data.ts` for Supabase queries later without touching callers.
- 2026-06-07: Fragrance imagery is an **intentional tonal placeholder** until the asset zip
  arrives; replace the panel in `fragrance-card.tsx` with `next/image`.
- 2026-06-07: WhatsApp number, contact email, and Instagram URL in `core/site.ts` are
  **placeholders** (`TODO(client)`); legal pages are noted as forthcoming in the footer.
- 2026-06-07: Fragrance cards are display-only in v1; they become links when the product
  page ships (spec 2).

## Decisions & gotchas

- 2026-06-07 (spec 004): the homepage also carries a full-bleed **campaign band**
  (`public/images/campaign.png`) and an **Instagram strip** (`public/images/ig-1…4.png`,
  linking to `site.instagramUrl`). Below-the-fold imagery is lazy `next/image` — expected,
  not a bug, if a full-page screenshot shows them blank.

## CUJs covered

- CUJ-A — Discover the house ([critical-user-journeys.md](../critical-user-journeys.md))
