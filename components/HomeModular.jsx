import Link from "next/link";
import NoticiaFeedItem from "@/components/NoticiaFeedItem";
import NoticiaDestaque from "@/components/NoticiaDestaque";
import MaisLidas from "@/components/MaisLidas";
import PropagandaCard from "@/components/PropagandaCard";
import TempoFaixa from "@/components/TempoFaixa";
import AdSlot from "@/components/AdSlot";

function formatarPreco(valor) {
  if (valor == null) return "—";
  return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function HomeModular({
  secoes,
  destaque,
  noticias,
  maisLidas,
  propagandas,
  municipios,
  precos,
  eventos,
}) {
  return (
    <div>
      {secoes.map((secao) => {
        if (secao.tipo === "tempo") {
          return <TempoFaixa key={secao.id} municipios={municipios} />;
        }
        if (secao.tipo === "destaque" && destaque) {
          return (
            <div key={secao.id} className="max-w-content mx-auto px-5 pt-8">
              {secao.titulo && (
                <h2 className="text-xl font-bold text-cariri-preto mb-4">{secao.titulo}</h2>
              )}
              <NoticiaDestaque noticia={destaque} />
            </div>
          );
        }
        if (secao.tipo === "publicacoes") {
          return (
            <div key={secao.id} className="max-w-content mx-auto px-5 py-10 grid gap-10 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-bold text-cariri-preto">{secao.titulo || "Informações"}</h2>
                  <Link href="/informacoes" className="text-sm font-semibold text-cariri-verde">
                    Ver todas →
                  </Link>
                </div>
                {noticias.length === 0 ? (
                  <p className="text-cariri-cinza-texto">Nenhum conteúdo publicado ainda.</p>
                ) : (
                  <div className="flex flex-col gap-6">
                    {noticias.map((n) => (
                      <NoticiaFeedItem key={n.slug} noticia={n} />
                    ))}
                  </div>
                )}
              </div>
              <aside className="space-y-6">
                {secoes.some((s) => s.tipo === "mais_lidas" && s.ativo !== false) && (
                  <MaisLidas noticias={maisLidas} />
                )}
                {secoes.some((s) => s.tipo === "publicidade") && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-cariri-preto">Publicidade local</h2>
                      <Link href="/publicidade" className="text-sm font-semibold text-cariri-verde">
                        Ver todas →
                      </Link>
                    </div>
                    <div className="flex flex-col gap-4">
                      {propagandas.map((p) => (
                        <PropagandaCard key={p.id} propaganda={p} />
                      ))}
                    </div>
                  </div>
                )}
                <AdSlot label="Anúncio - barra lateral da página inicial" />
              </aside>
            </div>
          );
        }
        if (secao.tipo === "mais_lidas" || secao.tipo === "publicidade") {
          return null;
        }
        if (secao.tipo === "precos") {
          if (!precos?.length) return null;
          return (
            <section key={secao.id} className="max-w-content mx-auto px-5 py-8">
              <h2 className="text-xl font-bold text-cariri-preto mb-4">{secao.titulo || "Preços do Cariri"}</h2>
              <p className="text-sm text-cariri-cinza-texto mb-4">
                Valores informados por município, data e fonte — não são preços universais da região.
              </p>
              <div className="overflow-x-auto border border-cariri-verde-claro rounded-xl">
                <table className="w-full text-sm">
                  <thead className="bg-cariri-verde-claro text-left">
                    <tr>
                      <th className="px-3 py-2">Município</th>
                      <th className="px-3 py-2">Produto</th>
                      <th className="px-3 py-2">Preço</th>
                      <th className="px-3 py-2">Data</th>
                      <th className="px-3 py-2">Fonte</th>
                    </tr>
                  </thead>
                  <tbody>
                    {precos.slice(0, secao.dados?.limite || 8).map((p) => (
                      <tr key={p.id} className="border-t border-cariri-verde-claro">
                        <td className="px-3 py-2">{p.municipio || "—"}</td>
                        <td className="px-3 py-2">
                          {p.produto}
                          {p.unidade ? ` (${p.unidade})` : ""}
                        </td>
                        <td className="px-3 py-2 font-semibold">{formatarPreco(p.preco)}</td>
                        <td className="px-3 py-2">
                          {p.data ? new Date(p.data + "T12:00:00").toLocaleDateString("pt-BR") : "—"}
                        </td>
                        <td className="px-3 py-2">{p.fonte || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        }
        if (secao.tipo === "eventos") {
          if (!eventos?.length) return null;
          return (
            <section key={secao.id} className="max-w-content mx-auto px-5 py-8">
              <h2 className="text-xl font-bold text-cariri-preto mb-4">{secao.titulo || "Eventos"}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {eventos.slice(0, secao.dados?.limite || 4).map((ev) => (
                  <article key={ev.id} className="border border-cariri-verde-claro rounded-xl p-4">
                    <p className="text-xs font-semibold text-cariri-verde uppercase">{ev.municipio || "Cariri"}</p>
                    <h3 className="mt-1 font-bold text-cariri-preto">{ev.titulo}</h3>
                    <p className="mt-1 text-sm text-cariri-cinza-texto">{ev.resumo}</p>
                    {ev.dataInicio && (
                      <p className="mt-2 text-xs text-cariri-cinza-texto">
                        {new Date(ev.dataInicio + "T12:00:00").toLocaleDateString("pt-BR")}
                        {ev.local ? ` · ${ev.local}` : ""}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </section>
          );
        }
        if (secao.tipo === "adsense") {
          return (
            <div key={secao.id} className="max-w-content mx-auto px-5 pt-6">
              <AdSlot label={secao.titulo || "Anúncio"} />
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
