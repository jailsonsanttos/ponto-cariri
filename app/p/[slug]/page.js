import { notFound } from "next/navigation";
import { buscarPaginaCompleta } from "@/lib/cms";
import PaginaBlocos from "@/components/PaginaBlocos";
import AdSlot from "@/components/AdSlot";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const pagina = await buscarPaginaCompleta(params.slug);
  if (!pagina || !pagina.publicada) return { title: "Página" };
  return {
    title: pagina.seoTitulo || pagina.titulo,
    description: pagina.seoDescricao || "",
  };
}

export default async function PaginaCms({ params }) {
  noStore();
  if (params.slug === "sobre") notFound();
  const pagina = await buscarPaginaCompleta(params.slug);
  if (!pagina || !pagina.publicada) notFound();

  return (
    <div className="max-w-content mx-auto px-5 py-12">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-cariri-preto">{pagina.titulo}</h1>
        <div className="mt-6">
          <AdSlot label={`Anúncio - ${pagina.titulo}`} />
        </div>
        <div className="mt-8">
          <PaginaBlocos blocos={pagina.blocos} />
        </div>
      </div>
    </div>
  );
}
