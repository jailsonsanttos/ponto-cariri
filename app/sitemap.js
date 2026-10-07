const URL_SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.pontocariri.com.br";

export default function sitemap() {
  return [
    {
      url: ${URL_SITE}/,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: ${URL_SITE}/municipios,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: ${URL_SITE}/informacoes,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: ${URL_SITE}/tempo,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.6,
    },
    {
      url: ${URL_SITE}/publicidade,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: ${URL_SITE}/sobre,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: ${URL_SITE}/privacidade,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: ${URL_SITE}/termos,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
