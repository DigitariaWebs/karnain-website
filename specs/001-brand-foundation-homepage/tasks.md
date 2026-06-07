# Tasks 001 — Brand foundation & luxury homepage

Source of truth for progress. Each task maps to acceptance criteria in `spec.md`.
**All tasks complete — `pnpm verify` green, CUJ-A + CUJ-02 e2e passing (2026-06-07).**

## Design system

- [x] Luxury tokens in `globals.css` (ivory/ink/gold, crisp radius, font tokens) — AC-1, AC-6
- [x] Fonts (Cormorant Garamond + Jost) + `lang="fr"` + Karnain metadata in `layout.tsx` — AC-1
- [x] `reveal` motion variant + `Reveal` wrapper in `components/motion.tsx` (reduced-motion safe) — AC-7

## i18n + config (core)

- [x] `core/i18n` locales + fr dictionary + `getDictionary` — AC-1
- [x] `core/i18n` unit test — AC-1
- [x] `core/site.ts` brand config + WhatsApp/email link builders — AC-5

## Shell (shared)

- [x] `components/layout/container.tsx` — AC-6
- [x] `components/ui/icons.tsx` (inline SVG) — AC-4
- [x] `components/layout/site-header.tsx` + `mobile-nav.tsx` client leaf — AC-4
- [x] `components/layout/site-footer.tsx` (brand, contact, social, legal) — AC-4
- [x] Wire header/footer into `app/layout.tsx` — AC-4

## Catalog slice

- [x] `features/catalog/types.ts` — AC-3
- [x] `features/catalog/data.ts` seed + async selectors — AC-3
- [x] `features/catalog/components` (fragrance-card, fragrance-grid) — AC-3
- [x] `features/catalog/index.ts` public API — AC-3
- [x] `features/catalog/data.test.ts` — AC-3

## Homepage

- [x] `app/page.tsx`: hero (AC-2) → signatures + collection (AC-3) → brand story → inquiry CTA (AC-5)
- [x] Calm reveal motion on section entrances — AC-7
- [x] Responsive at 390 px and 1440 px — AC-6

## Verify

- [x] Rewrite `e2e/home.spec.ts` → CUJ-A (sections + WhatsApp link + mobile menu) — AC-1…AC-7
- [x] Register CUJ-A in `docs/product/critical-user-journeys.md`; add living feature doc — AC-1
- [x] `pnpm verify` green
- [x] `pnpm e2e:shots` desktop + mobile → inspected against AC-1…AC-7

## Open (carried to follow-up specs)

- [ ] Real WhatsApp number / contact email / Instagram (placeholders in `core/site.ts`)
- [ ] Product imagery (zip) → replace placeholders with `next/image`
- [ ] Per-fragrance copy (notes/mood/description) for the product page (spec 2)
