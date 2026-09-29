import Link from "next/link";
import { listarMunicipios, listarNoticias, listarPropagandas } from "@/lib/db";
import { listarPaginas, listarMidia, listarEventos, listarPrecos } from "@/lib/cms";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  noStore();

  const [municipios, noticias, propagandas, paginas, midia, eventos, precos] = await Promise.all([
    listarMunicipios(),
    listarNoticias(),
    listarPropagandas(),
    listarPaginas().catch(() => []),
    listarMidia().catch(() => []),
    listarEventos().catch(() => []),
    listarPrecos().catch(() => []),
  ]);

  const cartoes = [
    { label: "Publicações", total: noticias.length, href: "/admin/noticias" },
    { label: "Municípios", total: municipios.length, href: "/admin/municipios" },
    { label: "Páginas", total: paginas.length, href: "/admin/paginas" },
    { label: "Arquivos na biblioteca", total: midia.length, href: "/admin/midia" },
    { label: "Anúncios", total: propagandas.length, href: "/admin/propaganda" },
    { label: "Eventos", total: eventos.length, href: "/admin/eventos" },
    { label: "Preços cadastrados", total: precos.length, href: "/admin/precos" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-cariri-preto">Painel</h1>
      <p className="mt-1 text-cariri-cinza-texto">
        Conteúdo, menu, home, aparência e mídia — sem precisar alterar código.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cartoes.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-lg border border-cariri-verde-claro p-6 hover:border-cariri-verde transition-colors"
          >
            <p className="text-3xl font-bold text-cariri-preto">{c.total}</p>
            <p className="mt-1 text-sm text-cariri-cinza-texto">{c.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
