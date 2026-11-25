import { NextResponse } from "next/server";
import { garantirSchema } from "@/lib/db";
import { solicitarAcesso } from "@/lib/concurseiros";
export const dynamic = "force-dynamic";
export async function POST(request) {
  try {
    await garantirSchema();
    const dados = await request.json();
    await solicitarAcesso(dados);
    return NextResponse.json({ ok: true, mensagem: "Solicitação enviada. Após a confirmação do Pix, você receberá o código de acesso." });
  } catch (erro) {
    return NextResponse.json({ erro: erro.message || "Não foi possível enviar a solicitação." }, { status: 400 });
  }
}
