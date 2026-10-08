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
import { idDoYoutube } from "@/lib/midia";
import { alturaGaleria, classeLayoutGaleria, normalizarGaleria } from "@/lib/galeria";

const URL_SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.pontocariri.com.br";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const noticia = await buscarNoticia(params.slug);
  if (!noticia) return { title: "Informação" };

  const descricao = (noticia.seoDescricao || noticia.resumo || "").slice(0, 160);
  const titulo = noticia.seoTitulo || noticia.titulo;

  return {
    title: titulo,
    description: descricao,
    alternates: { canonical: `${URL_SITE}/informacoes/${noticia.slug}` },
    openGraph: {
      type: "article",
      title: titulo,
      description: descricao,
      publishedTime: noticia.dataPublicacao,
      images: noticia.imagemCapa ? [noticia.imagemCapa] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: titulo,
      description: descricao,
    },
  };
}

export default async function InformacaoPage({ params }) {
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

  const relacionadas = (await listarNoticias())
    .filter((n) => n.publicada && n.slug !== noticia.slug)
    .slice(0, 3);

  const tipoSchema = noticia.tipo === "informacao" ? "Article" : "Article";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": tipoSchema,
    headline: noticia.titulo,
    description: noticia.resumo,
    image: noticia.imagemCapa ? [noticia.imagemCapa] : undefined,
    datePublished: noticia.dataPublicacao,
    author: { "@type": "Person", name: noticia.autor || "Redação Ponto Cariri" },
    publisher: {
      "@type": "Organization",
      name: "Ponto Cariri",
      logo: { "@type": "ImageObject", url: `${URL_SITE}/icon` },
    },
    mainEntityOfPage: `${URL_SITE}/informacoes/${noticia.slug}`,
  };

  const galeria = normalizarGaleria(noticia.galeria);
  const arquivos = Array.isArray(noticia.arquivos) ? noticia.arquivos : [];
  const yt = idDoYoutube(noticia.videoUrl);

  return (
    <article className="max-w-content mx-auto px-5 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ContadorVisualizacao slug={noticia.slug} />

      <div className="max-w-2xl mx-auto">
        <Breadcrumbs
          itens={[
            { label: "Informações", href: "/informacoes" },
            {
              label: noticia.categoria || "Geral",
              href: `/informacoes?categoria=${encodeURIComponent(noticia.categoria || "")}`,
            },
            { label: noticia.titulo },
          ]}
        />

        <Link
          href={`/informacoes?categoria=${encodeURIComponent(noticia.categoria || "")}`}
          className="inline-block text-xs font-bold text-white bg-cariri-verde px-3 py-1 rounded-full uppercase tracking-wide"
        >
          {noticia.categoria || "Geral"}
        </Link>
        <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-cariri-preto leading-tight">
          {noticia.titulo}
        </h1>
        <p className="mt-3 text-sm text-cariri-cinza-texto">
          {noticia.autor ? `${noticia.autor}` : "Redação Ponto Cariri"}
          {noticia.municipio ? ` · ${noticia.municipio}` : ""} · {dataFormatada}
          {noticia.fonte ? ` · Fonte: ${noticia.fonte}` : ""}
        </p>

        {noticia.imagemCapa && (
          <div className="relative mt-6 w-full h-64 sm:h-96 rounded-lg overflow-hidden">
            <Image
              src={noticia.imagemCapa}
              alt={noticia.titulo}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 700px"
              className="object-cover"
              style={{ objectPosition: noticia.imagemPosicao || "center center" }}
            />
          </div>
        )}

        <div
          className="mt-8 prose-noticia text-cariri-preto/90 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: noticia.conteudo }}
        />

        {galeria.length > 0 && (
          <section className="mt-10" aria-labelledby="titulo-galeria">
            <h2 id="titulo-galeria" className="mb-4 text-xl font-bold text-cariri-preto">
              Galeria de imagens
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {galeria.map((imagem, i) => (
                <figure key={`${imagem.url}-${i}`} className={classeLayoutGaleria(imagem.layout)}>
                  <div className={`relative w-full overflow-hidden rounded-lg ${alturaGaleria(imagem.layout)}`}>
                    <Image
                      src={imagem.url}
                      alt={imagem.alt || `Imagem ${i + 1} da publicação`}
                      fill
                      className="object-cover"
                      style={{ objectPosition: imagem.posicao }}
                      sizes={imagem.layout === "grade" ? "(max-width: 640px) 100vw, 50vw" : "100vw"}
                    />
                  </div>
                  {imagem.legenda && (
                    <figcaption className="mt-2 text-sm text-cariri-cinza-texto">{imagem.legenda}</figcaption>
                  )}
                </figure>
              ))}
            </div>
          </section>
        )}

        {yt && (
          <div className="mt-8 aspect-video rounded-xl overflow-hidden">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${yt}`}
              title={noticia.titulo}
              allowFullScreen
            />
          </div>
        )}
        {noticia.videoUrl && !yt && (
          <video className="mt-8 w-full rounded-xl" src={noticia.videoUrl} controls />
        )}
        {noticia.audioUrl && <audio className="mt-6 w-full" src={noticia.audioUrl} controls />}

        {arquivos.length > 0 && (
          <div className="mt-6 space-y-2">
            {arquivos.map((arq, i) => (
              <a
                key={i}
                href={typeof arq === "string" ? arq : arq.url}
                className="block text-sm font-medium text-cariri-verde"
                target="_blank"
                rel="noopener noreferrer"
              >
                📄 {typeof arq === "string" ? "Arquivo" : arq.nome || "Arquivo"}
              </a>
            ))}
          </div>
        )}

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between bg-white border border-cariri-verde-claro rounded-2xl sm:rounded-full px-5 sm:px-6 py-4 sm:py-3">
          <OuvirNoticia titulo={noticia.titulo} texto={(noticia.conteudo || "").replace(/<[^>]*>/g, " ")} />
          <div className="h-px w-full sm:h-8 sm:w-px bg-cariri-verde-claro" />
          <CompartilharBotoes titulo={noticia.titulo} slug={noticia.slug} />
        </div>

        <div className="mt-10">
          <AdSlot label="Anúncio - dentro da publicação" />
        </div>

        {relacionadas.length > 0 && (
          <div className="mt-12">
            <h2 className="text-lg font-bold text-cariri-preto mb-4">Leia também</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {relacionadas.map((n) => (
                <NoticiaCard key={n.slug} noticia={n} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <Link href="/informacoes" className="text-sm font-medium text-cariri-verde">
            ← Voltar para informações
          </Link>
        </div>
      </div>
    </article>
  );
}
