/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.r2.dev', // Cloudflare R2 público
      },
      {
        protocol: 'https',
        hostname: 'r2.cloudflarestorage.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        // Encaminha todas as chamadas /api/* para o backend NestJS
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
