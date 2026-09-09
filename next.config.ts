import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 390, 414, 744, 768, 834, 1024, 1280, 1440, 1920, 2560],
    imageSizes: [48, 96, 192, 384],
  },
};

export default nextConfig;
