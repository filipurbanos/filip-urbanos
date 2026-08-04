import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "*.blob.vercel-storage.com",
      },
    ],
  },
  experimental: {
    // Large admin video uploads (94MB+ file + multipart overhead)
    serverActions: {
      bodySizeLimit: "200mb",
    },
    proxyClientMaxBodySize: "250mb",
  },
};

export default nextConfig;
