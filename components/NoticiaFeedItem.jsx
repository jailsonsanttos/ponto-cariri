import Link from "next/link";
import Image from "next/image";

// Card de notícia em formato "feed" (parecido com uma postagem de rede
// social): imagem grande, categoria, título, data e um resumo maior.
// Quando "destaque" é verdadeiro, aparece maior (usado no topo do feed).
export default function NoticiaFeedItem({ noticia, destaque = false }) {
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
        <div className={`relative w-full ${destaque ? "h-64 sm:h-96" : "h-56 sm:h-72"}`}>
          <Image
            src={noticia.imagemCapa}
            alt=""
            fill
            priority={destaque}
            sizes="(max-width: 768px) 100vw, 700px"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-40 bg-cariri-verde-claro" />
      )}
      <div className="p-5">
        <div className="flex items-center gap-2 text-xs text-cariri-cinza-texto">
          {destaque && (
            <span className="font-bold text-white bg-cariri-verde px-2 py-0.5 rounded-full text-[11px] uppercase tracking-wide">
              Destaque
            </span>
          )}
          <span className="font-semibold text-cariri-verde uppercase tracking-wide">
            {noticia.categoria || "Geral"}
          </span>
          <span>·</span>
          <span>{dataFormatada}</span>
        </div>
        <h2 className={`mt-2 font-bold text-cariri-preto leading-snug ${destaque ? "text-2xl sm:text-3xl" : "text-xl"}`}>
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
