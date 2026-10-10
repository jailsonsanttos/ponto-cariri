import { notFound } from "next/navigation";
import { buscarPaginaCompleta } from "@/lib/cms";
import PaginaBlocos from "@/components/PaginaBlocos";
import AdSlot from "@/components/AdSlot";
import { unstable_noStore as noStore } from "next/cache";

const URL_SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.pontocariri.com.br").replace(/\/$/, "");

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const pagina = await buscarPaginaCompleta(params.slug);
  if (!pagina || !pagina.publicada) return { title: "Página não encontrada", robots: { index: false, follow: false } };
  const url = `${URL_SITE}/p/${pagina.slug}`;
  const description = pagina.seoDescricao || `Confira ${pagina.titulo} no Ponto Cariri.`;
  return {
    title: pagina.seoTitulo || pagina.titulo,
    description,
    alternates: { canonical: url },
    keywords: [pagina.titulo, "Ponto Cariri", "Cariri"],
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: { type: "website", url, siteName: "Ponto Cariri", title: pagina.seoTitulo || pagina.titulo, description },
    twitter: { card: "summary_large_image", title: pagina.seoTitulo || pagina.titulo, description },
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
