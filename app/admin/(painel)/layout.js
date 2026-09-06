import Link from "next/link";
import LogoutBotao from "./LogoutBotao";

const itensMenu = [
  { href: "/admin", label: "Painel" },
  { href: "/admin/municipios", label: "Municípios" },
  { href: "/admin/noticias", label: "Notícias" },
  { href: "/admin/propaganda", label: "Propaganda" },
  { href: "/admin/config", label: "Configurações" },
];

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      <aside className="sm:w-56 bg-cariri-preto text-white shrink-0">
        <div className="p-5">
          <p className="font-bold">Ponto Cariri</p>
          <p className="text-xs text-white/60">Painel de administração</p>
        </div>
        <nav className="px-3 pb-5 flex sm:flex-col gap-1 flex-wrap">
          {itensMenu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 rounded-md text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-5 mt-4 sm:mt-auto sm:mb-5">
          <LogoutBotao />
        </div>
      </aside>

      <main className="flex-1 bg-white p-6">{children}</main>
    </div>
  );
}
