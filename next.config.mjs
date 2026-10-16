/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // As imagens são servidas diretamente das URLs originais para não consumir
    // transformações mensais da Vercel. Os componentes next/image continuam
    // funcionando, mas sem passar pelo endpoint de otimização.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/noticias", destination: "/informacoes", permanent: true },
      { source: "/noticias/:slug", destination: "/informacoes/:slug", permanent: true },
      { source: "/propaganda", destination: "/publicidade", permanent: true },
    ];
  },
};

export default nextConfig;
