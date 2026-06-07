# Plan 004 — Editorial campaign & Instagram

Homepage composition + assets only. No new slice, no route.

## Assets (`public/images`)

- `campaign.png` — soft-hued collection landscape for the full-bleed band.
- `ig-1…ig-4.png` — curated lifestyle tiles (Cuir/leather, Rose/marble, Cherry/macro,
  Tentation/marble). All de-duplicated from the asset zip.

## i18n (`messages/fr.ts`)

- `campaign`: `eyebrow`, `title` (short brand line), `cta`.
- `instagram`: `eyebrow`, `handle`, `cta` (links to `site.instagramUrl`).

## Homepage (`src/app/page.tsx`)

- **Campaign band** after the story section: full-bleed `next/image` (`campaign.png`) with a
  dark overlay, centered eyebrow + serif line + a light CTA to `/collection`. `Reveal`-wrapped.
- **Instagram strip** after the contact section: an eyebrow + handle, a responsive grid of
  the four `ig-*` tiles (each an `<a>` to `site.instagramUrl`, new tab, `aria-label`), and a
  “Nous suivre sur Instagram” link. `next/image`, `object-cover`, square tiles.

## Verification

- e2e: extend `e2e/home.spec.ts` (CUJ-A) to assert the Instagram link (href to instagram,
  new tab) and capture the updated full-page shot.
- `pnpm verify` green; inspect the homepage shot vs AC-1…AC-4.

## Conflict check

Builds on 003 (in `main`). Touches only `app/page.tsx`, `core/i18n`, `public/images`. No
overlap with other specs.
