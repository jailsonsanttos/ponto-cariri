import Link from "next/link";
import { garantirSchema, listarMunicipios } from "@/lib/db";
import { listarVagas } from "@/lib/vagas";
import AdSlot from "@/components/AdSlot";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "VAGAS de emprego no Cariri",
  description: "Encontre vagas de emprego, estágio e oportunidades nos municípios do Cariri cearense.",
};

export default async function VagasPage({ searchParams }) {
  noStore();
  const busca = searchParams?.q || "";
  const municipio = searchParams?.municipio || "";
  const tipo = searchParams?.tipo || "";
  await garantirSchema();
  const [vagas, municipios] = await Promise.all([
    listarVagas({ publicadas: true, busca, municipio, tipo }).catch(() => []),
    listarMunicipios().catch(() => []),
  ]);
  const tipos = [...new Set(vagas.map((vaga) => vaga.tipo).filter(Boolean))];

  return (
    <div className="overflow-hidden bg-slate-50">
      <section className="relative isolate bg-cariri-preto text-white">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_10%,rgba(27,122,67,.7),transparent_42%),linear-gradient(135deg,#12130F_0%,#124F2C_100%)]" />
        <div className="mx-auto max-w-content px-5 py-14 sm:py-20 lg:py-24">
          <div className="max-w-3xl">
            <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-cariri-verde-claro">Oportunidades no Cariri</p>
            <h1 className="mt-5 text-4xl font-black leading-[1.04] tracking-tight sm:text-6xl">VAGAS para dar o próximo passo.</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">Encontre oportunidades de emprego, estágio e trabalho nos municípios que fazem parte do Cariri cearense.</p>
          </div>
          <form action="/vagas" className="mt-9 grid gap-3 rounded-3xl border border-white/15 bg-white/10 p-3 backdrop-blur sm:grid-cols-[1fr_220px_auto]">
            <input name="q" defaultValue={busca} placeholder="Cargo, empresa ou palavra-chave" className="rounded-2xl border-0 bg-white px-4 py-3 text-sm text-cariri-preto outline-none ring-0 placeholder:text-slate-400" />
            <select name="municipio" defaultValue={municipio} className="rounded-2xl border-0 bg-white px-4 py-3 text-sm text-cariri-preto outline-none">
              <option value="">Todos os municípios</option>
              {municipios.map((item) => <option key={item.slug} value={item.nome}>{item.nome}</option>)}
            </select>
            <button className="rounded-2xl bg-cariri-verde px-5 py-3 text-sm font-black text-white transition hover:bg-cariri-verde-claro hover:text-cariri-preto">Buscar vagas</button>
          </form>
        </div>
      </section>

      <div className="mx-auto max-w-content px-5 pt-7"><AdSlot label="Anúncio - topo da página de vagas" /></div>

      <main className="mx-auto max-w-content px-5 pb-16 pt-10">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><p className="text-xs font-black uppercase tracking-[.16em] text-cariri-verde">Oportunidades</p><p className="mt-2 text-3xl font-black text-cariri-preto">{vagas.length}</p><p className="mt-1 text-sm text-slate-500">vagas encontradas</p></div>
          <div className="rounded-3xl bg-cariri-verde-claro p-5"><p className="text-xs font-black uppercase tracking-[.16em] text-cariri-verde">Região</p><p className="mt-2 text-3xl font-black text-cariri-preto">{municipios.length}</p><p className="mt-1 text-sm text-slate-600">municípios monitorados</p></div>
          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><p className="text-xs font-black uppercase tracking-[.16em] text-cariri-verde">Atualização</p><p className="mt-2 text-3xl font-black text-cariri-preto">1h</p><p className="mt-1 text-sm text-slate-500">quando a fonte automática estiver conectada</p></div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          <Link href="/vagas" className={`rounded-full px-4 py-2 text-sm font-bold ${!tipo ? "bg-cariri-verde text-white" : "bg-white text-cariri-preto ring-1 ring-slate-200"}`}>Todas</Link>
          {tipos.map((item) => <Link key={item} href={`/vagas?tipo=${encodeURIComponent(item)}`} className={`rounded-full px-4 py-2 text-sm font-bold ${tipo === item ? "bg-cariri-verde text-white" : "bg-white text-cariri-preto ring-1 ring-slate-200"}`}>{item}</Link>)}
        </div>

        {vagas.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-cariri-verde-claro bg-white p-12 text-center"><p className="text-lg font-black text-cariri-preto">Nenhuma vaga encontrada</p><p className="mt-2 text-sm text-slate-500">Tente mudar o município ou a palavra-chave. Novas oportunidades serão publicadas aqui.</p></div>
        ) : (
          <section className="mt-8 grid gap-5 md:grid-cols-2">
            {vagas.map((vaga) => (
              <article key={vaga.id} className="group flex flex-col rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl">
                <div className="flex items-start justify-between gap-4"><div><span className="rounded-full bg-cariri-verde-claro px-3 py-1 text-[11px] font-black uppercase tracking-wide text-cariri-verde-escuro">{vaga.tipo || "Emprego"}</span><h2 className="mt-4 text-2xl font-black leading-tight text-cariri-preto">{vaga.titulo}</h2></div><span className="shrink-0 rounded-2xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600">{vaga.modalidade || "Presencial"}</span></div>
                <p className="mt-3 font-bold text-cariri-verde">{vaga.empresa || "Empresa não informada"}</p>
                <p className="mt-2 text-sm text-slate-500">{vaga.municipio || "Cariri cearense"}{vaga.salario ? ` · ${vaga.salario}` : ""}</p>
                <p className="mt-4 line-clamp-3 text-sm leading-7 text-slate-600">{vaga.descricao || vaga.requisitos || "Confira os detalhes desta oportunidade."}</p>
                <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-4"><span className="text-xs text-slate-400">Fonte: {vaga.fonte || "Ponto Cariri"}</span><Link href={`/vagas/${vaga.slug}`} className="rounded-full bg-cariri-preto px-4 py-2 text-sm font-bold text-white transition hover:bg-cariri-verde">Ver detalhes</Link></div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
