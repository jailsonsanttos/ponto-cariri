import { listarMunicipios } from "@/lib/db";
import MunicipioCard from "@/components/MunicipioCard";

// Garante que esta página busque dados novos a cada visita, em vez de
// usar uma versão "congelada" gerada no momento do build.
export const dynamic = "force-dynamic";

export const metadata = { title: "Municípios" };

export default async function MunicipiosPage() {
  const municipios = await listarMunicipios();

  return (
    <div className="max-w-content mx-auto px-5 py-12">
      <h1 className="text-3xl font-bold text-cariri-preto">Municípios do Cariri</h1>
      <p className="mt-2 text-cariri-cinza-texto max-w-2xl">
        Conheça a história, o hino e a localização de cada município da
        região do Cariri cearense.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {municipios.map((m) => (
          <MunicipioCard key={m.slug} municipio={m} />
        ))}
      </div>
    </div>
  );
}
