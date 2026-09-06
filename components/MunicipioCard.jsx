import Link from "next/link";

export default function MunicipioCard({ municipio }) {
  return (
    <Link
      href={`/municipios/${municipio.slug}`}
      className="block rounded-lg border border-cariri-verde-claro p-5 hover:border-cariri-verde hover:shadow-sm transition-all bg-white"
    >
      <p className="font-semibold text-cariri-preto">{municipio.nome}</p>
      <p className="mt-1 text-sm text-cariri-cinza-texto leading-relaxed">
        {municipio.descricaoCurta}
      </p>
      <span className="mt-3 inline-block text-sm font-medium text-cariri-verde">
        Ver município →
      </span>
    </Link>
  );
}
