import { notFound } from "next/navigation";
import { buscarNoticia, listarNoticias } from "@/lib/db";
import AdSlot from "@/components/AdSlot";
import CompartilharBotoes from "@/components/CompartilharBotoes";
import NoticiaCard from "@/components/NoticiaCard";
import Link from "next/link";

// Garante que esta página busque dados novos a cada visita, em vez de
// usar uma versão "congelada" gerada no momento do build.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const noticia = await buscarNoticia(params.slug);
  if (!noticia) return { title: "Notícia" };

  const descricaoLimpa = (noticia.resumo || "").slice(0, 160);

  return {
    title: noticia.titulo,
    description: descricaoLimpa,
    openGraph: {
      type: "article",
      title: noticia.titulo,
      description: descricaoLimpa,
      publishedTime: noticia.dataPublicacao,
    },
    twitter: {
      card: "summary_large_image",
      title: noticia.titulo,
      description: descricaoLimpa,
    },
  };
}

export default async function NoticiaPage({ params }) {
  const noticia = await buscarNoticia(params.slug);

  if (!noticia || !noticia.publicada) notFound();

  const dataFormatada = noticia.dataPublicacao
    ? new Date(noticia.dataPublicacao + "T12:00:00").toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "";

  const todasNoticias = await listarNoticias();
  const relacionadas = todasNoticias
    .filter((n) => n.publicada && n.slug !== noticia.slug)
    .slice(0, 3);

  return (
    <article className="max-w-content mx-auto px-5 py-12">
      <div className="max-w-2xl mx-auto">
        <p className="text-sm font-semibold text-cariri-verde uppercase tracking-wide">
          {noticia.categoria || "Geral"}
        </p>
        <h1 className="mt-1 text-3xl sm:text-4xl font-bold text-cariri-preto leading-tight">
          {noticia.titulo}
        </h1>
        <p className="mt-3 text-sm text-cariri-cinza-texto">{dataFormatada}</p>

        {noticia.imagemCapa && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={noticia.imagemCapa}
            alt=""
            className="mt-6 w-full rounded-lg object-cover max-h-96"
          />
        )}

        <div
          className="mt-8 prose-noticia text-cariri-preto/90 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: noticia.conteudo }}
        />

        <div className="mt-8 pt-6 border-t border-cariri-verde-claro">
          <CompartilharBotoes titulo={noticia.titulo} slug={noticia.slug} />
        </div>

        <div className="mt-10">
          <AdSlot label="Anúncio - dentro da notícia" />
        </div>

        {relacionadas.length > 0 && (
          <div className="mt-12">
            <h2 className="text-lg font-bold text-cariri-preto mb-4">
              Leia também
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {relacionadas.map((n) => (
                <NoticiaCard key={n.slug} noticia={n} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <Link href="/noticias" className="text-sm font-medium text-cariri-verde">
            ← Voltar para notícias
          </Link>
        </div>
      </div>
    </article>
  );
}
