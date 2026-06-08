# Tasks 012 — Admin integration settings

- [x] `app_settings` table, RLS deny-all, service_role grant, seed — AC-1
- [x] `core/settings/server.ts` (get/save via service role) — AC-1
- [x] `core/stripe`: `getStripe(secretKey)` + `credentials.ts` (settings→env), `isCheckoutLive()` — AC-3
- [x] `/api/checkout` POST uses resolved creds; GET returns `{ enabled }` — AC-3/4
- [x] `/api/stripe/webhook` uses resolved creds — AC-3
- [x] admin: `settings.ts` (masked), `settings-form`, `saveSettings` action, `/admin/parametres`, nav — AC-2
- [x] `checkout-button`: fetch `/api/checkout` to gate enabled — AC-4
- [x] repo migration mirror; `.env.example` note; docs/ADR-0006 update — AC-1
- [x] `pnpm verify` green; CUJ pass; live check (set/clear a key) — AC-5
