
import type { NextConfig } from "next";
import { env } from "process";

const nextConfig: NextConfig = {
  allowedDevOrigins: [env.REPLIT_DOMAINS?.split(",")[0] || ""],
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? './' : '',
};

module.exports = nextConfig;
