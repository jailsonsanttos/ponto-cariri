import Link from "next/link";
import Image from "next/image";

export default function NoticiaDestaque({ noticia }) {
  const dataFormatada = noticia.dataPublicacao
    ? new Date(`${noticia.dataPublicacao}T12:00:00`).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <Link href={`/informacoes/${noticia.slug}`} className="group relative block overflow-hidden rounded-3xl shadow-lg">
      <div className="relative h-80 w-full bg-cariri-verde-claro sm:h-[460px]">
        {noticia.imagemCapa ? (
          <Image
            src={noticia.imagemCapa}
            alt={noticia.titulo}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1180px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ objectPosition: noticia.imagemPosicao || "center center" }}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-6xl font-black text-cariri-verde">PC</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-9">
        <span className="inline-block rounded-full bg-white/95 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-cariri-verde-escuro">
          Destaque do dia
        </span>
        <h2 className="mt-3 max-w-3xl text-2xl font-black leading-tight text-white sm:text-4xl">
          {noticia.titulo}
        </h2>
        <p className="mt-2 text-sm text-white/80">
          {noticia.categoria || "Geral"} · {dataFormatada}
        </p>
      </div>
    </Link>
  );
}
