import Link from "next/link";
import Image from "next/image";

const URL_SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://ponto-cariri.vercel.app";

function IconeRedeSocial({ tipo }) {
  if (tipo === "instagram") {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (tipo === "facebook") {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.5 21v-7.5H16l.5-3H13.5V8.2c0-.87.24-1.46 1.5-1.46H16.6V4.14C16.3 4.1 15.3 4 14.1 4c-2.4 0-4 1.46-4 4.14V10.5H7.5v3H10V21h3.5Z" />
      </svg>
    );
  }
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.9 2H22l-7.6 8.7L23 22h-6.9l-5.4-6.6L4.5 22H1.4l8.1-9.3L1 2h7l4.9 6.1L18.9 2Zm-1.2 18h1.9L7.4 4H5.4l12.3 16Z" />
    </svg>
  );
}

export default function Footer({ config }) {
  const ano = new Date().getFullYear();
  const redesSociais = [
    { tipo: "instagram", url: config?.instagramUrl },
    { tipo: "facebook", url: config?.facebookUrl },
    { tipo: "x", url: config?.twitterUrl },
  ].filter((r) => r.url);

  return (
    <footer className="bg-cariri-verde-escuro text-white mt-16">
      <div className="max-w-content mx-auto px-5 py-10 flex flex-wrap items-center justify-between gap-8">
        {/* Logo em branco (silhueta), à esquerda */}
        <Link href="/" className="shrink-0">
          <Image
            src="/logo-branco.png"
            alt="Ponto Cariri"
            width={600}
            height={203}
            className="h-12 w-auto object-contain opacity-95"
          />
        </Link>

        {/* Redes sociais, ao centro */}
        {redesSociais.length > 0 && (
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-3">
              {redesSociais.map((r) => (
                <a
                  key={r.tipo}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={r.tipo}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-cariri-verde-claro hover:text-cariri-verde-escuro transition-colors"
                >
                  <IconeRedeSocial tipo={r.tipo} />
                </a>
              ))}
            </div>
            <p className="text-xs text-cariri-verde-claro font-medium">
              Nos acompanhe nas redes!
            </p>
          </div>
        )}

        {/* Contato, à direita */}
        {(config?.telefoneContato || config?.emailContato) && (
          <div className="text-sm text-white/80 text-right space-y-1.5">
            {config.telefoneContato && (
              <p className="flex items-center justify-end gap-2">
                <span>{config.telefoneContato}</span>
                <span aria-hidden="true">📞</span>
              </p>
            )}
            {config.emailContato && (
              <p className="flex items-center justify-end gap-2">
                <span>{config.emailContato}</span>
                <span aria-hidden="true">✉️</span>
              </p>
            )}
            <p className="pt-1 text-xs">
              <Link href="/privacidade" className="hover:text-white underline">Política de Privacidade</Link>
              {" "}|{" "}
              <Link href="/termos" className="hover:text-white underline">Termos de uso</Link>
            </p>
          </div>
        )}
      </div>

      <div className="border-t border-white/10 py-4">
        <div className="max-w-content mx-auto px-5 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-white/50">
            © {ano} Ponto Cariri. Todos os direitos reservados.
          </p>
          <p className="text-xs text-white/50">
            Região do Cariri cearense
          </p>
        </div>
      </div>
    </footer>
  );
}
