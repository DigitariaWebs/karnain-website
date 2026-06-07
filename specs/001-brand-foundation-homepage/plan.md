# Plan 001 — Brand foundation & luxury homepage

How we build the spec, within the layer model (`app → features → shared → core`) and the
conventions. No boundary crossings; the catalog is the only feature slice.

## Design system (shared/core surface)

- **Tokens** in `src/app/globals.css` (CSS-first, shadcn-compatible names kept so existing
  `ui/*` keeps working):
  - Palette in oklch: warm **ivory** background, **ink** foreground, soft warm grays for
    muted/secondary/border (hairlines), restrained **gold** detail token (`--color-gold`)
    used only for fine accents — never for hover fills.
  - Crisp `--radius` (editorial, low rounding).
  - Font tokens: `--font-serif` (display), `--font-sans` (body/labels), keep `--font-mono`.
- **Fonts** via `next/font/google` in `layout.tsx`: **Cormorant Garamond** (serif display)
  - **Jost** (sans). `lang="fr"`. Karnain `metadata`.
- **Motion**: reuse `m` + a calm `reveal` variant added to `src/components/motion.tsx`
  (opacity + small y, ~0.5s ease-out). `reducedMotion="user"` already global.
- No new dependencies: icons are inline SVG in `src/components/ui/icons.tsx`
  (lucide is declared but uninstalled; inline avoids an ADR and a client import).

## i18n + config (core — no React, imports nothing internal)

- `src/core/i18n/locales.ts`: `locales = ["fr"] as const`, `defaultLocale = "fr"`, `Locale`.
- `src/core/i18n/messages/fr.ts`: typed `as const` dictionary (curly quotes/apostrophes).
- `src/core/i18n/index.ts`: `getDictionary(locale)`; `type Dictionary`.
- `src/core/site.ts`: brand config — name, baseline, `whatsappNumber` (placeholder),
  `contactEmail`, `instagramUrl`, nav items, the WhatsApp deep-link builder.

## Catalog slice (`src/features/catalog`)

- `types.ts`: `Fragrance` (slug, name, collectionSlug, priceEur, mood, description, notes),
  `Collection` (slug, name, baseline, description). `readonly` fields, `as const` seed.
- `data.ts`: in-module seed (7 fragrances, “Karnain Addicte” collection) + **async**
  selectors (`getFragrances`, `getFeaturedFragrances`, `getCollections`, `getCollection`,
  `getFragrance`) — async so the Supabase repository swaps in later behind the same
  signatures. Pure (no `server-only`) so it is unit-testable.
- `components/` (RSC, presentational, receive data via props):
  `fragrance-card.tsx`, `featured-fragrances.tsx`, `collection-showcase.tsx`. Placeholder
  imagery is an intentional tonal panel with the fragrance name.
- `index.ts`: public API (types, data fns, components).
- `data.test.ts`: selector behavior (counts, lookup, featured limit).

## Shell (`src/components/layout`, shared)

- `container.tsx`: page width + gutters (the shared container pattern).
- `site-header.tsx` (server) with a `mobile-nav.tsx` (`"use client"` leaf) for the menu
  toggle; brand wordmark + nav. Nav uses in-page anchors + WhatsApp in v1 (no dead links
  to unbuilt routes); upgrades to real routes as specs 2–3 ship.
- `site-footer.tsx` (server): brand, contact, social, legal.
- Wire header/footer in `app/layout.tsx`.

## Homepage (`src/app/page.tsx`, composition only)

Server component: fetch `getFeaturedFragrances` + `getCollection` via the catalog public
API, compose: hero → collection presentation (featured fragrances) → brand story →
inquiry CTA (WhatsApp). Sections wrapped in the calm `reveal` where it explains entrance.
No business logic in the page.

## Verification

- Unit: `catalog/data.test.ts`, `core/i18n` test.
- `pnpm verify` green (lint/types/format/docs/typography/test/build).
- e2e: rewrite `e2e/home.spec.ts` → CUJ-A asserts the four sections + working WhatsApp
  link + keyboard focus; `FEATURE=001-brand-foundation-homepage pnpm e2e:shots` captures
  desktop + mobile shots into `artifacts/screenshots/001-brand-foundation-homepage/`.
- Inspect screenshots against AC-1…AC-7.

## Conflict check

No active specs other than the skeleton example (`001-task-list` is a demo, untouched).
This spec owns the shell, catalog slice, design tokens, and the home route. Touching
global tokens is shared surface — kept to this one spec; later feature specs consume, not
redefine, the tokens.
