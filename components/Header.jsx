"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/municipios", label: "Municípios" },
  { href: "/tempo", label: "Tempo" },
  { href: "/noticias", label: "Notícias" },
  { href: "/propaganda", label: "Propaganda" },
  { href: "/sobre", label: "Sobre" },
];

// Marca própria: a silhueta da Chapada do Araripe, referência geográfica
// do Cariri, em vez de um logotipo genérico.
function Logomark() {
  return (
    <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true">
      <circle cx="23" cy="9" r="3.2" fill="#1B7A43" fillOpacity="0.25" />
      <path d="M1 25 L9.5 11 L14 17.5 L19 8 L31 25 Z" fill="#1B7A43" />
      <path d="M1 25 L13 16 L18 21 L24 14 L31 25 Z" fill="#12130F" fillOpacity="0.12" />
    </svg>
  );
}

function linkEstaAtivo(pathname, href) {
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Header() {
  const pathname = usePathname();
  const [menuAberto, setMenuAberto] = useState(false);
  const [comSombra, setComSombra] = useState(false);

  // Sombra sutil que aparece só depois que a pessoa rola a página —
  // dá profundidade ao cabeçalho sem precisar de decoração fixa.
  useEffect(() => {
    function aoRolar() {
      setComSombra(window.scrollY > 8);
    }
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  // Trava a rolagem do fundo enquanto o menu mobile está aberto.
  useEffect(() => {
    document.body.style.overflow = menuAberto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuAberto]);

  // Fecha o menu automaticamente ao navegar para outra página.
  useEffect(() => {
    setMenuAberto(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-40 w-full bg-white border-b border-cariri-verde-claro transition-shadow duration-200 ${
        comSombra ? "shadow-[0_8px_20px_-14px_rgba(18,19,15,0.35)]" : ""
      }`}
    >
      <div className="max-w-content mx-auto px-5 h-16 sm:h-[72px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Logomark />
          <span className="text-[17px] font-bold tracking-tight text-cariri-preto">
            Ponto Cariri
          </span>
        </Link>

        {/* Navegação para telas médias/grandes: sublinhado deslizante indica a página atual */}
        <nav aria-label="Navegação principal" className="hidden md:flex items-center gap-0.5">
          {links.map((link) => {
            const ativo = linkEstaAtivo(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={ativo ? "page" : undefined}
                className="relative px-3.5 py-2 text-[15px] font-medium text-cariri-preto/75 hover:text-cariri-preto transition-colors"
              >
                {link.label}
                <span
                  className={`absolute left-3.5 right-3.5 -bottom-[1px] h-[2px] rounded-full bg-cariri-verde origin-left transition-transform duration-200 ${
                    ativo ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
            );
          })}
          <Link
            href="/busca"
            aria-label="Buscar"
            className="ml-1 w-9 h-9 flex items-center justify-center rounded-full text-cariri-preto/75 hover:text-cariri-verde hover:bg-cariri-verde-claro transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </Link>
        </nav>

        {/* Botões de ação para celular: busca + menu */}
        <div className="md:hidden flex items-center gap-1 -mr-2">
          <Link
            href="/busca"
            aria-label="Buscar"
            className="w-11 h-11 flex items-center justify-center text-cariri-preto"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </Link>
          <button
            onClick={() => setMenuAberto(true)}
            aria-label="Abrir menu"
            aria-expanded={menuAberto}
            className="w-11 h-11 flex flex-col items-center justify-center gap-[5px]"
          >
            <span className="block w-6 h-[2px] bg-cariri-preto rounded-full" />
            <span className="block w-6 h-[2px] bg-cariri-preto rounded-full" />
            <span className="block w-4 h-[2px] self-end mr-[3px] bg-cariri-preto rounded-full" />
          </button>
        </div>
      </div>

      {/* Painel deslizante do menu mobile */}
      <div
        className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          menuAberto ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!menuAberto}
      >
        <div
          className="absolute inset-0 bg-cariri-preto/40"
          onClick={() => setMenuAberto(false)}
        />
        <div
          className={`absolute top-0 right-0 h-full w-[80%] max-w-xs bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
            menuAberto ? "translate-x-0" : "translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegação"
        >
          <div className="flex items-center justify-between px-5 h-16 border-b border-cariri-verde-claro shrink-0">
            <span className="flex items-center gap-2 font-bold text-cariri-preto">
              <Logomark />
              Ponto Cariri
            </span>
            <button
              onClick={() => setMenuAberto(false)}
              aria-label="Fechar menu"
              className="w-9 h-9 flex items-center justify-center text-2xl leading-none text-cariri-cinza-texto"
            >
              ×
            </button>
          </div>

          <nav aria-label="Navegação principal (celular)" className="px-3 py-3 flex flex-col overflow-y-auto">
            {links.map((link) => {
              const ativo = linkEstaAtivo(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={ativo ? "page" : undefined}
                  className={`px-4 py-3.5 rounded-lg text-[15px] font-medium transition-colors ${
                    ativo
                      ? "bg-cariri-verde-claro text-cariri-verde-escuro"
                      : "text-cariri-preto/85 hover:bg-cariri-verde-claro/60"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <p className="mt-auto px-5 py-4 text-xs text-cariri-cinza-texto border-t border-cariri-verde-claro shrink-0">
            Ponto Cariri — região do Cariri cearense
          </p>
        </div>
      </div>
    </header>
  );
}
