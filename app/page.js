import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import {
  listarNoticiasPaginado,
  listarPropagandasRecentes,
  listarMunicipios,
  buscarNoticiaDestaque,
  listarMaisLidas,
} from "@/lib/db";
import { listarHomeSecoes, listarPrecos, listarEventos } from "@/lib/cms";
import HomeModular from "@/components/HomeModular";
import AdSlot from "@/components/AdSlot";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  noStore();

  const [
    { noticias: todasRecentes },
    destaque,
    propagandas,
    municipios,
    maisLidas,
    secoes,
    precos,
    eventos,
  ] = await Promise.all([
    listarNoticiasPaginado({ pagina: 1, porPagina: 11 }),
    buscarNoticiaDestaque(),
    listarPropagandasRecentes(3),
    listarMunicipios(),
    listarMaisLidas(5),
    listarHomeSecoes(true),
    listarPrecos(),
    listarEventos({ publicados: true }),
  ]);

  const noticias = todasRecentes.filter((n) => n.slug !== destaque?.slug).slice(0, 10);
  const secoesVisiveis = secoes.filter((s) => s.ativo !== false);

  return (
    <div className="overflow-hidden bg-white">
      <section className="relative isolate bg-cariri-verde-escuro text-white">
        <div className="absolute inset-0 -z-10 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 15% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 70%, white 1px, transparent 1px)", backgroundSize: "34px 34px, 46px 46px" }} />
        <div className="mx-auto grid max-w-content items-center gap-10 px-5 py-16 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-cariri-verde-claro"><span className="h-2 w-2 rounded-full bg-cariri-verde-claro" />Portal regional do Cariri</p>
            <h1 className="max-w-3xl text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">O Cariri contado por quem vive a região.</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">Informação, cultura, turismo, agro e histórias que ajudam você a conhecer, valorizar e participar do Cariri cearense.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Link href="/informacoes" className="rounded-full bg-white px-5 py-3 text-sm font-bold text-cariri-verde-escuro transition hover:bg-cariri-verde-claro">Explorar informações</Link><Link href="/municipios" className="rounded-full border border-white/30 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10">Conhecer municípios</Link></div>
          </div>
          <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur sm:p-7">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/60">Em um só lugar</p>
            <p className="mt-4 text-3xl font-black">As muitas faces do Cariri.</p>
            <div className="mt-7 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-white/10 p-4"><p className="text-2xl font-black">{municipios.length}</p><p className="mt-1 text-xs text-white/65">municípios</p></div><div className="rounded-2xl bg-white/10 p-4"><p className="text-2xl font-black">{todasRecentes.length}</p><p className="mt-1 text-xs text-white/65">conteúdos recentes</p></div><div className="rounded-2xl bg-white/10 p-4"><p className="text-2xl font-black">{precos.length}</p><p className="mt-1 text-xs text-white/65">preços locais</p></div><div className="rounded-2xl bg-white/10 p-4"><p className="text-2xl font-black">{eventos.length}</p><p className="mt-1 text-xs text-white/65">eventos publicados</p></div></div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-content px-5 pt-7"><AdSlot label="Anúncio - topo da página inicial" /></div>

      <HomeModular secoes={secoesVisiveis} destaque={destaque} noticias={noticias} maisLidas={maisLidas} propagandas={propagandas} municipios={municipios} precos={precos} eventos={eventos} />
    </div>
  );
}
