import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Vercel's built-in optimizer bills per distinct source image and this project has run out
    // of quota, which turns every new image into a broken <img> (402 OPTIMIZED_IMAGE_REQUEST_
    // PAYMENT_REQUIRED) instead of a resized one. Serving originals unoptimized is reliable and
    // free; source assets (catalog photos, hero sprites) are pre-sized/compressed by hand instead.
    unoptimized: true,
    // Allow next/image to serve admin-uploaded photos from Supabase Storage
    // (public bucket). Repo-shipped `/images/...` paths keep working unchanged.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
