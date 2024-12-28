import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["spotseller.ir"],
    deviceSizes: [320, 420, 768, 1024, 1200],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
  },
  compress: true,
  experimental: {
    turbo: {
      resolveExtensions: [".js", ".jsx", ".ts", ".tsx"],
      minify: true,
    },
  },
};

export default nextConfig;
