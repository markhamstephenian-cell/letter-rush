import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // When MOBILE_BUILD=true, export as static HTML for Capacitor
  ...(process.env.MOBILE_BUILD === "true" ? { output: "export" } : {}),
};

export default nextConfig;
