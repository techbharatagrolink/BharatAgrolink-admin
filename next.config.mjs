const apiUrl = (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1").replace(/\/$/, "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-contained server bundle for the Docker image (see Dockerfile).
  output: "standalone",
  reactCompiler: true,
  experimental: {
    serverComponentsHmrCache: false,
    staleTimes: { dynamic: 0 },
  },
  async rewrites() {
    return [{ source: "/api/v1/:path*", destination: `${apiUrl}/:path*` }];
  },
};

export default nextConfig;
