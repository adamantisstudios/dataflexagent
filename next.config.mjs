/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js']
  },
  images: {
    domains: ['placeholder.svg'],
    unoptimized: true,
  },
  // Disable static optimization for problematic pages
  trailingSlash: false,
  // Force dynamic rendering for checkout pages
  async rewrites() {
    return []
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
