# Brand foundation & homepage

**Status:** live · **Slice:** src/features/catalog (+ shared shell, design tokens) · **Routes:** /, /maison
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

- 2026-09-03: the hero carousel now runs on the client's **real product photographs** —
  `public/images/hero/sprites/*_center-photo.webp`. The six bottles were shot in one session on
  seamless black; the sprites are silhouette cutouts of those frames (edges un-premultiplied so
  no black fringe survives on the pale sweep), each scaled to one common bottle height and seated
  on the same baseline as the generated sprites they replace, so the stage framing, floor shadow,
  and backdrop palette were untouched. The generated `*_center-imagegen.webp` set and the earlier
  Blender sprites remain alongside them as recoverable source assets.
- 2026-08-30 (superseded above for the hero): the homepage hero was a six-fragrance carousel using
  transparent, photoreal generated bottle cutouts in
  `public/images/hero/sprites/*_center-imagegen.webp`.
- 2026-08-30: collection cards and product galleries use a matched set of six finished studio
  photographs in `public/images/fragrances/*-studio-v3.png`. Bottle geometry, labels, liquid
  colours, 86% fill lines, and droplets remain locked; a broad front-left softbox, restrained fill,
  warm stone bounce, glass refraction, and grounded contact shadows provide the photographic
  realism. Every published fragrance now has one — Rose des Bois, the last on a placeholder, was
  drafted out of the public catalog on 2026-09-07 (issue #2) pending an approved bottle reference.
- 2026-06-07 (spec 007): the **hero background is a 3D product video** (`public/video/hero.mp4`,
  a 360° Tobacco-bottle render) via `HeroBackground` — autoplay/muted/loop/playsInline, with
  a poster (`public/images/hero-poster.png`) and a `prefers-reduced-motion` fallback to the
  still. A gradient scrim (`from-black/75…`) plus text-shadow on the headline guarantees
  contrast over the light scene. The 3D source (`3d-showcase/`) is git-ignored; only the
  exported web assets are committed.
- 2026-08-12 (client feedback): the brand story now has its own page at **`/maison`**
  (`app/(site)/maison/page.tsx`) — Maroin asked for “une page en mettant l’histoire de la
  marque, pour faire rentrer les gens dans l’univers de la marque”. Nav “La maison” points
  there (was `/#histoire`); the homepage `#histoire` section stays as a teaser with a
  “Découvrir la maison” link. **The copy in `dict.maison` is deliberate placeholder** —
  evocative, asserting no sourceable history — pending the client’s real brand story. The
  pre-existing `dict.story` copy (Grasse, XVIᵉ siècle) is likewise unverified.
- 2026-06-07 (spec 004): the homepage also carries a full-bleed **campaign band**
  (`public/images/campaign.png`) and an **Instagram strip** (`public/images/ig-1…4.png`,
  linking to `site.instagramUrl`). Below-the-fold imagery is lazy `next/image` — expected,
  not a bug, if a full-page screenshot shows them blank.

## CUJs covered

- CUJ-A — Discover the house ([critical-user-journeys.md](../critical-user-journeys.md))
