import type { NextConfig } from "next";
import type { Configuration } from "webpack";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["spotseller.ir"],
    deviceSizes: [320, 420, 768, 1024, 1200],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
  },
  compress: true,
  // webpack: (config: Configuration) => {
  //   config.plugins = config.plugins?.filter((plugin) => {
  //     if (plugin && typeof plugin === "object" && "constructor" in plugin) {
  //       return plugin.constructor.name !== "DefinePlugin";
  //     }
  //     return true;
  //   });

  //   return config;
  // },
};

export default nextConfig;
