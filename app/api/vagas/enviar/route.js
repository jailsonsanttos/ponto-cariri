import { NextResponse } from "next/server";
import { garantirSchema } from "@/lib/db";
import { criarSolicitacao } from "@/lib/vagas-solicitacoes";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const dados = await request.json();
    if (dados.website) return NextResponse.json({ ok: true });
    if (!dados.titulo || !dados.email || !dados.descricao || !dados.comoCandidatar) {
      return NextResponse.json({ erro: "Preencha título, e-mail, descrição e forma de candidatura." }, { status: 400 });
    }
    if (String(dados.titulo).length > 160 || String(dados.descricao).length > 10000) {
      return NextResponse.json({ erro: "Alguns campos ultrapassam o limite permitido." }, { status: 400 });
    }
    await garantirSchema();
    await criarSolicitacao(dados);
    return NextResponse.json({ ok: true });
  } catch (erro) {
    console.error("Falha ao receber indicação de vaga", erro);
    return NextResponse.json({ erro: "Não foi possível enviar agora. Tente novamente." }, { status: 500 });
  }
}
