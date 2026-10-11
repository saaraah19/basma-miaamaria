import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // The public site is exported as plain HTML/CSS/JS (the `out/` folder) and
  // served by a Render *Static Site*: always on, no cold start, free.
  output: "export",

  // /about/index.html instead of /about.html — works on any static host.
  trailingSlash: true,

  // Monorepo: lets Next trace dependencies hoisted to the repo root.
  outputFileTracingRoot: path.join(__dirname, "../../"),

  // next/image has no server in a static export, so resizing is delegated to
  // Cloudinary's own CDN (see lib/cloudinary-loader.js).
  images: {
    loader: "custom",
    loaderFile: "./lib/cloudinary-loader.js",
  },
};

export default nextConfig;
