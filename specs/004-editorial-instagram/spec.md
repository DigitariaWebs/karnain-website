# Spec 004 — Editorial campaign & Instagram on the homepage

- **Status:** active
- **Type:** feature
- **Requested by / owner:** Karnain (client, via Marouane) / progix
- **Date:** 2026-06-07
- **Slice / areas touched:** `src/app/page.tsx`, `src/core/i18n`, `public/images`

## Problem (the why)

The brand has rich campaign/lifestyle imagery but the homepage uses it only for products.
A luxury maison tells a story between the product blocks (cf. MFK’s editorial bands) and
points visitors to its social presence. The homepage needs a cinematic campaign moment and
an Instagram touchpoint so the brand feels alive and marketing assets are integrated.

## Desired behavior (the what)

Scrolling the homepage, the visitor meets a full-bleed campaign band — an evocative image
with a short brand line and a way into the collection — and, lower down, a “Suivez-nous”
Instagram strip of lifestyle images linking to the brand’s Instagram. Both are French,
responsive, and reduced-motion safe.

## Acceptance criteria

- **AC-1:** The homepage shows a full-bleed campaign band (image + brand line + a CTA into
  the collection) between the story and contact sections.
- **AC-2:** The homepage shows an Instagram strip (several lifestyle images) with a clear
  link to the brand’s Instagram, opening in a new tab.
- **AC-3:** Imagery uses `next/image`; the band text is legible over the image (overlay).
- **AC-4:** Responsive at 390 px and 1440 px, screenshot-verified; no layout shift that
  breaks the existing sections.

## Out of scope

- A live Instagram feed/API integration (static curated tiles only).
- New routes or data; this is a homepage composition + assets change.

## CUJ impact

- Extends **CUJ-A** (Discover the house): the campaign band + Instagram strip are part of
  the landing experience; `e2e/home.spec.ts` asserts the Instagram link.

## Open questions

- Delete when empty.
