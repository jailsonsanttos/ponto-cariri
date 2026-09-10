import { listarMunicipios } from "@/lib/db";
import TempoCliente from "./TempoCliente";
import { unstable_noStore as noStore } from "next/cache";

// Garante que esta página busque dados novos a cada visita, em vez de
// usar uma versão "congelada" gerada no momento do build.
export const dynamic = "force-dynamic";

export const metadata = { title: "Previsão do Tempo" };

export default async function TempoPage() {
  noStore();

  const municipios = (await listarMunicipios()).map((m) => ({
    slug: m.slug,
    nome: m.nome,
    latitude: m.latitude,
    longitude: m.longitude,
  }));

  return (
    <div className="max-w-content mx-auto px-5 py-12">
      <h1 className="text-3xl font-bold text-cariri-preto">Previsão do Tempo</h1>
      <p className="mt-2 text-cariri-cinza-texto max-w-2xl">
        Escolha um município da região do Cariri para ver a previsão do
        tempo atualizada.
      </p>

      <TempoCliente municipios={municipios} />
    </div>
  );
}
