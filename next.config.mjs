/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed output: 'export' for dynamic routes to work
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
