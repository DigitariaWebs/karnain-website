# Tasks 010 — Admin image upload

- [ ] Storage bucket `product-images` (public) + admin‑only write RLS — AC-1, AC-4
- [ ] `next.config.ts`: `images.remotePatterns` for Supabase Storage — AC-3
- [ ] `image-uploader.tsx` (client): upload to Storage, thumbnails, remove, hidden URL field — AC-2
- [ ] `product-form.tsx`: use the uploader instead of the images text field — AC-2
- [ ] `pnpm verify` green; CUJ‑A/B/C pass — AC-5
- [ ] Live: upload on a fragrance → shows on the product page; clean up — AC-5
- [ ] Docs: admin feature doc + ADR note if needed
