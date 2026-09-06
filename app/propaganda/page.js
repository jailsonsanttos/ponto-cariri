import { listarPropagandas } from "@/lib/db";
import PropagandaCard from "@/components/PropagandaCard";
import AdSlot from "@/components/AdSlot";

export const metadata = { title: "Propaganda" };

export default async function PropagandaPage() {
  const propagandas = (await listarPropagandas()).filter((p) => p.ativo);

  return (
    <div className="max-w-content mx-auto px-5 py-12">
      <h1 className="text-3xl font-bold text-cariri-preto">Propaganda local</h1>
      <p className="mt-2 text-cariri-cinza-texto max-w-2xl">
        Lojas, supermercados, farmácias e outros comércios da região do
        Cariri cearense.
      </p>

      <AdSlot label="Anúncio - topo da página de propaganda" />

      {propagandas.length === 0 ? (
        <p className="mt-8 text-cariri-cinza-texto">
          Nenhum anúncio cadastrado no momento.
        </p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {propagandas.map((p) => (
            <PropagandaCard key={p.id} propaganda={p} />
          ))}
        </div>
      )}

      <div className="mt-10 rounded-lg border border-cariri-verde-claro bg-cariri-verde-claro p-6 text-center">
        <p className="font-semibold text-cariri-preto">
          Quer anunciar seu comércio aqui?
        </p>
        <p className="mt-1 text-sm text-cariri-cinza-texto">
          Entre em contato com o Ponto Cariri pelo botão de doação/contato no rodapé do site.
        </p>
      </div>
    </div>
  );
}
