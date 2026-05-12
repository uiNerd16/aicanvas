import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async redirects() {
    return [
      { source: "/r", destination: "/components", permanent: true },
    ];
  },
};

export default nextConfig;
