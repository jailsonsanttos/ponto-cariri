import Link from "next/link";
import NoticiaFeedItem from "@/components/NoticiaFeedItem";
import NoticiaDestaque from "@/components/NoticiaDestaque";
import MaisLidas from "@/components/MaisLidas";
import PropagandaCard from "@/components/PropagandaCard";
import TempoFaixa from "@/components/TempoFaixa";
import AdSlot from "@/components/AdSlot";
import TabelaPrecosCariri from "@/components/TabelaPrecosCariri";

function CabecalhoSecao({ titulo, descricao, href, linkLabel = "Ver todos" }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
      <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-cariri-verde">Ponto Cariri</p><h2 className="mt-1 text-2xl font-black tracking-tight text-cariri-preto">{titulo}</h2>{descricao && <p className="mt-2 max-w-2xl text-sm leading-6 text-cariri-cinza-texto">{descricao}</p>}</div>
      {href && <Link href={href} className="shrink-0 text-sm font-bold text-cariri-verde hover:underline">{linkLabel} →</Link>}
    </div>
  );
}

export default function HomeModular({ secoes, destaque, noticias, maisLidas, propagandas, municipios, precos, eventos }) {
  return (
    <div>
      {secoes.map((secao) => {
        if (secao.tipo === "tempo") return <TempoFaixa key={secao.id} municipios={municipios} />;
        if (secao.tipo === "destaque" && destaque) return <section key={secao.id} className="mx-auto max-w-content px-5 py-10"><CabecalhoSecao titulo={secao.titulo || "Em destaque"} descricao="A história que merece a sua atenção hoje." href="/informacoes" linkLabel="Mais informações" /><NoticiaDestaque noticia={destaque} /></section>;
        if (secao.tipo === "publicacoes") return (
          <section key={secao.id} className="border-y border-cariri-verde-claro/70 bg-slate-50/70">
            <div className="mx-auto grid max-w-content gap-10 px-5 py-12 lg:grid-cols-[1.45fr_0.75fr]">
              <div><CabecalhoSecao titulo={secao.titulo || "Informações recentes"} descricao="Conteúdos para acompanhar o que acontece e descobrir novas histórias do Cariri." href="/informacoes" /><div className="flex flex-col gap-5">{noticias.length ? noticias.map((n) => <NoticiaFeedItem key={n.slug} noticia={n} />) : <p className="text-cariri-cinza-texto">Nenhum conteúdo publicado ainda.</p>}</div></div>
              <aside className="space-y-6">{secoes.some((s) => s.tipo === "mais_lidas" && s.ativo !== false) && <MaisLidas noticias={maisLidas} />}{secoes.some((s) => s.tipo === "publicidade") && <div><CabecalhoSecao titulo="Publicidade local" href="/publicidade" linkLabel="Ver anúncios" /><div className="flex flex-col gap-4">{propagandas.map((p) => <PropagandaCard key={p.id} propaganda={p} />)}</div></div>}<AdSlot label="Anúncio - barra lateral da página inicial" /></aside>
            </div>
          </section>
        );
        if (secao.tipo === "mais_lidas" || secao.tipo === "publicidade") return null;
        if (secao.tipo === "precos") return precos?.length ? <section key={secao.id} className="mx-auto max-w-content px-5 py-12"><CabecalhoSecao titulo={secao.titulo || "Preços do Cariri"} descricao="Referências locais organizadas por município, data e fonte." href="/precos" /><div className="overflow-hidden rounded-2xl border border-cariri-verde-claro bg-white shadow-sm"><TabelaPrecosCariri precos={precos} limite={secao.dados?.limite || 8} /></div></section> : null;
        if (secao.tipo === "eventos") return eventos?.length ? <section key={secao.id} className="border-t border-cariri-verde-claro/70 bg-cariri-verde-claro/30"><div className="mx-auto max-w-content px-5 py-12"><CabecalhoSecao titulo={secao.titulo || "Eventos"} descricao="O que acontece na região e merece entrar na sua agenda." href="/informacoes?categoria=Eventos" /><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{eventos.slice(0, secao.dados?.limite || 4).map((ev) => <article key={ev.id} className="rounded-2xl border border-cariri-verde-claro bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"><p className="text-xs font-bold uppercase tracking-wide text-cariri-verde">{ev.municipio || "Cariri"}</p><h3 className="mt-2 font-black text-cariri-preto">{ev.titulo}</h3><p className="mt-2 line-clamp-3 text-sm leading-6 text-cariri-cinza-texto">{ev.resumo}</p>{ev.dataInicio && <p className="mt-4 border-t border-cariri-verde-claro pt-3 text-xs font-semibold text-cariri-cinza-texto">{new Date(ev.dataInicio + "T12:00:00").toLocaleDateString("pt-BR")}{ev.local ? ` · ${ev.local}` : ""}</p>}</article>)}</div></div></section> : null;
        if (secao.tipo === "adsense") return <div key={secao.id} className="mx-auto max-w-content px-5 pt-6"><AdSlot label={secao.titulo || "Anúncio"} /></div>;
        return null;
      })}
      <section className="mx-auto max-w-content px-5 py-12"><div className="rounded-3xl bg-cariri-verde p-7 text-white sm:p-10"><div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-white/70">Faça parte do Cariri</p><h2 className="mt-2 text-3xl font-black tracking-tight">Sua história também merece espaço.</h2><p className="mt-3 max-w-2xl text-white/75">Conheça o portal, compartilhe uma pauta ou divulgue o seu negócio na região.</p></div><div className="flex flex-wrap gap-3"><Link href="/informacoes" className="rounded-full bg-white px-5 py-3 text-sm font-bold text-cariri-verde">Enviar uma pauta</Link><Link href="/publicidade" className="rounded-full border border-white/40 px-5 py-3 text-sm font-bold text-white">Anunciar</Link></div></div></div></section>
    </div>
  );
}
