// middleware.js
// Protege todas as páginas dentro de /admin (exceto a página de login).
// Se o visitante não estiver logado, é redirecionado para /admin/login.
// É por causa deste arquivo que o painel de administração fica
// completamente invisível/inacessível para os clientes comuns do site.

import { NextResponse } from "next/server";
import { verificarSessao } from "@/lib/auth";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const ehLogin = pathname === "/admin/login";
  const ehAreaAdmin = pathname.startsWith("/admin");

  if (ehAreaAdmin && !ehLogin) {
    const logado = await verificarSessao(request);
    if (!logado) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
