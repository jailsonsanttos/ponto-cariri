import { listarMunicipios } from "@/lib/db";
import AdSlot from "@/components/AdSlot";
import MunicipiosCliente from "./MunicipiosCliente";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Municípios do Cariri",
  description: "Conheça os municípios do Cariri cearense, sua história, cultura, turismo e riquezas.",
};

export default async function MunicipiosPage() {
  noStore();
  const municipios = await listarMunicipios();
  const comLocalizacao = municipios.filter((m) => m.latitude && m.longitude).length;
  const comFotos = municipios.filter((m) => Array.isArray(m.fotos) && m.fotos.length > 0).length;

  return (
    <div className="overflow-hidden bg-white">
      <section className="relative isolate bg-cariri-verde-escuro text-white">
        <div className="absolute inset-0 -z-10 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 15% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 70%, white 1px, transparent 1px)", backgroundSize: "34px 34px, 46px 46px" }} />
        <div className="mx-auto grid max-w-content items-end gap-8 px-5 py-14 sm:py-20 lg:grid-cols-[1.2fr_0.8fr] lg:py-24">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-cariri-verde-claro"><span className="h-2 w-2 rounded-full bg-cariri-verde-claro" />Território e identidade</p>
            <h1 className="max-w-3xl text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">Cada município tem uma história para contar.</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">Explore as cidades do Cariri cearense e descubra sua cultura, memória, turismo, pessoas e riquezas.</p>
          </div>
          <div className="hidden rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur sm:block">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/60">Guia regional</p>
            <p className="mt-4 text-3xl font-black">O Cariri mais perto de você.</p>
            <p className="mt-3 text-sm leading-6 text-white/70">Informação organizada para conhecer melhor cada canto da nossa região.</p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-content px-5 pt-7"><AdSlot label="Anúncio - topo da página de municípios" /></div>

      <main className="mx-auto max-w-content px-5 pb-16 pt-10">
        <div className="mb-8 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-cariri-verde-claro p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-cariri-verde">Municípios</p><p className="mt-2 text-3xl font-black text-cariri-preto">{municipios.length}</p><p className="mt-1 text-sm text-cariri-cinza-texto">cidades cadastradas</p></div>
          <div className="rounded-2xl bg-slate-50 p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-cariri-verde">Localização</p><p className="mt-2 text-3xl font-black text-cariri-preto">{comLocalizacao}</p><p className="mt-1 text-sm text-cariri-cinza-texto">com mapa disponível</p></div>
          <div className="rounded-2xl bg-slate-50 p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-cariri-verde">Galeria</p><p className="mt-2 text-3xl font-black text-cariri-preto">{comFotos}</p><p className="mt-1 text-sm text-cariri-cinza-texto">com fotos cadastradas</p></div>
        </div>

        <MunicipiosCliente municipios={municipios} />

        <section className="mt-16 grid gap-4 border-t border-cariri-verde-claro pt-10 sm:grid-cols-3">
          <div className="rounded-2xl bg-cariri-verde-claro/70 p-6"><p className="text-sm font-bold text-cariri-verde">História e memória</p><p className="mt-2 text-sm leading-6 text-cariri-cinza-texto">Conheça os fatos, personagens e tradições que fazem cada cidade única.</p></div>
          <div className="rounded-2xl bg-slate-50 p-6"><p className="text-sm font-bold text-cariri-preto">Cultura e turismo</p><p className="mt-2 text-sm leading-6 text-cariri-cinza-texto">Descubra lugares, manifestações culturais e experiências para viver no Cariri.</p></div>
          <div className="rounded-2xl bg-slate-50 p-6"><p className="text-sm font-bold text-cariri-preto">Informação local</p><p className="mt-2 text-sm leading-6 text-cariri-cinza-texto">Acompanhe notícias e conteúdos relacionados a cada município da região.</p></div>
        </section>
      </main>
    </div>
  );
}
