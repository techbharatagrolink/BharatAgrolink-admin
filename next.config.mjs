import { legacyConsoleRedirects } from "./legacy-redirects.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // NEXT_DIST_DIR lets a test build or a second dev server use its own output folder.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // Self-contained server bundle for the Docker image (see Dockerfile).
  output: "standalone",
  reactCompiler: true,
  experimental: {
    serverComponentsHmrCache: false,
    staleTimes: { dynamic: 0 },
    // Admin forms upload images and documents through server actions (PHP allowed large files).
    serverActions: { bodySizeLimit: "16mb" },
  },
  // Browser calls to /api/v1/* are proxied at runtime by src/app/api/v1/[...path]/route.js.
  // The old console panel (/login, /dashboard, /orders, ...) now lives under /admin.
  async redirects() {
    return legacyConsoleRedirects;
  },
};

export default nextConfig;
