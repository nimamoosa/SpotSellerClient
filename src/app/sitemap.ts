import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://spotseller.ir",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
