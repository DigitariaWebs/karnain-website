# Tasks 010 — Admin image upload

- [x] Storage bucket `product-images` (public) + admin‑only write RLS — AC-1, AC-4
- [x] `next.config.ts`: `images.remotePatterns` for Supabase Storage — AC-3
- [x] `image-uploader.tsx` (client): upload to Storage, thumbnails, remove, hidden URL field — AC-2
- [x] `product-form.tsx`: use the uploader instead of the images text field — AC-2
- [x] `pnpm verify` green; CUJ‑A/B/C pass — AC-5
- [x] Live: upload on a fragrance → shows on the product page; clean up — AC-5
- [x] Docs: admin feature doc + ADR note if needed
