import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Only add allowedDevOrigins if REPLIT_DOMAINS is available
  ...(process.env.REPLIT_DOMAINS && {
    allowedDevOrigins: [process.env.REPLIT_DOMAINS.split(",")[0]],
  }),
};

module.exports = nextConfig;
