import Image from "next/image";
import { idDoYoutube, tipoDeArquivo } from "@/lib/midia";

export default function PropagandaCard({ propaganda }) {
  const idYoutube = idDoYoutube(propaganda.video);
  const ehArquivoDeVideo = !idYoutube && tipoDeArquivo(propaganda.video) === "video";
  const imagem = propaganda.imagem || propaganda.fotos?.[0];
  const telefone = propaganda.telefone?.replace(/\D/g, "");

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-cariri-verde-claro bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative overflow-hidden bg-cariri-preto">
        {idYoutube ? (
          <div className="aspect-[16/10] w-full"><iframe className="h-full w-full" src={`https://www.youtube.com/embed/${idYoutube}`} title={propaganda.nome} allowFullScreen loading="lazy" /></div>
        ) : ehArquivoDeVideo ? (
          <video controls className="aspect-[16/10] w-full object-cover" src={propaganda.video} />
        ) : imagem ? (
          <div className="relative aspect-[16/10] w-full">
            <Image src={imagem} alt={propaganda.nome || "Publicidade local"} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px" className="object-cover transition duration-500 group-hover:scale-105" />
          </div>
        ) : (
          <div className="flex aspect-[16/10] w-full items-center justify-center bg-cariri-verde-claro text-5xl font-black text-cariri-verde">{propaganda.nome?.charAt(0).toUpperCase() || "P"}</div>
        )}
        <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-cariri-verde-escuro shadow-sm">{propaganda.categoria || "Negócio local"}</div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-cariri-preto">{propaganda.nome}</h3>
            {propaganda.municipio && <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-cariri-verde">{propaganda.municipio}</p>}
          </div>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cariri-verde-claro text-cariri-verde" aria-hidden="true">↗</span>
        </div>
        {propaganda.descricao && <p className="mt-4 flex-1 text-sm leading-6 text-cariri-cinza-texto">{propaganda.descricao}</p>}
        {propaganda.video && !idYoutube && !ehArquivoDeVideo && <a href={propaganda.video} target="_blank" rel="noopener noreferrer" className="mt-3 text-sm font-bold text-cariri-verde hover:underline">Assistir vídeo →</a>}
        <div className="mt-5 flex flex-col gap-2 border-t border-cariri-verde-claro pt-4 sm:flex-row">
          {telefone && <a href={`https://wa.me/55${telefone}`} target="_blank" rel="noopener noreferrer" className="flex-1 rounded-xl bg-cariri-verde px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-cariri-verde-escuro">Chamar no WhatsApp</a>}
          {propaganda.link && <a href={propaganda.link} target="_blank" rel="noopener noreferrer" className="flex-1 rounded-xl border border-cariri-verde-claro px-4 py-3 text-center text-sm font-bold text-cariri-verde transition hover:bg-cariri-verde-claro">Ver anúncio</a>}
        </div>
      </div>
    </article>
  );
}
