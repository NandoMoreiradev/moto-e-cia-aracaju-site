const { withPayload } = require('@payloadcms/next/withPayload');

/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-xxxxxxxx.r2.dev', // Substituir pelo domínio público do R2
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
        // Encaminha para o backend externo somente rotas que o Payload NÃO gerencia
        // Payload gerencia: /api/users, /api/motos, /api/servicos, /api/media, /api/graphql, /api/payload
        source: '/api/:path((?!graphql|users|motos|servicos|media|payload).*)',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/:path*`,
      },
    ];
  },
};

module.exports = withPayload(nextConfig);
