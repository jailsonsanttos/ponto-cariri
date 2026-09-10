import Link from "next/link";

// Card de notícia em formato "feed" (parecido com uma postagem de rede
// social): imagem grande, categoria, título, data e um resumo maior.
export default function NoticiaFeedItem({ noticia }) {
  const dataFormatada = noticia.dataPublicacao
    ? new Date(noticia.dataPublicacao + "T12:00:00").toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <Link
      href={`/noticias/${noticia.slug}`}
      className="block bg-white border border-cariri-verde-claro rounded-xl overflow-hidden hover:border-cariri-verde hover:shadow-md transition-all"
    >
      {noticia.imagemCapa ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={noticia.imagemCapa}
          alt=""
          className="w-full h-56 sm:h-72 object-cover"
        />
      ) : (
        <div className="w-full h-40 bg-cariri-verde-claro" />
      )}
      <div className="p-5">
        <div className="flex items-center gap-2 text-xs text-cariri-cinza-texto">
          <span className="font-semibold text-cariri-verde uppercase tracking-wide">
            {noticia.categoria || "Geral"}
          </span>
          <span>·</span>
          <span>{dataFormatada}</span>
        </div>
        <h2 className="mt-2 text-xl font-bold text-cariri-preto leading-snug">
          {noticia.titulo}
        </h2>
        <p className="mt-2 text-[15px] text-cariri-preto/80 leading-relaxed line-clamp-3">
          {noticia.resumo}
        </p>
        <span className="mt-3 inline-block text-sm font-semibold text-cariri-verde">
          Ler notícia completa →
        </span>
      </div>
    </Link>
  );
}
