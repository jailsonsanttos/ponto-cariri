import { buscarConfig } from "@/lib/db";
import { unstable_noStore as noStore } from "next/cache";

// Garante que esta página busque dados novos a cada visita, em vez de
// usar uma versão "congelada" gerada no momento do build.
export const dynamic = "force-dynamic";

export const metadata = { title: "Sobre o Ponto Cariri" };

export default async function SobrePage() {
  noStore();

  const config = await buscarConfig();

  return (
    <div className="max-w-content mx-auto px-5 py-12">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-cariri-preto">Sobre o Ponto Cariri</h1>
        <p className="mt-6 text-cariri-preto/90 leading-relaxed whitespace-pre-line">
          {config.sobreTexto}
        </p>

        <div className="mt-8 rounded-lg border border-cariri-verde-claro p-6">
          <p className="text-sm font-semibold text-cariri-preto">Responsável pelo projeto</p>
          <p className="mt-1 text-cariri-cinza-texto">{config.responsavel}</p>
        </div>

        <div className="mt-6 rounded-lg bg-cariri-verde-claro p-6">
          <p className="text-sm text-cariri-preto leading-relaxed">
            O Ponto Cariri é mantido de forma autônoma, por meio de doações
            voluntárias. Use o botão verde no canto da tela para contribuir
            com o projeto via Pix.
          </p>
        </div>
      </div>
    </div>
  );
}
