// app/api/admin/login/route.js
import { NextResponse } from "next/server";
import { validarCredenciais, gerarTokenSessao, NOME_COOKIE_SESSAO } from "@/lib/auth";

export async function POST(request) {
  const { usuario, senha } = await request.json();

  if (!validarCredenciais(usuario, senha)) {
    return NextResponse.json(
      { erro: "Usuário ou senha incorretos." },
      { status: 401 }
    );
  }

  const resposta = NextResponse.json({ ok: true });
  resposta.cookies.set(NOME_COOKIE_SESSAO, await gerarTokenSessao(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12, // 12 horas
  });
  return resposta;
}
