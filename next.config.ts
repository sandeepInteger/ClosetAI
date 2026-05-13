import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "ws",
    "@prisma/adapter-neon",
    "@neondatabase/serverless",
  ],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
      { protocol: "https", hostname: "v3.fal.media", pathname: "/**" },
      { protocol: "https", hostname: "v3b.fal.media", pathname: "/**" },
      { protocol: "https", hostname: "fal.media", pathname: "/**" },
    ],
  },
};

export default nextConfig;
