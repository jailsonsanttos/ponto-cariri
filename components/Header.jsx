"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const MENU_PADRAO = [
  { href: "/", label: "Início", filhos: [] },
  { href: "/informacoes", label: "Informações", filhos: [] },
  { href: "/municipios", label: "Municípios", filhos: [] },
  { href: "/publicidade", label: "Publicidade", filhos: [] },
  { href: "/tempo", label: "Tempo", filhos: [] },
  { href: "/sobre", label: "Sobre", filhos: [] },
];

function IconeLupa(props) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function IconeRedeSocial({ tipo }) {
  if (tipo === "instagram") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (tipo === "facebook") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.5 21v-7.5H16l.5-3H13.5V8.2c0-.87.24-1.46 1.5-1.46H16.6V4.14C16.3 4.1 15.3 4 14.1 4c-2.4 0-4 1.46-4 4.14V10.5H7.5v3H10V21h3.5Z" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.9 2H22l-7.6 8.7L23 22h-6.9l-5.4-6.6L4.5 22H1.4l8.1-9.3L1 2h7l4.9 6.1L18.9 2Zm-1.2 18h1.9L7.4 4H5.4l12.3 16Z" />
    </svg>
  );
}

function linkEstaAtivo(pathname, href) {
  if (!href) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href.split("?")[0] + "/");
}

