import type { NextConfig } from "next";
import { execSync } from "node:child_process";
import path from "node:path";

function currentGitBranch(): string {
  try {
    return execSync("git branch --show-current", { stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
  } catch {
    return "";
  }
}

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  turbopack: {
    root: path.resolve(__dirname),
  },
  // Barrel-optimize the big icon/animation packages so a `import { X } from
  // '@phosphor-icons/react'` only pulls in X, not the whole barrel, off every
  // page's shared bundle. Pure build-time transform, no behavior change.
  experimental: {
    optimizePackageImports: ['@phosphor-icons/react', 'framer-motion'],
  },
  env: {
    NEXT_PUBLIC_GIT_BRANCH: currentGitBranch(),
  },
  // /r/[file], /api/component-code and /api/me/install-check all read
  // registry-data/*.json (the catalog + _manifest.json, via loadContentLookup)
  // with fs at request time. Those files are NOT traced as imports, so without
  // this they are absent from the deployed serverless function — /r/*.json 404s,
  // and the Code-tab / install-check routes would degrade (503 / fail-open).
  // This bundles them into each function. Top-level option in Next 16 (confirmed
  // against node_modules/next config-shared.d.ts).
  outputFileTracingIncludes: {
    "/r/[file]": ["./registry-data/*.json"],
    "/api/component-code": ["./registry-data/*.json"],
    "/api/me/install-check": ["./registry-data/*.json"],
    // The gated brain page reads registry-data/_andromeda-brain.json with fs at
    // request time (underscore-prefixed, so /r can never serve it).
    "/design-systems/andromeda/brain": ["./registry-data/*.json"],
  },
  async redirects() {
    return [
      { source: "/r", destination: "/components", permanent: true },
      // The Andromeda overview was promoted to the system root; the old preview
      // URL permanently (308) redirects there so any stray link/index lands on
      // the canonical page.
      {
        source: "/design-systems/andromeda/overview",
        destination: "/design-systems/andromeda",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
