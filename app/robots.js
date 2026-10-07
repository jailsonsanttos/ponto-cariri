// app/robots.js
// Gera automaticamente o arquivo /robots.txt, permitindo que os
// buscadores indexem o site, mas bloqueando o painel de administração.
// Usa o domínio público mesmo quando a variável não estiver configurada.

const URL_SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.pontocariri.com.br").replace(/\/$/, "");

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api"],
    },
    sitemap: `${URL_SITE}/sitemap.xml`,
  };
}
