/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for the Docker build (apps/web/Dockerfile) — produces a
  // minimal, self-contained server bundle instead of relying on a full
  // node_modules install inside the runtime image.
  output: "standalone",
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
