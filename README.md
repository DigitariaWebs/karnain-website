# Karnain — Maison de parfum

The website for **Karnain**, a French luxury perfume house: an elegant, French-language
storefront — homepage, collection, product pages, a guest shopping bag, and an admin back
office — built on a production-grade Next.js harness where specs carry intent, docs carry
knowledge, gates enforce taste, and screenshots prove the result.

> Agents: your entry point is [AGENTS.md](AGENTS.md). Humans: keep reading.

## Stack

Next.js 16 (App Router, RSC) · TypeScript strict · Tailwind CSS v4 + shadcn/ui · Zustand 5 ·
Motion · Supabase (`@supabase/ssr`) · Vitest + Testing Library · Playwright · pnpm ·
ESLint 9 (+ enforced module boundaries) · Prettier. Hosting: Vercel.

## Quickstart

```bash
corepack enable                       # or: npm i -g pnpm
pnpm install
pnpm exec playwright install chromium # once, for e2e + screenshots
cp .env.example .env.local            # optional — the site runs on a seed catalog without it
pnpm dev                              # http://localhost:3000
pnpm verify                           # full local gate (lint, types, format, docs, tests, build)
pnpm e2e                              # Playwright CUJs
```

## Supabase (optional until you have a project)

The catalog reads from **Supabase when configured, and an in-code seed otherwise** — so the
site works with zero configuration. To go live with a managed catalog + admin:

1. Set in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=…
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=…
   ```
2. Run the migration `supabase/migrations/*_init_catalog.sql` against your project
   (Supabase SQL editor or `supabase db push`). It creates `collections` + `fragrances`
   with RLS (public read, admin write) and seeds the catalog.
3. Create an admin user in the Supabase dashboard (Auth → Users). There is no public
   sign-up. Sign in at **`/admin`** to manage fragrances.

See [ADR-0005](docs/architecture/decisions/0005-supabase-data-layer.md) and
[docs/product/features/admin.md](docs/product/features/admin.md).

## Catalog

Seven fragrances at €195 under “Karnain Addicte”: Tobacco, Cuir 90, Rose des Îles,
Tentation, Sucre Addictée, Rose des Bois, Cherry Je t’aime. Real photography is wired for
five; Sucre Addictée and Rose des Bois use elegant placeholders until photos exist. Source
assets live in `public/images/`.

## How work happens here

Spec-driven: a change starts as a spec in `specs/NNN-*`, is planned, implemented in small
verified steps, and documented as a living feature doc in `docs/product/features/`. The
process, roles, and conventions are in [AGENTS.md](AGENTS.md) and
[docs/](docs/INDEX.md). A change is mergeable when `pnpm verify` and `pnpm e2e` pass.

## Map

```
AGENTS.md            agent operating model (CLAUDE.md imports it)
docs/                knowledge tree — INDEX.md is the map; product/, conventions/, architecture/ADRs
specs/               constitution + feature specs (001–006)
src/app/             routes — (site) public chrome, (admin) back office
src/features/        vertical slices: catalog, cart, admin
src/components/       shared UI + layout (header, footer)
src/core/            env, site config, i18n, supabase clients
supabase/migrations/ catalog schema (RLS + seed)
e2e/                 Playwright CUJs → artifacts/screenshots/ evidence
public/images/        product + campaign imagery
```

## Why it’s built this way

Every structural decision has an ADR in
[docs/architecture/decisions/](docs/architecture/decisions/README.md); the two-page version
is [docs/architecture/overview.md](docs/architecture/overview.md) and the engineering
[constitution](specs/constitution.md).
