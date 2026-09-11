import Link from "next/link";

// Controles simples de "Anterior / Próxima", preservando o filtro de
// categoria que estiver ativo.
export default function Paginacao({ paginaAtual, totalPaginas, categoria = "" }) {
  if (totalPaginas <= 1) return null;

  function montarUrl(pagina) {
    const params = new URLSearchParams();
    if (categoria) params.set("categoria", categoria);
    if (pagina > 1) params.set("pagina", pagina);
    const query = params.toString();
    return `/noticias${query ? `?${query}` : ""}`;
  }

  return (
    <nav aria-label="Paginação" className="mt-10 flex items-center justify-between">
      {paginaAtual > 1 ? (
        <Link
          href={montarUrl(paginaAtual - 1)}
          className="text-sm font-semibold text-cariri-verde px-4 py-2 rounded-md border border-cariri-verde-claro hover:bg-cariri-verde-claro transition-colors"
        >
          ← Anterior
        </Link>
      ) : (
        <span />
      )}

      <span className="text-sm text-cariri-cinza-texto">
        Página {paginaAtual} de {totalPaginas}
      </span>

      {paginaAtual < totalPaginas ? (
        <Link
          href={montarUrl(paginaAtual + 1)}
          className="text-sm font-semibold text-cariri-verde px-4 py-2 rounded-md border border-cariri-verde-claro hover:bg-cariri-verde-claro transition-colors"
        >
          Próxima →
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
