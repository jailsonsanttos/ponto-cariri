import { NextResponse } from "next/server";
import { atualizarPropaganda, excluirPropaganda } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";

// Evita que o Next.js tente pré-gerar esta rota durante o "build";
// ela precisa ser executada sempre na hora (usa o banco de dados).
export const dynamic = "force-dynamic";

export async function PUT(request, { params }) {
  if (!(await exigirAdmin(request))) {
    return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  }

  const dados = await request.json();
  const atualizado = await atualizarPropaganda(params.id, dados);

  if (!atualizado) {
    return NextResponse.json({ erro: "Anúncio não encontrado." }, { status: 404 });
  }

  return NextResponse.json(atualizado);
}

export async function DELETE(request, { params }) {
  if (!(await exigirAdmin(request))) {
    return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  }

  await excluirPropaganda(params.id);
  return NextResponse.json({ ok: true });
}
