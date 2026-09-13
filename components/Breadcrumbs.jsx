import Link from "next/link";

const URL_SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://ponto-cariri.vercel.app";

// Trilha de navegação visual + dados estruturados (Schema.org
// BreadcrumbList), que ajudam o Google a entender a estrutura do site
// e podem exibir a trilha direto nos resultados de busca.
export default function Breadcrumbs({ itens }) {
  // itens: [{ label: "Notícias", href: "/noticias" }, { label: "Título da matéria" }]

  const dadosEstruturados = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: itens.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${URL_SITE}${item.href}` } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dadosEstruturados) }}
      />
      <nav aria-label="Trilha de navegação" className="text-sm text-cariri-cinza-texto mb-4">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-cariri-verde">Início</Link>
          </li>
          {itens.map((item, i) => (
            <li key={i} className="flex items-center gap-1.5">
              <span>/</span>
              {item.href ? (
                <Link href={item.href} className="hover:text-cariri-verde">{item.label}</Link>
              ) : (
                <span className="text-cariri-preto/80 truncate max-w-[220px] sm:max-w-none">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
