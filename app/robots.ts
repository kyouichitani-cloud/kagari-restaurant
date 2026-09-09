import type { MetadataRoute } from "next";
import { publicationReady, siteUrl } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  if (!publicationReady) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${siteUrl}/sitemap.xml` };
}
