import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
