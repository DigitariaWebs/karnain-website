# Spec 005 — Supabase data layer & admin back office

- **Status:** active
- **Type:** feature
- **Requested by / owner:** Karnain (client, via Marouane) / progix
- **Date:** 2026-06-07
- **Slice / areas touched:** `src/core/supabase`, `src/core/env`, `src/features/catalog` (repo + fallback), `src/features/admin` (new), routes `src/app/(admin)`, `supabase/migrations`, ADR-0005

## Problem (the why)

The catalog is an in-code seed: editing it needs a developer + deploy. The brief wants
Supabase as the data layer and an admin-only back office so the maison can manage fragrances
itself. We scaffold both now, but the client has no Supabase project yet — so it must work
with **zero configuration**, falling back to the seed, and light up automatically once keys
are provided.

## Desired behavior (the what)

With no Supabase keys, the public site behaves exactly as today (reads the seed). When a
Supabase project URL + key are set, the same pages read fragrances/collections from
Supabase instead, with no code change. An admin can sign in at an admin URL (Supabase Auth,
no public sign-up) and manage fragrances (list, create, edit, delete); writes go to
Supabase. Visitors never see admin UI and are never asked to sign in.

## Acceptance criteria

- **AC-1:** With no Supabase env vars, `pnpm verify` is green and the public site renders
  the seed catalog exactly as before (graceful fallback, no errors).
- **AC-2:** The catalog read functions return Supabase data when configured (URL + key
  present) and the seed otherwise, behind unchanged signatures.
- **AC-3:** A SQL migration creates `collections` + `fragrances` with **RLS enabled**:
  public read, authenticated (admin) write; plus a seed insert mirroring the 7 fragrances.
- **AC-4:** An admin area (its own layout, no public shell) gates on a Supabase session and
  redirects unauthenticated users to an admin login; when Supabase is unconfigured it shows
  a clear “connect Supabase” notice instead of a broken login.
- **AC-5:** Admin product management (list + create/edit/delete) via zod-validated server
  actions writing to Supabase (active once configured).
- **AC-6:** Secrets stay server-side; only `NEXT_PUBLIC_SUPABASE_*` (URL + publishable key)
  reach the browser; `.env.example` documents them; an ADR records the decision.

## Out of scope

- A live Supabase project / real keys (client provides later) — fallback until then.
- Customer accounts (admin-only auth), order management, payments.
- Image uploads to Supabase Storage (admin edits text fields + image paths for now).

## CUJ impact

- No public CUJ change (admin is internal). Admin is verified by an acceptance path, not a
  public CUJ.

## Open questions

- [ ] Client to provide Supabase project URL + publishable key (and create admin users in
      the dashboard) to activate. Service-role flows (if needed) come with a later spec.
