import { NextResponse } from "next/server";
import { garantirSchema } from "@/lib/db";
import { validarAcessoConcurseiros, COOKIE_CONCURSEIROS } from "@/lib/concurseiros";
export const dynamic = "force-dynamic";
export async function POST(request) {
  try {
    await garantirSchema();
    const { email, codigo } = await request.json();
    const assinante = await validarAcessoConcurseiros(email, codigo);
    if (!assinante) return NextResponse.json({ erro: "E-mail ou código inválido, expirado ou ainda não aprovado." }, { status: 401 });
    const resposta = NextResponse.json({ ok: true });
    resposta.cookies.set(COOKIE_CONCURSEIROS, String(codigo).trim().toUpperCase(), { httpOnly: true, sameSite: "lax", secure: true, path: "/", maxAge: 60 * 60 * 24 * 30 });
    return resposta;
  } catch (erro) {
    return NextResponse.json({ erro: erro.message || "Não foi possível entrar." }, { status: 400 });
  }
}
