import { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["*"]
    },
  },
  typescript: {
    ignoreBuildErrors: false,
  },
}

export default nextConfig
