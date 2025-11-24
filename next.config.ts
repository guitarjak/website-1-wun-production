import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  // Image optimization for modern formats (removes legacy formats)
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // Remove X-Powered-By header for security
  poweredByHeader: false,

  async rewrites() {
    return [
      {
        source: '/',
        destination: '/w1w-homepage-index.html',
      },
    ];
  },
};

export default nextConfig;
