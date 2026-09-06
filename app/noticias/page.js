import { listarNoticias } from "@/lib/db";
import NoticiaCard from "@/components/NoticiaCard";
import AdSlot from "@/components/AdSlot";

export const metadata = { title: "Notícias" };

export default async function NoticiasPage() {
  const noticias = (await listarNoticias()).filter((n) => n.publicada);

  return (
    <div className="max-w-content mx-auto px-5 py-12">
      <h1 className="text-3xl font-bold text-cariri-preto">Notícias do Cariri</h1>
      <p className="mt-2 text-cariri-cinza-texto max-w-2xl">
        Acontecimentos e informações da região do Cariri cearense.
      </p>

      <AdSlot label="Anúncio - topo da lista de notícias" />

      {noticias.length === 0 ? (
        <p className="mt-8 text-cariri-cinza-texto">
          Nenhuma notícia publicada ainda.
        </p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {noticias.map((n) => (
            <NoticiaCard key={n.slug} noticia={n} />
          ))}
        </div>
      )}
    </div>
  );
}
