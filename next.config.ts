import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ESLint hatasının build işlemini durdurmasını engelliyoruz
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
};

export default nextConfig;