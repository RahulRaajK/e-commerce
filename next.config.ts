import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
      },
      {
        protocol: 'https',
        hostname: 'dlcdnwebimgs.asus.com',
      }
    ],
  },
  // Force rebuild to ensure local images are served
  generateBuildId: async () => {
    return 'rog-images-update-' + Date.now();
  },
};
export default nextConfig;
