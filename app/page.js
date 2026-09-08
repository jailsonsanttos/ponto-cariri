import Link from "next/link";
import { listarMunicipios, listarNoticias } from "@/lib/db";
import MunicipioCard from "@/components/MunicipioCard";
import NoticiaCard from "@/components/NoticiaCard";
import AdSlot from "@/components/AdSlot";

// Garante que esta página busque dados novos a cada visita, em vez de
// usar uma versão "congelada" gerada no momento do build.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const todosMunicipios = await listarMunicipios();
  const municipios = todosMunicipios.slice(0, 6);
  const noticias = (await listarNoticias())
    .filter((n) => n.publicada)
    .slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="bg-cariri-verde-claro">
        <div className="max-w-content mx-auto px-5 py-16 sm:py-20">
          <p className="text-sm font-semibold text-cariri-verde uppercase tracking-wide">
            Região do Cariri cearense
          </p>
          <h1 className="mt-3 text-3xl sm:text-5xl font-bold text-cariri-preto leading-tight max-w-2xl">
            Tudo sobre o Cariri em um só lugar
          </h1>
          <p className="mt-4 text-cariri-cinza-texto max-w-xl leading-relaxed">
            Municípios, notícias, previsão do tempo e o comércio local — o
            Ponto Cariri reúne fotos, vídeos e informações de toda a região.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/municipios"
              className="bg-cariri-verde text-white font-semibold px-5 py-3 rounded-md hover:bg-cariri-verde-escuro transition-colors"
            >
              Conhecer os municípios
            </Link>
            <Link
              href="/noticias"
              className="bg-white text-cariri-preto font-semibold px-5 py-3 rounded-md border border-cariri-preto/10 hover:border-cariri-verde transition-colors"
            >
              Ver notícias
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-content mx-auto px-5">
        <AdSlot label="Anúncio - topo da página inicial" />
      </div>

      {/* Municípios em destaque */}
      <section className="max-w-content mx-auto px-5 py-14">
        <div className="flex items-end justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-cariri-preto">Municípios</h2>
          <Link href="/municipios" className="text-sm font-semibold text-cariri-verde">
            Ver todos →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {municipios.map((m) => (
            <MunicipioCard key={m.slug} municipio={m} />
          ))}
        </div>
      </section>

      {/* Notícias recentes */}
      <section className="bg-cariri-verde-claro">
        <div className="max-w-content mx-auto px-5 py-14">
          <div className="flex items-end justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-cariri-preto">
              Notícias recentes
            </h2>
            <Link href="/noticias" className="text-sm font-semibold text-cariri-verde">
              Ver todas →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {noticias.map((n) => (
              <NoticiaCard key={n.slug} noticia={n} />
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-content mx-auto px-5 py-10">
        <AdSlot label="Anúncio - rodapé da página inicial" />
      </div>
    </div>
  );
}
