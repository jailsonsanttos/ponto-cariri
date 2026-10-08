import { listarMunicipios, listarNoticias } from "@/lib/db";
import { listarPaginas } from "@/lib/cms";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.pontocariri.com.br").replace(/\/$/, "");

export const dynamic = "force-dynamic";
export const revalidate = 3600;

const paginasFixas = [
  { path: "", changeFrequency: "daily", priority: 1 },
  { path: "/informacoes", changeFrequency: "daily", priority: 0.9 },
  { path: "/municipios", changeFrequency: "weekly", priority: 0.8 },
  { path: "/tempo", changeFrequency: "daily", priority: 0.6 },
  { path: "/precos", changeFrequency: "daily", priority: 0.7 },
  { path: "/publicidade", changeFrequency: "monthly", priority: 0.5 },
  { path: "/sobre", changeFrequency: "monthly", priority: 0.5 },
  { path: "/privacidade", changeFrequency: "yearly", priority: 0.2 },
  { path: "/termos", changeFrequency: "yearly", priority: 0.2 },
];

function url(path) {
  return `${SITE_URL}${path}`;
}

export default async function sitemap() {
  const entries = paginasFixas.map((pagina) => ({
    url: url(pagina.path),
    changeFrequency: pagina.changeFrequency,
    priority: pagina.priority,
  }));

  const [municipios, noticias, paginasCms] = await Promise.all([
    listarMunicipios().catch(() => []),
    listarNoticias().catch(() => []),
    listarPaginas().catch(() => []),
  ]);

  for (const municipio of municipios) {
    if (municipio?.slug) {
      entries.push({
        url: url(`/municipios/${encodeURIComponent(municipio.slug)}`),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  for (const noticia of noticias) {
    if (noticia?.publicada && noticia.slug) {
      entries.push({
        url: url(`/informacoes/${encodeURIComponent(noticia.slug)}`),
        lastModified: noticia.dataPublicacao ? new Date(`${noticia.dataPublicacao}T12:00:00Z`) : undefined,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  for (const pagina of paginasCms) {
    if (pagina?.publicada && pagina.slug && pagina.slug !== "sobre") {
      entries.push({
        url: url(`/p/${encodeURIComponent(pagina.slug)}`),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
