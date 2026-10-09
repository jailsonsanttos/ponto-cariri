import Image from "next/image";
import Link from "next/link";

export default function MunicipioCard({ municipio }) {
  const imagem = Array.isArray(municipio.fotos) ? municipio.fotos[0] : "";
  const temLocalizacao = Boolean(municipio.latitude && municipio.longitude);

  return (
    <Link href={`/municipios/${municipio.slug}`} className="group flex h-full flex-col overflow-hidden rounded-3xl border border-cariri-verde-claro bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative overflow-hidden bg-cariri-verde-claro">
        {imagem ? (
          <div className="relative aspect-[16/10] w-full">
            <Image src={imagem} alt={municipio.nome} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px" className="object-cover transition duration-500 group-hover:scale-105" />
          </div>
        ) : (
          <div className="flex aspect-[16/10] w-full items-center justify-center bg-cariri-verde-claro text-5xl font-black text-cariri-verde">{municipio.nome?.charAt(0).toUpperCase() || "C"}</div>
        )}
        <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-cariri-verde-escuro shadow-sm">Cariri cearense</div>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div><h2 className="text-xl font-black text-cariri-preto">{municipio.nome}</h2>{municipio.populacao && <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-cariri-verde">População: {municipio.populacao}</p>}</div>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cariri-verde-claro text-lg text-cariri-verde transition group-hover:bg-cariri-verde group-hover:text-white" aria-hidden="true">↗</span>
        </div>
        <p className="mt-4 flex-1 text-sm leading-6 text-cariri-cinza-texto">{municipio.descricaoCurta || "Conheça a história, a cultura e as riquezas deste município do Cariri."}</p>
        <div className="mt-5 flex items-center justify-between border-t border-cariri-verde-claro pt-4 text-sm font-bold">
          <span className="text-cariri-verde">Conhecer município</span>
          {temLocalizacao && <span className="text-xs font-semibold text-cariri-cinza-texto">Mapa disponível</span>}
        </div>
      </div>
    </Link>
  );
}
