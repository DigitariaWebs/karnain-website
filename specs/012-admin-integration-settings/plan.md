# Plan 012 — Admin integration settings

## Schema (done via MCP; mirror in repo)

- `app_settings` (single row `id='default'`): `stripe_secret_key`, `stripe_webhook_secret`,
  `stripe_publishable_key`, `updated_at`. **RLS enabled, no policies** (deny-all to the Data
  API); `grant ... to service_role`; seed the row.

## Core

- `src/core/settings/server.ts` (`server-only`): `getAppSettings()` (service-role read →
  camelCase) and `saveAppSettings(partial)` (service-role update of non-undefined fields).
  Returns `null` when `hasServiceRole()` is false.
- `src/core/stripe/server.ts`: `getStripe(secretKey)` now takes the resolved key.
- `src/core/stripe/credentials.ts` (`server-only`): `getStripeCredentials()` = settings values
  (when service role present) **falling back to env**; `isCheckoutLive()` = secret + supabase +
  service role.

## App routes

- `app/api/checkout/route.ts`: resolve via `getStripeCredentials()`; `GET` returns
  `{ enabled: isCheckoutLive() }` for the bag button. `POST` uses the resolved secret.
- `app/api/stripe/webhook/route.ts`: resolve secret + webhook secret from credentials.

## Features (admin)

- `src/features/admin/settings.ts` (`server-only`): `getSettingsStatus()` → masked booleans +
  publishable last-4 (reads `getAppSettings`).
- `components/settings-form.tsx` (client): three write-only password inputs with “configurée”
  hints; submits via `saveSettings`. `actions.ts`: `saveSettings` — verify admin
  (`authedClient`), then `saveAppSettings` (service-role) with non-empty fields only.
- `app/(admin)/admin/parametres/page.tsx` (guarded) + dashboard “Paramètres” link.

## Cart

- `checkout-button.tsx`: drop the `NEXT_PUBLIC_*` gate; `GET /api/checkout` on mount → enable
  only when `{ enabled }`.

## Verify

- `pnpm verify` green; CUJ pass. Live: from `/admin/parametres` set a test publishable key →
  status shows configured; the table is unreadable via the anon/publishable key (confirm RLS).

## Conflict check

Builds on 011 (checkout). Touches core/stripe + checkout routes + admin. No overlap.
