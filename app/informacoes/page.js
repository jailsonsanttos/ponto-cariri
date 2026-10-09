import Link from "next/link";
import { listarNoticiasPaginado, listarCategorias } from "@/lib/db";
import { listarCategoriasCms } from "@/lib/cms";
import NoticiaCard from "@/components/NoticiaCard";
import NoticiaFeedItem from "@/components/NoticiaFeedItem";
import AdSlot from "@/components/AdSlot";
import Paginacao from "@/components/Paginacao";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Informações do Cariri",
  description: "Cultura, turismo, agro, educação e informações da região do Cariri cearense.",
};

const POR_PAGINA = 9;

export default async function InformacoesPage({ searchParams }) {
  noStore();
  const pagina = Math.max(1, parseInt(searchParams?.pagina) || 1);
  const categoria = searchParams?.categoria || "";

  const [{ noticias, total, totalPaginas }, categoriasUsadas, categoriasCms] = await Promise.all([
    listarNoticiasPaginado({ pagina, porPagina: POR_PAGINA, categoria }),
    listarCategorias(),
    listarCategoriasCms().catch(() => []),
  ]);

  const nomes = [...categoriasCms.filter((c) => c.ativo).map((c) => c.nome), ...categoriasUsadas]
    .filter((v, i, a) => v && a.indexOf(v) === i);
  const destaque = pagina === 1 && noticias.length > 0 ? noticias[0] : null;
  const restantes = destaque ? noticias.slice(1) : noticias;

  return (
    <div className="overflow-hidden bg-white">
      <section className="relative isolate bg-cariri-verde-escuro text-white">
        <div className="absolute inset-0 -z-10 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 15% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 70%, white 1px, transparent 1px)", backgroundSize: "34px 34px, 46px 46px" }} />
        <div className="mx-auto grid max-w-content items-end gap-8 px-5 py-14 sm:py-20 lg:grid-cols-[1.2fr_0.8fr] lg:py-24">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-cariri-verde-claro"><span className="h-2 w-2 rounded-full bg-cariri-verde-claro" />Informação regional</p>
            <h1 className="max-w-3xl text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">As histórias, ideias e notícias que movem o Cariri.</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">Conteúdo sobre cultura, turismo, agro, cidades, economia, eventos e o cotidiano da nossa região.</p>
          </div>
          <div className="hidden rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur sm:block">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/60">Conteúdo do Ponto Cariri</p>
            <p className="mt-4 text-3xl font-black">Informação útil, perto de você.</p>
            <p className="mt-3 text-sm leading-6 text-white/70">Leia, compartilhe e descubra novas perspectivas sobre o Cariri cearense.</p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-content px-5 pt-7"><AdSlot label="Anúncio - topo da lista de informações" /></div>

      <main className="mx-auto max-w-content px-5 pb-16 pt-10">
        <div className="mb-8 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-cariri-verde-claro p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-cariri-verde">Publicações</p><p className="mt-2 text-3xl font-black text-cariri-preto">{total}</p><p className="mt-1 text-sm text-cariri-cinza-texto">conteúdos publicados</p></div>
          <div className="rounded-2xl bg-slate-50 p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-cariri-verde">Categorias</p><p className="mt-2 text-3xl font-black text-cariri-preto">{nomes.length}</p><p className="mt-1 text-sm text-cariri-cinza-texto">assuntos para explorar</p></div>
          <div className="rounded-2xl bg-slate-50 p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-cariri-verde">Leitura</p><p className="mt-2 text-3xl font-black text-cariri-preto">{pagina}/{totalPaginas}</p><p className="mt-1 text-sm text-cariri-cinza-texto">página atual</p></div>
        </div>

        {nomes.length > 0 && <div className="flex flex-wrap gap-2 border-b border-cariri-verde-claro pb-6"><Link href="/informacoes" className={`rounded-full px-4 py-2 text-sm font-bold transition ${!categoria ? "bg-cariri-verde text-white" : "bg-cariri-verde-claro text-cariri-verde-escuro hover:bg-cariri-verde-claro/70"}`}>Todas</Link>{nomes.map((c) => <Link key={c} href={`/informacoes?categoria=${encodeURIComponent(c)}`} className={`rounded-full px-4 py-2 text-sm font-bold transition ${categoria === c ? "bg-cariri-verde text-white" : "bg-cariri-verde-claro text-cariri-verde-escuro hover:bg-cariri-verde-claro/70"}`}>{c}</Link>)}</div>}

        {categoria && <div className="mt-8 flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-cariri-verde">Filtro ativo</p><h2 className="mt-1 text-2xl font-black text-cariri-preto">Conteúdos sobre {categoria}</h2></div><Link href="/informacoes" className="text-sm font-bold text-cariri-verde hover:underline">Ver todos</Link></div>}

        {noticias.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-cariri-verde-claro p-10 text-center"><p className="font-bold text-cariri-preto">Nenhum conteúdo encontrado</p><p className="mt-2 text-sm text-cariri-cinza-texto">Tente selecionar outra categoria.</p></div>
        ) : (
          <>
            {destaque && <section className="mt-8"><div className="mb-4 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-cariri-verde">Leitura em destaque</p><h2 className="mt-1 text-2xl font-black text-cariri-preto">O que está acontecendo no Cariri</h2></div></div><NoticiaFeedItem noticia={destaque} destaque /></section>}
            <section className="mt-12"><div className="mb-5 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-cariri-verde">Mais conteúdos</p><h2 className="mt-1 text-2xl font-black text-cariri-preto">Continue explorando</h2></div></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{restantes.map((n) => <NoticiaCard key={n.slug} noticia={n} />)}</div></section>
          </>
        )}

        <Paginacao paginaAtual={pagina} totalPaginas={totalPaginas} categoria={categoria} />
      </main>
    </div>
  );
}
