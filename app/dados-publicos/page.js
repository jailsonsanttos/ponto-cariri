import { listarMunicipios } from "@/lib/db";
import DadosPublicosCliente from "./DadosPublicosCliente";
import AdSlot from "@/components/AdSlot";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dados Públicos do Cariri",
  description: "Consulte dados públicos do IBGE, alertas meteorológicos do INMET, transparência do TCE Ceará e mapas do OpenStreetMap.",
  keywords: ["dados do Cariri", "IBGE Cariri", "INMET Ceará", "TCE Ceará", "mapa Cariri"],
  alternates: { canonical: "https://www.pontocariri.com.br/dados-publicos" },
};

export default async function DadosPublicosPage() {
  noStore();
  const municipios = (await listarMunicipios()).map((municipio) => ({ slug: municipio.slug, nome: municipio.nome }));
  return (
    <div className="overflow-hidden bg-slate-50">
      <section className="bg-cariri-verde-escuro text-white">
        <div className="mx-auto max-w-content px-5 py-14 sm:py-20">
          <p className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-cariri-verde-claro">Fontes públicas e abertas</p>
          <h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-5xl">Dados do Cariri em um só lugar.</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">Informações territoriais, clima, transparência municipal e mapas usando fontes oficiais e serviços públicos.</p>
        </div>
      </section>
      <div className="mx-auto max-w-content px-5 pt-7"><AdSlot label="Anúncio - dados públicos" /></div>
      <main className="mx-auto max-w-content px-5 pb-16"><DadosPublicosCliente municipios={municipios} /></main>
    </div>
  );
}
