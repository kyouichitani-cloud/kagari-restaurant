const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const siteUrl = configuredSiteUrl || "https://kagari-restaurant.vercel.app";
export const publicationReady = process.env.NEXT_PUBLIC_SITE_VERIFIED !== "false";
