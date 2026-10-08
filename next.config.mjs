/** @type {import('next').NextConfig} */
const nextConfig = {
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
};

export default nextConfig;
