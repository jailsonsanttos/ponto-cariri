import { listarMunicipios, listarNoticias } from "@/lib/db";

const URL_SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.pontocariri.com.br";

export default async function sitemap() {
  const paginasFixas = [
    { url: ${URL_SITE}/, changeFrequency: "daily", priority: 1 },
    { url: ${URL_SITE}/municipios, changeFrequency: "weekly", priority: 0.8 },
    { url: ${URL_SITE}/informacoes, changeFrequency: "daily", priority: 0.9 },
    { url: ${URL_SITE}/tempo, changeFrequency: "daily", priority: 0.6 },
    { url: ${URL_SITE}/publicidade, changeFrequency: "weekly", priority: 0.6 },
    { url: ${URL_SITE}/sobre, changeFrequency: "monthly", priority: 0.4 },
    { url: ${URL_SITE}/privacidade, changeFrequency: "yearly", priority: 0.2 },
    { url: ${URL_SITE}/termos, changeFrequency: "yearly", priority: 0.2 },
  ];

  let paginasMunicipios = [];
  let paginasNoticias = [];

  try {
    const municipios = await listarMunicipios();
    paginasMunicipios = municipios.map((m) => ({
      url: ${URL_SITE}/municipios/${m.slug},
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    const noticias = await listarNoticias();
    paginasNoticias = noticias
      .filter((n) => n.publicada)
      .map((n) => ({
        url: ${URL_SITE}/informacoes/${n.slug},
        lastModified: n.dataPublicacao,
        changeFrequency: "weekly",
        priority: 0.7,
      }));
  } catch (erro) {
    // Se o banco de dados não estiver acessível, retorna as páginas fixas
  }

  return [...paginasFixas, ...paginasMunicipios, ...paginasNoticias];
}
