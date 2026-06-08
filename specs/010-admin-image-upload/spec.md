# Spec 010 — Admin image upload (Supabase Storage)

- **Status:** active
- **Type:** feature
- **Requested by / owner:** Karnain (client) / Achraf Arabi
- **Date:** 2026-06-08
- **Slice / areas touched:** `src/features/admin` (uploader, form), `src/core/supabase`, `next.config.ts`, Supabase Storage

## Problem (the why)

The admin edits a fragrance’s images by typing file paths (`/images/...`) — useless to a
non‑technical editor, and it can only reference files already shipped in the repo. The old
WooCommerce admin let the maison upload images from the media library. Our admin needs real
**image upload**, so an editor can add/replace product photos without a developer.

## Desired behavior (the what)

In the admin product form, an editor uploads one or more images from their computer. Each
upload goes to Supabase Storage, shows as a thumbnail, and can be removed/reordered (first =
primary). On save, the fragrance stores the resulting public image URLs. The storefront shows
them immediately (cards, gallery). Visitors can view images; only admins can upload/delete.

## Acceptance criteria

- **AC-1:** A `product-images` Storage bucket exists (public read), with **RLS so only admins**
  (`app_metadata.role = 'admin'`) can upload/replace/delete.
- **AC-2:** The admin product form replaces the images text field with an **uploader**: pick
  files → they upload to Storage → thumbnails appear; the first image is the primary; images
  can be removed. Saving stores the public URLs in `fragrances.images`.
- **AC-3:** The storefront renders Storage‑hosted images (cards + gallery) via `next/image`
  (the Supabase host is allowed in `next.config` `remotePatterns`). Existing repo‑path images
  keep working.
- **AC-4:** Upload is gated to authenticated admins; a non‑admin/anon cannot upload (Storage RLS).
- **AC-5:** `pnpm verify` green; CUJ‑A/B/C still pass; verified live (an upload appears on a
  product page).

## Out of scope

- Image cropping/optimization UI, drag‑reorder polish (basic order = upload order, remove only),
  bulk import, alt‑text per image.
- Migrating the existing repo images into Storage (they keep working as `/images/...`).

## CUJ impact

- No public CUJ change (admin‑internal). CUJ‑A/B/C unaffected.

## Open questions

- Delete when empty.
