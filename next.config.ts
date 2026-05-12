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
  env: {
    NEXT_PUBLIC_GIT_BRANCH: currentGitBranch(),
  },
  async redirects() {
    return [
      { source: "/r", destination: "/components", permanent: true },
    ];
  },
};

export default nextConfig;
