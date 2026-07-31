import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Large admin video uploads (94MB+ file + multipart overhead)
    serverActions: {
      bodySizeLimit: "200mb",
    },
    proxyClientMaxBodySize: "250mb",
  },
};

export default nextConfig;
