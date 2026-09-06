import { notFound } from "next/navigation";
import { buscarNoticia } from "@/lib/db";
import AdSlot from "@/components/AdSlot";

export async function generateMetadata({ params }) {
  const noticia = await buscarNoticia(params.slug);
  return { title: noticia ? noticia.titulo : "Notícia" };
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

        <div className="mt-8 text-cariri-preto/90 leading-relaxed whitespace-pre-line">
          {noticia.conteudo}
        </div>

        <div className="mt-10">
          <AdSlot label="Anúncio - dentro da notícia" />
        </div>
      </div>
    </article>
  );
}
