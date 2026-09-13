import { listarNoticias } from "@/lib/db";
import { unstable_noStore as noStore } from "next/cache";

// Evita que o Next.js tente pré-gerar esta rota durante o "build";
// ela precisa ser executada sempre na hora (usa o banco de dados).
export const dynamic = "force-dynamic";

const URL_SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://ponto-cariri.vercel.app";

function escaparXml(texto = "") {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  noStore();

  const noticias = (await listarNoticias())
    .filter((n) => n.publicada)
    .slice(0, 30);

  const itens = noticias
    .map((n) => {
      const link = `${URL_SITE}/noticias/${n.slug}`;
      const data = new Date(n.dataPublicacao + "T12:00:00").toUTCString();
      return `
    <item>
      <title>${escaparXml(n.titulo)}</title>
      <link>${link}</link>
      <guid>${link}</guid>
      <pubDate>${data}</pubDate>
      <category>${escaparXml(n.categoria || "Geral")}</category>
      <description>${escaparXml(n.resumo || "")}</description>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Ponto Cariri</title>
    <link>${URL_SITE}</link>
    <description>Notícias e informações da região do Cariri cearense</description>
    <language>pt-BR</language>${itens}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
