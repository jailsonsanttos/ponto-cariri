import { listarPrecos } from "@/lib/cms";
import AdSlot from "@/components/AdSlot";
import TabelaPrecosCariri from "@/components/TabelaPrecosCariri";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Preços do Cariri",
  description: "Consulte preços informados por município, data e fonte na região do Cariri cearense.",
};

export default async function PrecosPage() {
  noStore();
  const precos = await listarPrecos();

  return (
    <div className="max-w-content mx-auto px-5 py-12">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold text-cariri-verde uppercase tracking-wide">Economia regional</p>
        <h1 className="mt-2 text-3xl font-bold text-cariri-preto">Preços do Cariri</h1>
        <p className="mt-2 text-cariri-cinza-texto">
          Consulte os valores informados por município, data e fonte. Os dados são referências locais e não representam um preço universal para toda a região.
        </p>
      </div>

      <div className="mt-6">
        <AdSlot label="Anúncio - página de preços do Cariri" />
      </div>

      <div className="mt-8">
        <TabelaPrecosCariri precos={precos} />
      </div>
    </div>
  );
}
