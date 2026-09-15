import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  output: "standalone",
  transpilePackages: [
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
