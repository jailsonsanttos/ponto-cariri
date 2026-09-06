import Link from "next/link";

export default function Footer() {
  const ano = new Date().getFullYear();
  return (
    <footer className="bg-cariri-preto text-white mt-16">
      <div className="max-w-content mx-auto px-5 py-10 grid gap-8 sm:grid-cols-3">
        <div>
          <p className="text-lg font-bold">Ponto Cariri</p>
          <p className="mt-2 text-sm text-white/70 leading-relaxed">
            Informação sobre toda a região do Cariri cearense: municípios,
            notícias, tempo e comércio local.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-cariri-verde-claro mb-3">
            Navegação
          </p>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link href="/municipios" className="hover:text-white">Municípios</Link></li>
            <li><Link href="/noticias" className="hover:text-white">Notícias</Link></li>
            <li><Link href="/tempo" className="hover:text-white">Tempo</Link></li>
            <li><Link href="/propaganda" className="hover:text-white">Propaganda</Link></li>
            <li><Link href="/sobre" className="hover:text-white">Sobre o Ponto Cariri</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-cariri-verde-claro mb-3">
            Projeto independente
          </p>
          <p className="text-sm text-white/70 leading-relaxed">
            Mantido de forma autônoma, por meio de doações. Responsável:
            Jailson Santos.
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 py-4">
        <p className="text-center text-xs text-white/50">
          © {ano} Ponto Cariri. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
