import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Force non-streaming metadata to keep server/client boundary trees stable.
  htmlLimitedBots: /.*/,
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
