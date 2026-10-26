import Link from "next/link";
import { notFound } from "next/navigation";
import { garantirSchema } from "@/lib/db";
import { buscarVaga } from "@/lib/vagas";
import AdSlot from "@/components/AdSlot";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  await garantirSchema();
  const vaga = await buscarVaga(params.slug).catch(() => null);
  if (!vaga || !vaga.publicado) return { title: "Vaga não encontrada", robots: { index: false, follow: false } };
  return {
    title: `${vaga.titulo}${vaga.empresa ? ` — ${vaga.empresa}` : ""}`,
    description: (vaga.descricao || `Confira os detalhes da vaga de ${vaga.titulo} no Cariri.`).slice(0, 160),
    alternates: { canonical: `/vagas/${vaga.slug}` },
    openGraph: { type: "article", title: vaga.titulo, description: vaga.descricao || "Oportunidade de trabalho no Cariri.", images: vaga.imagem ? [vaga.imagem] : undefined },
  };
}

export default async function VagaDetalhePage({ params }) {
  noStore();
  await garantirSchema();
  const vaga = await buscarVaga(params.slug).catch(() => null);
  if (!vaga || !vaga.publicado) notFound();
  const jsonLd = { "@context": "https://schema.org", "@type": "JobPosting", title: vaga.titulo, description: vaga.descricao || vaga.requisitos || vaga.titulo, datePosted: vaga.dataPublicacao, validThrough: vaga.dataExpiracao || undefined, hiringOrganization: { "@type": "Organization", name: vaga.empresa || "Empresa não informada" }, jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: vaga.municipio || "Cariri", addressRegion: "CE", addressCountry: "BR" } }, employmentType: vaga.tipo };
  return (
    <main className="bg-slate-50 px-5 py-10 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-5xl"><Link href="/vagas" className="text-sm font-bold text-cariri-verde hover:underline">← Voltar para VAGAS</Link><div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px]">
        <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-10"><span className="rounded-full bg-cariri-verde-claro px-3 py-1 text-xs font-black uppercase tracking-wide text-cariri-verde-escuro">{vaga.tipo || "Emprego"}</span><h1 className="mt-5 text-4xl font-black leading-tight text-cariri-preto sm:text-5xl">{vaga.titulo}</h1><p className="mt-4 text-lg font-bold text-cariri-verde">{vaga.empresa || "Empresa não informada"}</p><div className="mt-6 flex flex-wrap gap-2 text-sm text-slate-600"><span className="rounded-full bg-slate-100 px-3 py-2">{vaga.municipio || "Cariri cearense"}</span><span className="rounded-full bg-slate-100 px-3 py-2">{vaga.modalidade || "Presencial"}</span>{vaga.salario && <span className="rounded-full bg-slate-100 px-3 py-2">{vaga.salario}</span>}</div><div className="mt-10 space-y-8"><section><h2 className="text-xl font-black">Sobre a oportunidade</h2><p className="mt-3 whitespace-pre-line text-base leading-8 text-slate-600">{vaga.descricao || "Detalhes não informados."}</p></section>{vaga.requisitos && <section><h2 className="text-xl font-black">Requisitos</h2><p className="mt-3 whitespace-pre-line text-base leading-8 text-slate-600">{vaga.requisitos}</p></section>}<section className="rounded-3xl bg-cariri-verde-claro p-6"><h2 className="text-xl font-black text-cariri-preto">Como se candidatar</h2><p className="mt-3 whitespace-pre-line leading-8 text-slate-700">{vaga.comoCandidatar || "Consulte a fonte original para se candidatar."}</p>{vaga.url && <a href={vaga.url} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex rounded-full bg-cariri-verde px-5 py-3 text-sm font-black text-white hover:bg-cariri-verde-escuro">Candidatar-se / ver fonte</a>}</section></div><p className="mt-8 border-t border-slate-100 pt-4 text-xs text-slate-400">Fonte: {vaga.fonte || "Ponto Cariri"}</p></article><aside><AdSlot label="Anúncio - detalhe da vaga" /></aside></div></div>
    </main>
  );
}
