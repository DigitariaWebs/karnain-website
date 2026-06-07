# Karnain — Launch report

**Date:** 2026-06-07 · **Prepared by:** Achraf Arabi · **Audience:** product (PM) + engineering
**Repository:** https://github.com/DigitariaWebs/karnain-website ·
**Live:** https://karnain-website.vercel.app

A refined, French-language website for the Karnain perfume house: an editorial homepage with
a Blender-rendered 3D video hero, product pages with a guest shopping bag, a filterable
collection, an Instagram-integrated brand story, and a Supabase-backed catalog with an admin
back office. Built spec-by-spec on a Next.js harness where every change is gated, tested, and
screenshot-evidenced.

---

# Part 1 — For product (PM)

## What it is

A premium brand + e-commerce storefront that makes a visitor feel the maison and move from
discovery → a fragrance → the bag with no friction. Anchored on the restrained editorial
luxury of the reference the client cited (Maison Francis Kurkdjian): ivory canvas, refined
serif display, generous whitespace, large imagery, calm motion. French-only at launch, on
i18n foundations so other locales are additive later.

## Feature inventory

| Spec | Feature                        | Status | Notes                                                            |
| ---- | ------------------------------ | ------ | ---------------------------------------------------------------- |
| 001  | Brand foundation & homepage    | Live   | Design system, header/footer shell, French i18n                  |
| 002  | Shop — product page & bag      | Live   | Gallery + lightbox, scent notes, guest cart (drawer + `/panier`) |
| 003  | Collection page                | Live   | Scent-family filters via shareable URLs                          |
| 004  | Editorial campaign + Instagram | Live   | Campaign band + “Suivez-nous” lifestyle strip                    |
| 005  | Supabase data layer + admin    | Live\* | Catalog from Supabase with seed fallback; admin CRUD at `/admin` |
| 007  | 3D video hero + contrast       | Live   | 360° bottle video (Blender), legibility scrim                    |
| 008  | Brand logo                     | Live   | KARNAIN · PARIS wordmark in header, footer, mobile menu          |

\* Runs on a built-in seed catalog today; activates against Supabase the moment keys are added.

## Commerce model

- **Cart / bag** (standard luxury e-commerce, LV / JPG style): add to bag → bag drawer →
  cart page. Guest bag, persisted locally — no customer login to shop. (Revised from an
  earlier WhatsApp-inquiry idea, which read as mass-market for the maison.)
- **Checkout / payment is intentionally deferred** (Stripe) pending the payment provider and
  legal/CGV. The cart page shows the order and a clear “paiement bientôt”.

## Catalog & content

Seven fragrances at €195 under “Karnain Addicte”: Tobacco, Cuir 90, Rose des Îles, Tentation,
Sucre Addictée, Rose des Bois, Cherry Je t’aime — grouped into scent families (Boisés &
ambrés, Floraux, Gourmands) that power the collection filters. Real photography is wired for
five; Sucre Addictée and Rose des Bois show tasteful placeholders until photos exist.

## The 3D product video (Blender)

The hero background is a bespoke **3D product render created in Blender**. The source scene
(`3d-showcase/karnain-tobacco.blend`) animates a 360° turntable of the Tobacco bottle on a
marble pedestal; it is rendered to frames and exported to a web video. Only the optimized web
assets are committed (1080p H.264, ~6 s loop, 1.6 MB) — the heavy Blender project and frames
stay out of the repo. It autoplays muted and loops, with a still poster fallback for
reduced-motion users, under a contrast scrim so the headline stays legible.

## Outstanding (needs client input)

- **Supabase** project URL + publishable key → managed catalog + admin go live.
- **Real contact** — email + phone (placeholders today) and **legal / CGV** copy.
- **Payment** — decision + Stripe keys → enable checkout.
- **Photos** — Sucre Addictée + Rose des Bois (or a decision to drop them).
- **Domain** — point `karnain.fr` at the Vercel project when ready.

## The experience

### Homepage — 3D video hero

![Karnain homepage hero](karnain-launch/img/home.png)

### Product page — gallery, notes, add to bag

![Karnain product page](karnain-launch/img/product.png)

### Collection — scent-family filters

![Karnain collection page](karnain-launch/img/collection.png)

---

# Part 2 — For engineering

