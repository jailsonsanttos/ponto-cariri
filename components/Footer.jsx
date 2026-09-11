import Link from "next/link";

const URL_SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://ponto-cariri.vercel.app";

export default function Footer({ config }) {
  const ano = new Date().getFullYear();
  const temRedeSocial = config?.instagramUrl || config?.facebookUrl || config?.twitterUrl;

  return (
    <footer className="bg-cariri-verde-escuro text-white mt-16">
      <div className="max-w-content mx-auto px-5 py-10 grid gap-8 sm:grid-cols-3">
        <div>
          <p className="text-lg font-bold">Ponto Cariri</p>
          <p className="mt-2 text-sm text-white/70 leading-relaxed">
            Informação sobre toda a região do Cariri cearense: municípios,
            notícias, tempo e comércio local.
          </p>

          {temRedeSocial && (
            <div className="mt-4 flex items-center gap-3">
              {config.instagramUrl && (
                <a
                  href={config.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram do Ponto Cariri"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </a>
              )}
              {config.facebookUrl && (
                <a
                  href={config.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook do Ponto Cariri"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13.5 21v-7.5H16l.5-3H13.5V8.2c0-.87.24-1.46 1.5-1.46H16.6V4.14C16.3 4.1 15.3 4 14.1 4c-2.4 0-4 1.46-4 4.14V10.5H7.5v3H10V21h3.5Z" />
                  </svg>
                </a>
              )}
              {config.twitterUrl && (
                <a
                  href={config.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X (Twitter) do Ponto Cariri"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.9 2H22l-7.6 8.7L23 22h-6.9l-5.4-6.6L4.5 22H1.4l8.1-9.3L1 2h7l4.9 6.1L18.9 2Zm-1.2 18h1.9L7.4 4H5.4l12.3 16Z" />
                  </svg>
                </a>
              )}
            </div>
          )}
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
            Compartilhe o Ponto Cariri
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Ponto Cariri - ${URL_SITE}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-white bg-white/10 hover:bg-white/20 transition-colors px-3 py-1.5 rounded-md"
            >
              WhatsApp
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(URL_SITE)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-white bg-white/10 hover:bg-white/20 transition-colors px-3 py-1.5 rounded-md"
            >
              Facebook
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("Ponto Cariri")}&url=${encodeURIComponent(URL_SITE)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-white bg-white/10 hover:bg-white/20 transition-colors px-3 py-1.5 rounded-md"
            >
              X
            </a>
          </div>
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
