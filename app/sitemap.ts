import type { MetadataRoute } from "next";
import { siteContent } from "@/content/french-restaurant";
import { publicationReady, siteUrl } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!publicationReady) return [];
  const pages = ["", "/courses", "/privacy", "/legal"];
  return [
    ...pages.map((path) => ({ url: `${siteUrl}${path}`, lastModified: new Date("2026-09-05"), changeFrequency: path ? "yearly" as const : "weekly" as const, priority: path === "" ? 1 : path === "/courses" ? 0.8 : 0.3 })),
    ...siteContent.courses.map((course) => ({ url: `${siteUrl}/courses/${course.id}`, lastModified: new Date("2026-09-05"), changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
