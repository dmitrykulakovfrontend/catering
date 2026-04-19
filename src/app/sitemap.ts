import type { MetadataRoute } from "next";
import { getAllPublishedQuotesForSitemap } from "@/lib/queries";
import { SITE_URL } from "@/lib/siteUrl";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const quotes = await getAllPublishedQuotesForSitemap();

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...quotes.map((q) => ({
      url: `${SITE_URL}/quote/${q.slug}`,
      lastModified: q.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
