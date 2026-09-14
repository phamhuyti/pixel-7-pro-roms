import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  output: "standalone",
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
