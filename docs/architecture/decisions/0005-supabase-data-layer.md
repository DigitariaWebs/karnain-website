# 0005 — Use Supabase for the catalog data layer and admin auth

- **Status:** Accepted
- **Date:** 2026-06-07
- **Deciders:** progix (engineering), Karnain (product)

## Context

The catalog was an in-code seed; the brief names Supabase as the data layer and wants an
admin-only back office to manage fragrances. The client has no Supabase project yet, so the
integration must add no hard dependency: the site must run with zero configuration and light
up when keys appear. Triggered by spec 005.

## Decision

- Adopt **Supabase** (Postgres + Auth) as the catalog data source and the admin
  authentication provider, integrated via **`@supabase/ssr`** + **`@supabase/supabase-js`**.
- Read access goes through a catalog repository that uses Supabase **when configured**
  (`NEXT_PUBLIC_SUPABASE_URL` + publishable key present) and **falls back to the in-code
  seed** otherwise — same selector signatures either way.
- RLS is mandatory: public read, authenticated (admin) write. No public sign-up; admin users
  are created in the Supabase dashboard. Secrets stay server-side; only the URL + publishable
  key are exposed to the browser.

## Alternatives considered

| Option                         | Why not                                                                                   |
| ------------------------------ | ----------------------------------------------------------------------------------------- |
| Keep the in-code seed only     | No self-serve catalog editing; the brief requires an admin-managed data layer.            |
| A bespoke API + separate DB    | More to build and operate; Supabase gives Postgres, Auth, and RLS out of the box.         |
| Prisma/Drizzle ORM on a raw DB | Extra layer; Supabase client + zod-parsed reads are enough for this catalog’s shape.      |
| Next-Auth for admin auth       | Supabase Auth is already present with the data layer and integrates with RLS via the JWT. |

## Consequences

- Positive: catalog becomes editable without deploys; the site keeps working with no keys
  (graceful fallback); RLS centralizes authorization in the database.
- Negative / accepted trade-offs: a second runtime dependency (Supabase) and its env config;
  numeric prices stored as `integer` (whole euros) to keep client typing simple.
- Follow-ups: client provides project URL + publishable key and creates admin users; later
  specs may add Supabase Storage for images and Stripe for checkout.
