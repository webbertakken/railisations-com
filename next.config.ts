import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  images: { unoptimized: true },
  // Static export is hosted by Cloudflare Workers via `wrangler.toml [assets]`.
  // No runtime, so no server features beyond what `next export` supports.
};

export default nextConfig;
