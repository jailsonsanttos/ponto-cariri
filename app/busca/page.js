import { Suspense } from "react";
import BuscaCliente from "./BuscaCliente";

export const metadata = { title: "Buscar" };

// Garante que esta página busque dados novos a cada visita, em vez de
// usar uma versão "congelada" gerada no momento do build.
export const dynamic = "force-dynamic";

export default function BuscaPage() {
  return (
    <div className="max-w-content mx-auto px-5 py-12">
      <h1 className="text-3xl font-bold text-cariri-preto">Buscar</h1>
      <Suspense fallback={<p className="mt-6 text-cariri-cinza-texto">Carregando…</p>}>
        <BuscaCliente />
      </Suspense>
    </div>
  );
}
