/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // Permite que o Next.js otimize (comprima e redimensione) automaticamente
    // as fotos enviadas pelo painel de administração, que ficam guardadas
    // no Vercel Blob.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/noticias", destination: "/informacoes", permanent: false },
      { source: "/noticias/:slug", destination: "/informacoes/:slug", permanent: false },
      { source: "/propaganda", destination: "/publicidade", permanent: false },
    ];
  },
};

export default nextConfig;
