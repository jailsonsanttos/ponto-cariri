import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import {
  listarNoticiasPaginado,
  listarPropagandasRecentes,
  listarMunicipios,
  buscarNoticiaDestaque,
  listarMaisLidas,
} from "@/lib/db";
import NoticiaFeedItem from "@/components/NoticiaFeedItem";
import NoticiaDestaque from "@/components/NoticiaDestaque";
import MaisLidas from "@/components/MaisLidas";
import PropagandaCard from "@/components/PropagandaCard";
import TempoFaixa from "@/components/TempoFaixa";
import AdSlot from "@/components/AdSlot";

// Garante que esta página busque dados novos a cada visita, em vez de
// usar uma versão "congelada" gerada no momento do build.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  noStore();

  const [{ noticias: todasRecentes }, destaque, propagandas, municipios, maisLidas] =
    await Promise.all([
      listarNoticiasPaginado({ pagina: 1, porPagina: 11 }),
      buscarNoticiaDestaque(),
      listarPropagandasRecentes(3),
      listarMunicipios(),
      listarMaisLidas(5),
    ]);

  // Remove a notícia em destaque do feed comum, para não repetir.
  const noticias = todasRecentes
    .filter((n) => n.slug !== destaque?.slug)
    .slice(0, 10);

  return (
    <div>
      {/* Faixa de previsão do tempo, rolando automaticamente */}
      <TempoFaixa municipios={municipios} />

      {/* Cabeçalho curto de boas-vindas */}
      <section className="bg-white border-b border-cariri-verde-claro">
        <div className="max-w-content mx-auto px-5 py-8 sm:py-10">
          <p className="text-sm font-semibold text-cariri-verde uppercase tracking-wide">
            Região do Cariri cearense
          </p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-cariri-preto leading-tight">
            Tudo sobre o Cariri, atualizado na hora
          </h1>
        </div>
      </section>

      {destaque && (
        <div className="max-w-content mx-auto px-5 pt-8">
          <NoticiaDestaque noticia={destaque} />
        </div>
      )}

      <div className="max-w-content mx-auto px-5 pt-6">
        <AdSlot label="Anúncio - topo da página inicial" />
      </div>

      <div className="max-w-content mx-auto px-5 py-10 grid gap-10 lg:grid-cols-3">
        {/* Feed de notícias (coluna principal) */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-cariri-preto">Notícias recentes</h2>
            <Link href="/noticias" className="text-sm font-semibold text-cariri-verde">
              Ver todas →
            </Link>
          </div>

          {noticias.length === 0 ? (
            <p className="text-cariri-cinza-texto">Nenhuma notícia publicada ainda.</p>
          ) : (
            <div className="flex flex-col gap-6">
              {noticias.map((n) => (
                <NoticiaFeedItem key={n.slug} noticia={n} />
              ))}
            </div>
          )}
        </div>

        {/* Barra lateral: mais lidas + propaganda recente */}
        <aside className="space-y-6">
          <MaisLidas noticias={maisLidas} />

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-cariri-preto">Propaganda local</h2>
              <Link href="/propaganda" className="text-sm font-semibold text-cariri-verde">
                Ver todas →
              </Link>
            </div>
            {propagandas.length === 0 ? (
              <p className="text-sm text-cariri-cinza-texto">
                Nenhum anúncio cadastrado ainda.
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {propagandas.map((p) => (
                  <PropagandaCard key={p.id} propaganda={p} />
                ))}
              </div>
            )}
          </div>

          <AdSlot label="Anúncio - barra lateral da página inicial" />
        </aside>
      </div>
    </div>
  );
}
