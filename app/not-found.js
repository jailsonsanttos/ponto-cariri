import Link from "next/link";

export default function NaoEncontrado() {
  return (
    <div className="max-w-content mx-auto px-5 py-20 text-center">
      <div className="flex justify-center mb-6">
        <svg viewBox="0 0 32 32" width="72" height="72" aria-hidden="true">
          <path d="M1 26 L9.5 12 L14 18.5 L19 9 L31 26 Z" fill="#1B7A43" />
          <path d="M1 26 L13 17 L18 22 L24 15 L31 26 Z" fill="#12130F" fillOpacity="0.12" />
          <circle cx="19" cy="9" r="4.4" fill="#1B7A43" />
          <circle cx="19" cy="9" r="4.4" fill="none" stroke="#FFFFFF" strokeWidth="1.4" />
        </svg>
      </div>

      <p className="text-sm font-semibold text-cariri-verde uppercase tracking-wide">
        Erro 404
      </p>
      <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-cariri-preto">
        Essa página se perdeu na Serra do Araripe
      </h1>
      <p className="mt-3 text-cariri-cinza-texto max-w-md mx-auto">
        Não encontramos o que você procurava. Talvez o link esteja
        incorreto ou a página tenha sido removida.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="bg-cariri-verde text-white font-semibold px-5 py-2.5 rounded-md hover:bg-cariri-verde-escuro transition-colors"
        >
          Voltar para a página inicial
        </Link>
        <Link
          href="/noticias"
          className="bg-cariri-verde-claro text-cariri-verde-escuro font-semibold px-5 py-2.5 rounded-md hover:bg-cariri-verde-claro/70 transition-colors"
        >
          Ver notícias
        </Link>
      </div>
    </div>
  );
}
