import { listarPropagandas } from "@/lib/db";
import AdSlot from "@/components/AdSlot";
import PublicidadeCliente from "./PublicidadeCliente";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Publicidade local",
  description: "Conheça empresas, comércios e serviços anunciados no Ponto Cariri.",
};

export default async function PublicidadePage() {
  noStore();
  const propagandas = (await listarPropagandas()).filter((p) => p.ativo);

  return (
    <div className="overflow-hidden bg-white">
      <section className="relative isolate bg-cariri-verde-escuro text-white">
        <div className="absolute inset-0 -z-10 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 15% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 70%, white 1px, transparent 1px)", backgroundSize: "34px 34px, 46px 46px" }} />
        <div className="mx-auto grid max-w-content items-center gap-8 px-5 py-14 sm:py-20 lg:grid-cols-[1.2fr_0.8fr] lg:py-24">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-cariri-verde-claro">
              <span className="h-2 w-2 rounded-full bg-cariri-verde-claro" />
              Negócios do Cariri
            </p>
            <h1 className="max-w-3xl text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">Encontre quem movimenta a nossa região.</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">Conheça comércios, serviços e empresas locais que fazem parte do dia a dia do Cariri cearense.</p>
            <Link href="/sobre" className="mt-8 inline-flex rounded-full bg-white px-5 py-3 text-sm font-bold text-cariri-verde-escuro transition hover:bg-cariri-verde-claro">Quero anunciar no Ponto Cariri</Link>
          </div>
          <div className="hidden rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur sm:block">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/60">Publicidade local</p>
            <p className="mt-4 text-3xl font-black">Visibilidade com proximidade.</p>
            <p className="mt-3 text-sm leading-6 text-white/70">Uma vitrine digital para conectar bons negócios às pessoas do Cariri.</p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-content px-5 pt-7">
        <AdSlot label="Anúncio - topo da página de publicidade" />
      </div>

      <main className="mx-auto max-w-content px-5 pb-16 pt-10">
        <PublicidadeCliente propagandas={propagandas} />

        <section className="mt-16 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-cariri-verde-claro/70 p-6"><p className="text-sm font-bold text-cariri-verde">Público regional</p><p className="mt-2 text-sm leading-6 text-cariri-cinza-texto">Sua marca apresentada para quem vive, trabalha e circula no Cariri.</p></div>
          <div className="rounded-2xl bg-slate-50 p-6"><p className="text-sm font-bold text-cariri-preto">Presença profissional</p><p className="mt-2 text-sm leading-6 text-cariri-cinza-texto">Uma vitrine organizada com fotos, descrição, categoria e contato.</p></div>
          <div className="rounded-2xl bg-slate-50 p-6"><p className="text-sm font-bold text-cariri-preto">Contato direto</p><p className="mt-2 text-sm leading-6 text-cariri-cinza-texto">Facilite o próximo passo com WhatsApp e links para o seu negócio.</p></div>
        </section>

        <section className="relative mt-14 overflow-hidden rounded-3xl bg-cariri-verde p-7 text-white sm:p-10">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border-[22px] border-white/10" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div><p className="text-sm font-bold uppercase tracking-[0.16em] text-white/70">Seu negócio pode estar aqui</p><h2 className="mt-2 text-3xl font-black tracking-tight">Quer divulgar sua empresa?</h2><p className="mt-3 max-w-2xl text-white/75">Fale com a equipe do Ponto Cariri para conhecer as opções de divulgação disponíveis.</p></div>
            <Link href="/sobre" className="shrink-0 rounded-full bg-white px-5 py-3 text-center text-sm font-bold text-cariri-verde transition hover:bg-cariri-verde-claro">Falar com a equipe</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
