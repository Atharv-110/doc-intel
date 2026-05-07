/** @type {import('next').NextConfig} */
const nextConfig = {
  // -------------------------------------------------------------------
  // Server configuration
  // -------------------------------------------------------------------
  serverExternalPackages: ["@pageindex/sdk"],

  // -------------------------------------------------------------------
  // API body size limit — allows 50 MB PDF uploads via /api/upload
  // -------------------------------------------------------------------
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
};

export default nextConfig;
