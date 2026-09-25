import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // Paket ikon dioptimalkan agar tree-shaking maksimal (bundle ringan)
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
