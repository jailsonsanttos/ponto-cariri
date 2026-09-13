import Link from "next/link";

export default function MaisLidas({ noticias }) {
  if (!noticias || noticias.length === 0) return null;

  return (
    <div className="rounded-lg border border-cariri-verde-claro p-5">
      <h2 className="text-sm font-bold text-cariri-preto mb-4">🔥 Mais lidas</h2>
      <ol className="space-y-3">
        {noticias.map((n, i) => (
          <li key={n.slug} className="flex gap-3">
            <span className="text-lg font-bold text-cariri-verde-claro leading-none">
              {String(i + 1).padStart(2, "0")}
            </span>
            <Link
              href={`/noticias/${n.slug}`}
              className="text-sm font-medium text-cariri-preto hover:text-cariri-verde leading-snug"
            >
              {n.titulo}
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
