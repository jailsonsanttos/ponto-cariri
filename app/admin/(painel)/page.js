import Link from "next/link";
import { listarMunicipios, listarNoticias, listarPropagandas } from "@/lib/db";

// Garante que esta página busque dados novos a cada visita, em vez de
// usar uma versão "congelada" gerada no momento do build.
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const municipios = await listarMunicipios();
  const noticias = await listarNoticias();
  const propagandas = await listarPropagandas();

  const cartoes = [
    { label: "Municípios cadastrados", total: municipios.length, href: "/admin/municipios" },
    { label: "Notícias cadastradas", total: noticias.length, href: "/admin/noticias" },
    { label: "Anúncios cadastrados", total: propagandas.length, href: "/admin/propaganda" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-cariri-preto">Painel de administração</h1>
      <p className="mt-1 text-cariri-cinza-texto">
        Gerencie o conteúdo do site Ponto Cariri por aqui.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
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

      <div className="mt-10 rounded-lg bg-cariri-verde-claro p-6 text-sm text-cariri-preto/90 leading-relaxed">
        <p className="font-semibold mb-1">Dica</p>
        <p>
          Use o menu ao lado para adicionar, editar ou remover municípios,
          notícias e anúncios. As alterações aparecem no site imediatamente
          após salvar.
        </p>
      </div>
    </div>
  );
}
