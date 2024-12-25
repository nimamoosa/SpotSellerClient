import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Image optimization settings
  images: {
    domains: ["spotseller.ir"], // Allow images from your domain
    deviceSizes: [320, 420, 768, 1024, 1200], // Define responsive breakpoints
    formats: ["image/avif", "image/webp"], // Use modern formats
    minimumCacheTTL: 60, // Cache images for better performance
  },
  // Custom compression settings
  compress: true,
};

export default nextConfig;
