/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["*"]
    },
  },
  typescript: {
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig 