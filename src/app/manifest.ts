import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Spot Seller - اسپات سلر",
    short_name: "SpotSeller",
    description: "سرویس مدیریت اسپات پلیر",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/Frame 1.jpg",
        sizes: "1080x1080",
        type: "image/jpg",
      },
    ],
  };
}
