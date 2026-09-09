const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const siteUrl = configuredSiteUrl || "http://localhost:3001";
export const publicationReady = Boolean(configuredSiteUrl) && process.env.NEXT_PUBLIC_SITE_VERIFIED === "true";
