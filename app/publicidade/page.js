import { listarPropagandas } from "@/lib/db";
import PropagandaCard from "@/components/PropagandaCard";
import AdSlot from "@/components/AdSlot";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata = { title: "Publicidade" };

export default async function PublicidadePage() {
  noStore();
  const propagandas = (await listarPropagandas()).filter((p) => p.ativo);

  return (
    <div className="max-w-content mx-auto px-5 py-12">
      <h1 className="text-3xl font-bold text-cariri-preto">Publicidade local</h1>
      <p className="mt-2 text-cariri-cinza-texto max-w-2xl">
        Comércios e serviços da região do Cariri. Anúncios com data de início e encerramento
        definidos no painel.
      </p>

      <AdSlot label="Anúncio - topo da página de publicidade" />

      {propagandas.length === 0 ? (
        <p className="mt-8 text-cariri-cinza-texto">Nenhum anúncio cadastrado no momento.</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {propagandas.map((p) => (
            <PropagandaCard key={p.id} propaganda={p} />
          ))}
        </div>
      )}

      <div className="mt-10 rounded-lg border border-cariri-verde-claro bg-cariri-verde-claro p-6 text-center">
        <p className="font-semibold text-cariri-preto">Anuncie no Ponto Cariri</p>
        <p className="mt-1 text-sm text-cariri-cinza-texto">
          Fale conosco para divulgar seu comércio. O texto desta área também pode ser editado como
          página no painel.
        </p>
        <Link href="/sobre" className="inline-block mt-3 text-sm font-semibold text-cariri-verde">
          Falar com a equipe →
        </Link>
      </div>
    </div>
  );
}
