/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.simpleicons.org', 'localhost', 'paddle-billing.vercel.app'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;