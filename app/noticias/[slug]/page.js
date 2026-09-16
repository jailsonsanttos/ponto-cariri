import { notFound } from "next/navigation";
import Image from "next/image";
import { buscarNoticia, listarNoticias } from "@/lib/db";
import AdSlot from "@/components/AdSlot";
import CompartilharBotoes from "@/components/CompartilharBotoes";
import OuvirNoticia from "@/components/OuvirNoticia";
import NoticiaCard from "@/components/NoticiaCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContadorVisualizacao from "@/components/ContadorVisualizacao";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";

const URL_SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://ponto-cariri.vercel.app";

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
  noStore();

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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: noticia.titulo,
    description: noticia.resumo,
    image: noticia.imagemCapa ? [noticia.imagemCapa] : undefined,
    datePublished: noticia.dataPublicacao,
    author: { "@type": "Organization", name: "Ponto Cariri" },
    publisher: {
      "@type": "Organization",
      name: "Ponto Cariri",
      logo: { "@type": "ImageObject", url: `${URL_SITE}/icon` },
    },
    mainEntityOfPage: `${URL_SITE}/noticias/${noticia.slug}`,
  };

  return (
    <article className="max-w-content mx-auto px-5 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContadorVisualizacao slug={noticia.slug} />

      <div className="max-w-2xl mx-auto">
        <Breadcrumbs
          itens={[
            { label: "Notícias", href: "/noticias" },
            { label: noticia.categoria || "Geral", href: `/noticias?categoria=${encodeURIComponent(noticia.categoria || "")}` },
            { label: noticia.titulo },
          ]}
        />

        <Link
          href={`/noticias?categoria=${encodeURIComponent(noticia.categoria || "")}`}
          className="inline-block text-xs font-bold text-white bg-cariri-verde px-3 py-1 rounded-full uppercase tracking-wide"
        >
          {noticia.categoria || "Geral"}
        </Link>
        <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-cariri-preto leading-tight">
          {noticia.titulo}
        </h1>
        <p className="mt-3 text-sm text-cariri-cinza-texto">
          Por: Redação Ponto Cariri · {dataFormatada}
        </p>

        {noticia.imagemCapa && (
          <div className="relative mt-6 w-full h-64 sm:h-96 rounded-lg overflow-hidden">
            <Image
              src={noticia.imagemCapa}
              alt=""
              fill
              priority
              sizes="(max-width: 768px) 100vw, 700px"
              className="object-cover"
            />
          </div>
        )}

        <div
          className="mt-8 prose-noticia text-cariri-preto/90 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: noticia.conteudo }}
        />

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 bg-white border border-cariri-verde-claro rounded-full px-5 sm:px-6 py-3">
          <OuvirNoticia
            titulo={noticia.titulo}
            texto={noticia.conteudo.replace(/<[^>]*>/g, " ")}
          />
          <div className="h-8 w-px bg-cariri-verde-claro hidden sm:block" />
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
