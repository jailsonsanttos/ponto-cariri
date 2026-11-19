import Link from "next/link";
import NoticiaFeedItem from "@/components/NoticiaFeedItem";
import NoticiaDestaque from "@/components/NoticiaDestaque";
import MaisLidas from "@/components/MaisLidas";
import PropagandaCard from "@/components/PropagandaCard";
import AdSlot from "@/components/AdSlot";
import TabelaPrecosCariri from "@/components/TabelaPrecosCariri";

function TituloSecao({ children, href }) { return <div className="mb-5 flex items-end justify-between gap-4"><div><span className="pc-eyebrow text-cariri-laranja">Ponto Cariri</span><h2 className="pc-section-title mt-1">{children}</h2></div>{href && <Link href={href} className="pc-section-link shrink-0">Ver tudo <span aria-hidden="true">↗</span></Link>}</div>; }

export default function HomeModular({ secoes, destaque, noticias, maisLidas, propagandas, precos, eventos }) {
  return <div>
    {secoes.map((secao) => {
      if (secao.tipo === "tempo" || secao.tipo === "mais_lidas" || secao.tipo === "publicidade") return null;
      if (secao.tipo === "destaque" && destaque) return <section key={secao.id} className="pc-shell py-10 sm:py-14"><TituloSecao>{secao.titulo || "Em destaque"}</TituloSecao><NoticiaDestaque noticia={destaque} /></section>;
      if (secao.tipo === "publicacoes") return <section key={secao.id} className="pc-shell grid gap-12 py-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_20rem]"><div><TituloSecao href="/informacoes">{secao.titulo || "Últimas informações"}</TituloSecao>{noticias.length === 0 ? <p className="text-cariri-cinza-texto">Nenhum conteúdo publicado ainda.</p> : <div className="divide-y divide-[#e5dbcc] rounded-[1.5rem] border border-[#e8dfd2] bg-white px-5 shadow-[0_12px_35px_-24px_rgba(18,61,50,.5)] sm:px-7">{noticias.map((n) => <NoticiaFeedItem key={n.slug} noticia={n} />)}</div>}</div><aside className="space-y-8"><MaisLidas noticias={maisLidas} /><AdSlot label="Anúncio - barra lateral da página inicial" />{propagandas?.length > 0 && <div><TituloSecao href="/publicidade">Publicidade local</TituloSecao><div className="space-y-4">{propagandas.map((p) => <PropagandaCard key={p.id} propaganda={p} />)}</div></div>}</aside></section>;
      if (secao.tipo === "precos" && precos?.length) return <section key={secao.id} className="bg-white py-12 sm:py-16"><div className="pc-shell"><TituloSecao href="/precos">{secao.titulo || "Preços do Cariri"}</TituloSecao><p className="mb-5 max-w-2xl text-sm leading-6 text-cariri-cinza-texto">Acompanhe valores informados por município, data e fonte.</p><TabelaPrecosCariri precos={precos} limite={secao.dados?.limite || 8} /></div></section>;
      if (secao.tipo === "eventos" && eventos?.length) return <section key={secao.id} className="pc-shell py-12 sm:py-16"><TituloSecao href="/eventos">{secao.titulo || "Agenda do Cariri"}</TituloSecao><div className="grid gap-4 sm:grid-cols-2">{eventos.slice(0, secao.dados?.limite || 4).map((ev) => <article key={ev.id} className="pc-paper p-5 transition hover:-translate-y-1 hover:shadow-xl"><span className="pc-eyebrow text-cariri-laranja">{ev.municipio || "Cariri"}</span><h3 className="mt-2 text-lg font-black text-cariri-preto">{ev.titulo}</h3><p className="mt-2 text-sm leading-6 text-cariri-cinza-texto">{ev.resumo}</p>{ev.dataInicio && <p className="mt-4 text-xs font-bold text-cariri-verde">{new Date(ev.dataInicio + "T12:00:00").toLocaleDateString("pt-BR")}{ev.local ? ` · ${ev.local}` : ""}</p>}</article>)}</div></section>;
      if (secao.tipo === "adsense") return <div key={secao.id} className="pc-shell py-5"><AdSlot label={secao.titulo || "Anúncio"} /></div>;
      return null;
    })}
  </div>;
}
