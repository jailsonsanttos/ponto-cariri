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

  return (
    <div>
      <section className="bg-white border-b border-cariri-verde-claro">
        <div className="max-w-content mx-auto px-5 py-8 sm:py-10">
          <p className="text-sm font-semibold text-cariri-verde uppercase tracking-wide">
            Região do Cariri cearense
          </p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-cariri-preto leading-tight">
            Informação, cultura e riquezas do Cariri
          </h1>
          <p className="mt-2 text-cariri-cinza-texto max-w-2xl">
            Um portal para conhecer as cidades, a cultura, o agro, o turismo e o cotidiano da região.
          </p>
        </div>
      </section>

      <div className="max-w-content mx-auto px-5 pt-6">
        <AdSlot label="Anúncio - topo da página inicial" />
      </div>

      <HomeModular
        secoes={secoes}
        destaque={destaque}
        noticias={noticias}
        maisLidas={maisLidas}
        propagandas={propagandas}
        municipios={municipios}
        precos={precos}
        eventos={eventos}
      />
    </div>
  );
}
