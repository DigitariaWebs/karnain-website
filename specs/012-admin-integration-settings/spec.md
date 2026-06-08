# Spec 012 — Admin-managed integration settings (secure)

- **Status:** active
- **Type:** feature
- **Requested by / owner:** Karnain (client) / Achraf Arabi
- **Date:** 2026-06-08
- **Slice / areas touched:** `src/core/settings` (new), `src/core/stripe`, `src/features/admin`
  (settings page/form/action), `src/app/(admin)`, `src/app/api/checkout`, `supabase/migrations`

## Problem (the why)

Turning on payments currently means a developer setting Vercel env vars. The maison should be
able to **enter its Stripe credentials from the admin** and flip checkout live itself — but
secret keys must never leak to the browser or to non-admins.

## Desired behavior (the what)

An admin opens **Paramètres** in the back office, sees which integrations are configured
(masked — never the raw secret), and pastes/replaces the Stripe keys. Saving stores them
server-side; checkout immediately uses them. With nothing set, the bag stays in “paiement
bientôt”. Supabase’s own keys remain in env (they bootstrap the app); the **service-role key**
in env is what lets the server read these stored settings.

## Acceptance criteria

- **AC-1:** An `app_settings` table holds the Stripe credentials with **RLS that denies all
  Data-API access** (no policies) — only the **service-role** server reads/writes it. Secrets
  are never returned to any browser token, including an admin’s.
- **AC-2:** `/admin/parametres` (admin-only) shows each Stripe key’s **masked status**
  (configured / last 4) and a write-only form; submitting non-empty fields stores them; blank
  fields keep the existing value. The save action verifies the caller is an admin first.
- **AC-3:** Checkout/webhook resolve Stripe credentials from **settings first, then env**;
  `getStripe` takes the resolved secret. Reading settings requires the service-role key.
- **AC-4:** `GET /api/checkout` returns `{ enabled }` so the bag button reflects live config
  without exposing secrets; the button enables only when checkout is configured.
- **AC-5:** `pnpm verify` green; CUJ-A/B/C pass; verified live (set a dummy key from admin →
  status shows configured; clear it → bag returns to “bientôt”).

## Out of scope

- Managing Supabase URL/keys from the admin (they bootstrap the app — must stay in env).
- Column-level encryption / Vault (RLS deny-all + service-role-only is the boundary here);
  email/SMS provider settings, multi-tenant settings.

## CUJ impact

- No public CUJ change. Enables the admin to self-serve the checkout configuration.

## Open questions

- [ ] Rotate the service-role key after setup (it was shared in chat).
