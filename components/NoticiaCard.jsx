import Link from "next/link";
import Image from "next/image";

export default function NoticiaCard({ noticia }) {
  const data = noticia.dataPublicacao
    ? new Date(`${noticia.dataPublicacao}T12:00:00`).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).replace(".", "")
    : "";

  return (
    <Link href={`/informacoes/${noticia.slug}`} className="group flex h-full flex-col overflow-hidden rounded-3xl border border-cariri-verde-claro bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative overflow-hidden bg-cariri-verde-claro">
        {noticia.imagemCapa ? (
          <div className="relative aspect-[16/10] w-full">
            <Image src={noticia.imagemCapa} alt={noticia.titulo} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" style={{ objectPosition: noticia.imagemPosicao || "center center" }} />
          </div>
        ) : <div className="flex aspect-[16/10] w-full items-center justify-center text-5xl font-black text-cariri-verde">PC</div>}
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-cariri-verde-escuro shadow-sm">{noticia.categoria || "Geral"}</span>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-center gap-2 text-xs text-cariri-cinza-texto"><span>{data}</span>{noticia.municipio && <><span>·</span><span>{noticia.municipio}</span></>}</div>
        <h2 className="mt-3 text-xl font-black leading-snug text-cariri-preto">{noticia.titulo}</h2>
        {noticia.resumo && <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-cariri-cinza-texto">{noticia.resumo}</p>}
        <div className="mt-5 flex items-center justify-between border-t border-cariri-verde-claro pt-4 text-sm font-bold"><span className="text-cariri-verde">Ler matéria</span><span className="flex h-8 w-8 items-center justify-center rounded-full bg-cariri-verde-claro text-lg text-cariri-verde transition group-hover:bg-cariri-verde group-hover:text-white" aria-hidden="true">↗</span></div>
      </div>
    </Link>
  );
}
