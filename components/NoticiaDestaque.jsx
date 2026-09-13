import Link from "next/link";
import Image from "next/image";

// Card grande para a matéria principal da página inicial — se destaca
// visualmente das demais, como nos portais de notícias profissionais.
export default function NoticiaDestaque({ noticia }) {
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
      className="block relative rounded-xl overflow-hidden group"
    >
      <div className="relative w-full h-72 sm:h-[420px] bg-cariri-verde-claro">
        {noticia.imagemCapa && (
          <Image
            src={noticia.imagemCapa}
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 900px"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
        <span className="inline-block text-xs font-bold text-white bg-cariri-verde px-3 py-1 rounded-full uppercase tracking-wide">
          Destaque
        </span>
        <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-white leading-tight max-w-2xl">
          {noticia.titulo}
        </h2>
        <p className="mt-2 text-sm text-white/80">
          {noticia.categoria || "Geral"} · {dataFormatada}
        </p>
      </div>
    </Link>
  );
}
