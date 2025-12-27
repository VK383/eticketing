import type { NextConfig } from "next";

// Force complete rebuild - December 27, 2025 - Poopoli 2026 Update
// Updated: Scanner dialog positioning and price calculation fixes
// Cache bust: Clear all previous builds
const nextConfig: NextConfig = {
  /* config options here */
  generateBuildId: async () => {
    // Force new build ID to bypass all caching
    return `build-${Date.now()}`
  },
};

export default nextConfig;
