import type { MetadataRoute } from "next";
import { publicationReady, siteUrl } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!publicationReady) return [];
  return ["", "/privacy", "/legal"].map((path) => ({ url: `${siteUrl}${path}`, lastModified: new Date("2026-09-05"), changeFrequency: path ? "yearly" as const : "weekly" as const, priority: path ? 0.3 : 1 }));
}
