# Plan 010 — Admin image upload

## Storage (Supabase, via MCP; mirror in `supabase/migrations`)

- Create a public bucket `product-images`.
- RLS on `storage.objects` for that bucket: public `select`; `insert`/`update`/`delete` only for
  authenticated with `app_metadata.role = 'admin'` (same model as the catalog).

## next.config

- Add `images.remotePatterns` for `**.supabase.co` `/storage/v1/object/public/**` so `next/image`
  can serve/optimize Storage URLs (repo `/images/...` paths keep working unchanged).

## Admin uploader (`src/features/admin/components/image-uploader.tsx`, client)

- Props: `name` (hidden field), `initial: readonly string[]`.
- State: list of image URLs (seeded from `initial`). Renders thumbnails (first = “Principale”),
  a file input (`accept="image/*"` multiple), and a remove button per image.
- On file pick: upload each via the browser Supabase client
  (`createSupabaseBrowserClient().storage.from('product-images').upload(path, file)`), where
  `path = <slug-or-uuid>/<timestamp>-<name>`; get the public URL; append to state.
- Keeps a hidden `<input name={name}>` with the comma‑joined URLs so the existing form +
  `saveFragrance` action (which already parses `images`) need no change.
- Disables the input while uploading; shows errors inline.

## Form integration

- In `product-form.tsx`, replace the images `Input` with `<ImageUploader name="images"
initial={initial?.images ?? []} />`. The product `slug` field value seeds the storage path
  (read from the form or default to a uuid).

## Verification

- `pnpm verify` green; CUJ‑A/B/C pass.
- Storage advisors/security: admin‑only writes; public read.
- Live: sign in to `/admin`, upload an image to a fragrance, save → it appears on the product
  page and card. Then clean up the test image.

## Conflict check

Touches `admin` slice + `next.config` + Storage. No overlap with other active specs. Builds on
spec 005 (clients) and 009 (catalog).
