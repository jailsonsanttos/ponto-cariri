import { listarPrecos } from "@/lib/cms";
import AdSlot from "@/components/AdSlot";
import PrecosCliente from "./PrecosCliente";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Preços do Cariri",
  description: "Consulte preços informados por município, data e fonte na região do Cariri cearense.",
};

export default async function PrecosPage() {
  noStore();
  const precos = await listarPrecos();

  return (
    <div className="overflow-hidden bg-white">
      <section className="relative isolate bg-cariri-verde-escuro text-white">
        <div className="absolute inset-0 -z-10 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 15% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 70%, white 1px, transparent 1px)", backgroundSize: "34px 34px, 46px 46px" }} />
        <div className="mx-auto max-w-content px-5 py-14 sm:py-20 lg:py-24">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-cariri-verde-claro">
              <span className="h-2 w-2 rounded-full bg-cariri-verde-claro" />
              Economia regional
            </p>
            <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">Preços do Cariri, organizados para você.</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">Consulte referências de preços por município, produto e categoria. Informação local para acompanhar o mercado e tomar decisões melhores.</p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-content px-5 pt-7">
        <AdSlot label="Anúncio - página de preços do Cariri" />
      </div>

      <main className="mx-auto max-w-content px-5 pb-16 pt-10">
        <PrecosCliente precos={precos} />

        <section className="mt-14 grid gap-5 border-t border-cariri-verde-claro pt-10 sm:grid-cols-3">
          <div className="rounded-2xl bg-cariri-verde-claro/60 p-5">
            <p className="text-sm font-bold text-cariri-verde">Referência local</p>
            <p className="mt-2 text-sm leading-6 text-cariri-cinza-texto">Os valores são informados para municípios e contextos específicos da região.</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-sm font-bold text-cariri-preto">Dados identificados</p>
            <p className="mt-2 text-sm leading-6 text-cariri-cinza-texto">Cada registro apresenta data, município e fonte para facilitar a leitura.</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-sm font-bold text-cariri-preto">Atualização contínua</p>
            <p className="mt-2 text-sm leading-6 text-cariri-cinza-texto">A tabela acompanha os novos preços cadastrados pela administração do portal.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