function ItemMenu({ item, pathname, noMobile, onClick }) {
  const temFilhos = item.filhos && item.filhos.length > 0;
  const ativo =
    linkEstaAtivo(pathname, item.href) ||
    (temFilhos && item.filhos.some((f) => linkEstaAtivo(pathname, f.href)));

  if (!temFilhos) {
    return (
      <Link
        href={item.href || "/"}
        onClick={onClick}
        aria-current={ativo ? "page" : undefined}
        className={
          noMobile
            ? `px-4 py-3.5 rounded-lg text-[15px] font-medium ${
                ativo ? "bg-cariri-verde-claro text-cariri-verde-escuro" : "text-cariri-preto/85"
              }`
            : `relative px-5 py-2.5 text-[15px] font-semibold ${
                ativo ? "text-cariri-verde-escuro" : "text-cariri-preto/70 hover:text-cariri-preto"
              }`
        }
      >
        {item.label}
        {!noMobile && (
          <span
            className={`absolute left-5 right-5 -bottom-[1px] h-[2.5px] rounded-full bg-cariri-verde ${
              ativo ? "scale-x-100" : "scale-x-0"
            }`}
          />
        )}
      </Link>
    );
  }

  if (noMobile) {
    return (
      <div className="flex flex-col">
        <Link
          href={item.href || "/"}
          onClick={onClick}
          className={`px-4 py-3.5 rounded-lg text-[15px] font-medium ${
            ativo ? "bg-cariri-verde-claro text-cariri-verde-escuro" : "text-cariri-preto/85"
          }`}
        >
          {item.label}
        </Link>
        <div className="pl-4 pb-2 flex flex-col">
          {item.filhos.map((filho) => (
            <Link
              key={filho.id || filho.href}
              href={filho.href}
              onClick={onClick}
              className="px-3 py-2 text-sm text-cariri-cinza-texto hover:text-cariri-verde"
            >
              {filho.label}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      <Link
        href={item.href || "/"}
        aria-current={ativo ? "page" : undefined}
        className={`relative px-5 py-2.5 text-[15px] font-semibold inline-flex items-center gap-1 ${
          ativo ? "text-cariri-verde-escuro" : "text-cariri-preto/70 hover:text-cariri-preto"
        }`}
      >
        {item.label}
        <span className="text-[10px] opacity-60">▾</span>
      </Link>
      <div className="absolute left-0 top-full hidden group-hover:block min-w-[220px] bg-white border border-cariri-verde-claro rounded-lg shadow-lg py-2 z-50">
        {item.filhos.map((filho) => (
          <Link
            key={filho.id || filho.href}
            href={filho.href}
            className="block px-4 py-2 text-sm text-cariri-preto/80 hover:bg-cariri-verde-claro hover:text-cariri-verde-escuro"
          >
            {filho.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Header({ config, menu, aparencia }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuAberto, setMenuAberto] = useState(false);
  const [comSombra, setComSombra] = useState(false);
  const [termoBusca, setTermoBusca] = useState("");

  const itens = menu?.length ? menu : MENU_PADRAO;
  const logo = aparencia?.logoUrl || "/logo.png";

  useEffect(() => {
    function aoRolar() {
      setComSombra(window.scrollY > 8);
    }
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuAberto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuAberto]);

  useEffect(() => {
    setMenuAberto(false);
  }, [pathname]);

  function aoBuscar(e) {
    e.preventDefault();
    if (termoBusca.trim().length < 2) return;
    router.push(`/busca?q=${encodeURIComponent(termoBusca.trim())}`);
  }

  const redesSociais = [
    { tipo: "instagram", url: config?.instagramUrl },
    { tipo: "facebook", url: config?.facebookUrl },
    { tipo: "x", url: config?.twitterUrl },
  ].filter((r) => r.url);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header
      className={`sticky top-0 z-40 w-full bg-white transition-shadow duration-200 ${
        comSombra ? "shadow-[0_8px_20px_-14px_rgba(18,19,15,0.35)]" : ""
      }`}
    >
      <div className="max-w-content mx-auto px-5 h-[4.5rem] sm:h-24 grid grid-cols-3 items-center">
        <div className="hidden md:flex">
          <form
            onSubmit={aoBuscar}
            className="flex items-center bg-cariri-verde-claro rounded-full pl-4 pr-1.5 py-1.5 w-fit focus-within:ring-2 focus-within:ring-cariri-verde/40"
          >
            <input
              type="search"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              placeholder="Buscar..."
              className="w-32 lg:w-44 text-sm text-cariri-preto placeholder:text-cariri-cinza-texto outline-none bg-transparent"
            />
            <button
              type="submit"
              aria-label="Buscar"
              className="w-8 h-8 flex items-center justify-center rounded-full text-white bg-cariri-verde hover:bg-cariri-verde-escuro transition-colors shrink-0"
            >
              <IconeLupa width="16" height="16" />
            </button>
          </form>
        </div>

        <button
          onClick={() => setMenuAberto(true)}
          aria-label="Abrir menu"
          className="md:hidden w-11 h-11 flex flex-col items-center justify-center gap-[6px] justify-self-start"
        >
          <span className="block w-6 h-[2.5px] bg-cariri-preto rounded-full" />
          <span className="block w-6 h-[2.5px] bg-cariri-preto rounded-full" />
          <span className="block w-4 h-[2.5px] self-end mr-[3px] bg-cariri-preto rounded-full" />
        </button>

        <Link href="/" className="flex items-center justify-center col-start-2">
          {logo.startsWith("http") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt="Ponto Cariri" className="h-14 sm:h-20 w-auto object-contain" />
          ) : (
            <Image
              src={logo}
              alt="Ponto Cariri"
              width={600}
              height={203}
              priority
              className="h-14 sm:h-20 w-auto object-contain"
            />
          )}
        </Link>

        <div className="flex items-center justify-end gap-2 col-start-3">
          {redesSociais.map((r) => (
            <a
              key={r.tipo}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={r.tipo}
              className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full border border-cariri-verde-claro text-cariri-verde hover:bg-cariri-verde-claro transition-colors"
            >
              <IconeRedeSocial tipo={r.tipo} />
            </a>
          ))}
          <Link
            href="/busca"
            aria-label="Buscar"
            className="md:hidden w-11 h-11 flex items-center justify-center text-cariri-preto"
          >
            <IconeLupa width="21" height="21" />
          </Link>
        </div>
      </div>

      <nav
        aria-label="Navegação principal"
        className="hidden md:flex items-center justify-center gap-1 bg-cariri-verde-claro border-y border-cariri-preto/5 py-1"
      >
        {itens.map((item) => (
          <ItemMenu key={item.id || item.href} item={item} pathname={pathname} />
        ))}
      </nav>

      <div
        className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          menuAberto ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!menuAberto}
      >
        <div className="absolute inset-0 bg-cariri-preto/40" onClick={() => setMenuAberto(false)} />
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo} alt="Ponto Cariri" className="h-9 w-auto" />
            </span>
            <button
              onClick={() => setMenuAberto(false)}
              aria-label="Fechar menu"
              className="w-9 h-9 flex items-center justify-center text-2xl leading-none text-cariri-cinza-texto"
            >
              ×
            </button>
          </div>

          <form
            onSubmit={aoBuscar}
            className="mx-3 mt-3 flex items-center bg-cariri-verde-claro rounded-full pl-4 pr-1.5 py-1.5"
          >
            <input
              type="search"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              placeholder="Buscar..."
              className="w-full text-sm text-cariri-preto placeholder:text-cariri-cinza-texto outline-none bg-transparent"
            />
            <button
              type="submit"
              aria-label="Buscar"
              className="w-8 h-8 flex items-center justify-center rounded-full text-white bg-cariri-verde shrink-0"
            >
              <IconeLupa />
            </button>
          </form>

          <nav aria-label="Navegação principal (celular)" className="px-3 py-3 flex flex-col overflow-y-auto">
            {itens.map((item) => (
              <ItemMenu
                key={item.id || item.href}
                item={item}
                pathname={pathname}
                noMobile
                onClick={() => setMenuAberto(false)}
              />
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