## Stack

Next.js 16 (App Router, React Server Components), TypeScript strict (`noUncheckedIndexedAccess`),
Tailwind CSS v4 + shadcn/ui, Zustand 5 (guest bag), Motion, Supabase (`@supabase/ssr`),
Vitest + Testing Library, Playwright. Package manager pnpm. Hosting: Vercel.

## Architecture & module boundaries

Layered, ESLint-enforced: `app → features → shared (components, hooks, lib) → core`. Features
never import other features (admin uses structural props, not the catalog type). Feature
slices:

- **`catalog`** — fragrance/collection types, data access (Supabase-or-seed), product UI
  (card, grid, gallery with keyboard lightbox, scent-notes).
- **`cart`** — SSR-safe Zustand store (`persist`, lines only) + provider; bag button (header),
  slide-over drawer, cart-page view.
- **`admin`** — Supabase-auth session guard, zod-validated server actions (upsert/delete),
  product table + form.

Routes use groups: `app/(site)` (public chrome — header/footer/cart) and `app/(admin)`
(minimal admin chrome). Route groups don’t change URLs.

## Data layer & fallback

Catalog selectors are async and source-agnostic: when `NEXT_PUBLIC_SUPABASE_URL` +
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are present they read from Supabase
(`features/catalog/supabase-repo.ts`, zod-parsed rows), otherwise they return the in-code
seed (`features/catalog/data.ts`). The Supabase repo is a `server-only` module imported
dynamically only when configured, so the site builds and runs with zero configuration and the
selectors stay unit-testable.

## Admin & security

- Supabase Auth, no public sign-up (authenticated == admin; create users in the dashboard).
- SQL migration `supabase/migrations/*_init_catalog.sql`: `collections` + `fragrances`, **RLS
  enabled** (public read, authenticated write), grants, and a seed insert.
- Only the URL + publishable key reach the browser; the service-role key stays server-side.
- `/admin` is `noindex`; when unconfigured it shows a “connect Supabase” notice, never a
  broken login.

## 3D video pipeline

`3d-showcase/karnain-tobacco.blend` → rendered frames → `karnain-tobacco-360.mp4`, exported to
`public/video/hero.mp4` (+ poster `public/images/hero-poster.png`). Rendered by
`components/layout/hero-background.tsx` (autoplay/muted/loop/playsInline; `useReducedMotion`
falls back to the poster). The Blender source is git-ignored via `/3d-showcase/`.

## Quality gates & CUJs

`pnpm verify` runs lint (+ boundaries), TypeScript, Prettier, docs-link integrity,
copy/typography, unit tests, and a production build. Critical user journeys (Playwright):

- **CUJ-A** Discover the house · `e2e/home.spec.ts`
- **CUJ-B** Explore a fragrance, fill the bag · `e2e/product.spec.ts`
- **CUJ-C** Browse the collection · `e2e/collection.spec.ts`

## Repository layout

```
src/app/(site)|(admin)   routes (public chrome / admin chrome)
src/features/            catalog · cart · admin (vertical slices, public API via index.ts)
src/components/          ui + layout (header, footer, hero-background)
src/core/                env, site config, i18n, supabase clients
supabase/migrations/     catalog schema (RLS + seed)
docs/ · specs/           knowledge tree + feature specs (constitution, ADRs)
e2e/ · artifacts/        Playwright CUJs → screenshot evidence
```

## Run, test, deploy

```bash
pnpm install
pnpm dev                 # http://localhost:3000
pnpm verify              # full local gate
pnpm e2e                 # critical user journeys
pnpm report:pdf <slug>   # render docs/reports/<slug>.md → PDF
```

Deployed on Vercel (Next.js auto-detected, GitHub repo connected for auto-deploys on push).
No environment variables required — it runs on the seed until Supabase keys are added in the
Vercel project settings. Architecture decisions are recorded as ADRs in
`../architecture/decisions/` (e.g. ADR-0005, Supabase with seed fallback).

## Verification summary

`pnpm verify` green and CUJ-A/B/C green at time of writing; per-journey screenshots in
`artifacts/screenshots/`. Production smoke-checked: `/`, `/collection`, `/parfums/[slug]`,
`/video/hero.mp4`, and `/logo.png` all return 200.
