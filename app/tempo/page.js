import { listarMunicipios } from "@/lib/db";
import TempoCliente from "./TempoCliente";
import AdSlot from "@/components/AdSlot";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Previsão do Tempo",
  description: "Acompanhe a previsão do tempo atualizada nos municípios do Cariri cearense.",
};

export default async function TempoPage() {
  noStore();
  const municipios = (await listarMunicipios()).map((m) => ({
    slug: m.slug,
    nome: m.nome,
    latitude: m.latitude,
    longitude: m.longitude,
  }));

  return (
    <div className="overflow-hidden bg-white">
      <section className="relative isolate bg-cariri-verde-escuro text-white">
        <div className="absolute inset-0 -z-10 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 15% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 70%, white 1px, transparent 1px)", backgroundSize: "34px 34px, 46px 46px" }} />
        <div className="mx-auto flex max-w-content flex-col justify-between gap-8 px-5 py-14 sm:py-18 lg:flex-row lg:items-end lg:py-20">
          <div className="max-w-2xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-cariri-verde-claro">
              <span className="h-2 w-2 rounded-full bg-cariri-verde-claro" />
              Clima no Cariri
            </p>
            <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">Previsão do tempo para planejar o seu dia.</h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-white/75 sm:text-lg">Consulte as condições atuais e a previsão dos próximos dias nos municípios da região do Cariri cearense.</p>
          </div>
          <div className="hidden shrink-0 rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur sm:block lg:w-64">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/60">Dados meteorológicos</p>
            <p className="mt-3 text-2xl font-black">Atualizados</p>
            <p className="mt-1 text-sm text-white/70">com informações em tempo real para cada município.</p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-content px-5 pt-7">
        <AdSlot label="Anúncio - topo da previsão do tempo" />
      </div>

      <main className="mx-auto max-w-content px-5 pb-16">
        <TempoCliente municipios={municipios} />

        <section className="mt-14 grid gap-5 border-t border-cariri-verde-claro pt-10 sm:grid-cols-3">
          <div className="rounded-2xl bg-cariri-verde-claro/60 p-5">
            <p className="text-sm font-bold text-cariri-verde">Escolha a cidade</p>
            <p className="mt-2 text-sm leading-6 text-cariri-cinza-texto">Selecione qualquer município cadastrado para consultar a previsão local.</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-sm font-bold text-cariri-preto">Veja as condições</p>
            <p className="mt-2 text-sm leading-6 text-cariri-cinza-texto">Temperatura, umidade e descrição do céu em uma leitura rápida.</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-sm font-bold text-cariri-preto">Planeje os próximos dias</p>
            <p className="mt-2 text-sm leading-6 text-cariri-cinza-texto">Acompanhe as temperaturas mínima e máxima dos próximos cinco dias.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
