import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for the Docker build (apps/web/Dockerfile) — produces a
  // minimal, self-contained server bundle instead of relying on a full
  // node_modules install inside the runtime image.
  output: "standalone",

  // This is an npm-workspaces monorepo. Without this, Next's file tracer
  // treats apps/web as the project root and misses dependencies hoisted
  // up to the repo root's node_modules (including `next` itself) — the
  // standalone build then ships with an incomplete/empty node_modules and
  // crashes at runtime with "Cannot find module 'next'".
  outputFileTracingRoot: path.join(__dirname, "../../"),

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;