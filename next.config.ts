import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "kagari-restaurant";
const pagesBasePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim() || `/${repositoryName}`;

const nextConfig: NextConfig = {
  agentRules: false,
  ...(isGitHubPages ? {
    output: "export" as const,
    basePath: pagesBasePath,
    trailingSlash: true,
  } : {}),
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 390, 414, 744, 768, 834, 1024, 1280, 1440, 1920, 2560],
    imageSizes: [48, 96, 192, 384],
    unoptimized: isGitHubPages,
  },
};

export default nextConfig;
