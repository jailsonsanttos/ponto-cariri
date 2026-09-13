import Link from "next/link";
import Image from "next/image";

export default function NoticiaCard({ noticia }) {
  return (
    <Link
      href={`/noticias/${noticia.slug}`}
      className="block rounded-lg border border-cariri-verde-claro overflow-hidden hover:border-cariri-verde hover:shadow-sm transition-all bg-white"
    >
      {noticia.imagemCapa ? (
        <div className="relative w-full h-44">
          <Image
            src={noticia.imagemCapa}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-44 bg-cariri-verde-claro" />
      )}
      <div className="p-5">
        <p className="text-xs font-medium text-cariri-verde uppercase tracking-wide">
          {noticia.categoria || "Geral"}
        </p>
        <p className="mt-1 font-semibold text-cariri-preto leading-snug">
          {noticia.titulo}
        </p>
        <p className="mt-2 text-sm text-cariri-cinza-texto leading-relaxed">
          {noticia.resumo}
        </p>
      </div>
    </Link>
  );
}
