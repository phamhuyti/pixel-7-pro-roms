import { execSync } from "node:child_process";
import type { NextConfig } from "next";

function gitSha(): string {
  try {
    return execSync("git rev-parse --short HEAD", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "";
  }
}

const BUILD_SHA =
  process.env.NEXT_PUBLIC_BUILD_SHA?.trim() || gitSha() || "unknown";
const BUILD_TIME =
  process.env.NEXT_PUBLIC_BUILD_TIME?.trim() || new Date().toISOString();

process.env.NEXT_PUBLIC_BUILD_SHA = BUILD_SHA;
process.env.NEXT_PUBLIC_BUILD_TIME = BUILD_TIME;

const nextConfig: NextConfig = {
  agentRules: false,
  output: "standalone",
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  generateBuildId: async () =>
    `${BUILD_SHA}-${BUILD_TIME.replace(/[:.]/g, "")}`,
  transpilePackages: [
    "@noble/hashes",
    "android-fastboot",
    "@yume-chan/adb",
    "@yume-chan/adb-daemon-webusb",
    "@yume-chan/adb-credential-web",
    "@yume-chan/stream-extra",
    "@yume-chan/struct",
    "@yume-chan/event",
    "@yume-chan/async",
    "@yume-chan/no-data-view",
  ],
  async redirects() {
    return [
      {
        source: "/roms/:slug",
        destination: "/pixel-7-pro/roms/:slug",
        permanent: true,
      },
      {
        source: "/cai-dat",
        destination: "/pixel-7-pro/cai-dat",
        permanent: true,
      },
      {
        source: "/cai-dat/:path*",
        destination: "/pixel-7-pro/cai-dat/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
