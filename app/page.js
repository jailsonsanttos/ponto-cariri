import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { listarNoticiasPaginado, listarPropagandasRecentes, listarMunicipios, buscarNoticiaDestaque, listarMaisLidas } from "@/lib/db";
import { listarHomeSecoes, listarPrecos, listarEventos } from "@/lib/cms";
import HomeModular from "@/components/HomeModular";
import AdSlot from "@/components/AdSlot";
import TempoFaixa from "@/components/TempoFaixa";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  noStore();
  const [{ noticias: todasRecentes }, destaque, propagandas, municipios, maisLidas, secoes, precos, eventos] = await Promise.all([
    listarNoticiasPaginado({ pagina: 1, porPagina: 11 }), buscarNoticiaDestaque(), listarPropagandasRecentes(3), listarMunicipios(), listarMaisLidas(5), listarHomeSecoes(true), listarPrecos(), listarEventos({ publicados: true }),
  ]);
  const noticias = todasRecentes.filter((n) => n.slug !== destaque?.slug).slice(0, 10);
  const secoesVisiveis = secoes.filter((s) => s.ativo !== false);
  const urlSite = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.pontocariri.com.br").replace(/\/$/, "");
  const schemaPublicacoes = { "@context": "https://schema.org", "@type": "ItemList", name: "Publicações recentes do Ponto Cariri", itemListElement: [destaque, ...noticias].filter((n) => n?.publicada && n?.slug).map((n, i) => ({ "@type": "ListItem", position: i + 1, url: `${urlSite}/informacoes/${n.slug}`, name: n.titulo })) };
  return <div className="overflow-hidden bg-[#f5f1e8]" id="conteudo-principal">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaPublicacoes) }} />
    <TempoFaixa municipios={municipios} />
    <section className="relative overflow-hidden bg-cariri-verde-escuro text-white"><div className="absolute -right-32 -top-40 h-[32rem] w-[32rem] rounded-full border-[70px] border-white/[.04]" /><div className="absolute -bottom-56 -left-40 h-[30rem] w-[30rem] rounded-full border-[55px] border-cariri-laranja/[.14]" /><div className="pc-shell relative grid gap-10 py-14 sm:py-20 lg:grid-cols-[1.08fr_.92fr] lg:items-end lg:py-24">
      <div><div className="mb-6 flex items-center gap-3"><span className="h-px w-10 bg-cariri-laranja" /><span className="pc-eyebrow text-cariri-verde-claro">Ponto Cariri · jornalismo regional</span></div><h1 className="max-w-3xl text-[2.8rem] font-black leading-[.98] tracking-[-.065em] sm:text-6xl lg:text-[5.2rem]">O Cariri em movimento.</h1><p className="mt-7 max-w-xl text-base leading-8 text-white/75 sm:text-lg">Notícias, histórias, oportunidades e serviço para quem vive, trabalha e ama a nossa região.</p><div className="mt-9 flex flex-wrap gap-3"><Link href="/informacoes" className="rounded-full bg-cariri-laranja px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-[#e28b56]">Ler as principais notícias</Link><Link href="/vagas" className="rounded-full border border-white/25 px-6 py-3.5 text-sm font-black text-white transition hover:bg-white/10">Ver oportunidades</Link></div></div>
      <div className="lg:pl-10"><p className="pc-eyebrow text-white/45">Um olhar próximo</p><p className="mt-4 max-w-md font-serif text-3xl leading-tight text-white/90 sm:text-4xl">“Informação que nasce daqui e conversa com você.”</p><div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10"><div className="bg-white/[.06] p-5"><strong className="text-3xl font-black">{municipios.length}</strong><span className="mt-1 block text-xs text-white/55">municípios</span></div><div className="bg-white/[.06] p-5"><strong className="text-3xl font-black">{todasRecentes.length}</strong><span className="mt-1 block text-xs text-white/55">conteúdos recentes</span></div><div className="bg-white/[.06] p-5"><strong className="text-3xl font-black">{precos.length}</strong><span className="mt-1 block text-xs text-white/55">preços locais</span></div><div className="bg-white/[.06] p-5"><strong className="text-3xl font-black">{eventos.length}</strong><span className="mt-1 block text-xs text-white/55">eventos</span></div></div></div>
    </div></section>
    <div className="pc-shell pt-7"><AdSlot label="Anúncio - topo da página inicial" /></div>
    <HomeModular secoes={secoesVisiveis} destaque={destaque} noticias={noticias} maisLidas={maisLidas} propagandas={propagandas} municipios={municipios} precos={precos} eventos={eventos} />
  </div>;
}
