import Link from "next/link";
import { listarNoticiasPaginado, listarCategorias } from "@/lib/db";
import NoticiaCard from "@/components/NoticiaCard";
import AdSlot from "@/components/AdSlot";
import Paginacao from "@/components/Paginacao";
import { unstable_noStore as noStore } from "next/cache";

// Garante que esta página busque dados novos a cada visita, em vez de
// usar uma versão "congelada" gerada no momento do build.
export const dynamic = "force-dynamic";

export const metadata = { title: "Notícias" };

const POR_PAGINA = 9;

export default async function NoticiasPage({ searchParams }) {
  noStore();

  const pagina = Math.max(1, parseInt(searchParams?.pagina) || 1);
  const categoria = searchParams?.categoria || "";

  const [{ noticias, totalPaginas }, categorias] = await Promise.all([
    listarNoticiasPaginado({ pagina, porPagina: POR_PAGINA, categoria }),
    listarCategorias(),
  ]);

  return (
    <div className="max-w-content mx-auto px-5 py-12">
      <h1 className="text-3xl font-bold text-cariri-preto">Notícias do Cariri</h1>
      <p className="mt-2 text-cariri-cinza-texto max-w-2xl">
        Acontecimentos e informações da região do Cariri cearense.
      </p>

      {categorias.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href="/noticias"
            className={`text-sm font-medium px-3.5 py-1.5 rounded-full transition-colors ${
              !categoria
                ? "bg-cariri-verde text-white"
                : "bg-cariri-verde-claro text-cariri-verde-escuro hover:bg-cariri-verde-claro/70"
            }`}
          >
            Todas
          </Link>
          {categorias.map((c) => (
            <Link
              key={c}
              href={`/noticias?categoria=${encodeURIComponent(c)}`}
              className={`text-sm font-medium px-3.5 py-1.5 rounded-full transition-colors ${
                categoria === c
                  ? "bg-cariri-verde text-white"
                  : "bg-cariri-verde-claro text-cariri-verde-escuro hover:bg-cariri-verde-claro/70"
              }`}
            >
              {c}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-6">
        <AdSlot label="Anúncio - topo da lista de notícias" />
      </div>

      {noticias.length === 0 ? (
        <p className="mt-8 text-cariri-cinza-texto">
          Nenhuma notícia encontrada{categoria ? ` na categoria "${categoria}"` : ""}.
        </p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {noticias.map((n) => (
            <NoticiaCard key={n.slug} noticia={n} />
          ))}
        </div>
      )}

      <Paginacao paginaAtual={pagina} totalPaginas={totalPaginas} categoria={categoria} />
    </div>
  );
}
