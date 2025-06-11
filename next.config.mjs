/** @type {import('next').NextConfig} */
const nextConfig = {
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
  // Disable output: 'export' as it causes issues with dynamic routes
  // output: 'export',
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  // Add this to help with the build process
  swcMinify: true,
  reactStrictMode: false,
}

export default nextConfig
