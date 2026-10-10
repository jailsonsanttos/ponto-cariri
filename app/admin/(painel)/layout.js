"use client";

import Link from "next/link";
import LogoutBotao from "./LogoutBotao";
import { usePathname } from "next/navigation";

const itensMenu = [
  { href: "/admin", label: "Painel" },
  { href: "/admin/noticias", label: "Publicações" },
  { href: "/admin/midia", label: "Biblioteca" },
  { href: "/admin/municipios", label: "Municípios" },
  { href: "/admin/paginas", label: "Páginas" },
  { href: "/admin/menu", label: "Menu" },
  { href: "/admin/inicio", label: "Página inicial" },
  { href: "/admin/aparencia", label: "Aparência" },
  { href: "/admin/categorias", label: "Categorias" },
  { href: "/admin/precos", label: "Preços" },
  { href: "/admin/eventos", label: "Eventos" },
  { href: "/admin/propaganda", label: "Publicidade" },
  { href: "/admin/config", label: "Configurações" },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-slate-50 sm:flex">
      <aside className="shrink-0 bg-cariri-preto text-white sm:min-h-screen sm:w-64">
        <div className="border-b border-white/10 p-5">
          <p className="text-lg font-black">Ponto Cariri</p>
          <p className="mt-1 text-xs text-white/60">Painel de administração</p>
        </div>
        <nav className="flex flex-wrap gap-1 px-3 py-4 sm:flex-col">
          {itensMenu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2.5 text-sm transition-colors ${pathname === item.href || (item.href !== "/admin" && pathname.startsWith(`${item.href}/`)) ? "bg-cariri-verde text-white font-bold" : "text-white/75 hover:bg-white/10 hover:text-white"}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-2 px-5 pb-5 sm:mt-auto sm:pb-6">
          <LogoutBotao />
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-4 sm:p-8"><div className="mx-auto max-w-7xl">{children}</div></main>
    </div>
  );
}
