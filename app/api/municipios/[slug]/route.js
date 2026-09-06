import { NextResponse } from "next/server";
import { atualizarMunicipio, excluirMunicipio } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";

// Evita que o Next.js tente pré-gerar esta rota durante o "build";
// ela precisa ser executada sempre na hora (usa o banco de dados).
export const dynamic = "force-dynamic";

export async function PUT(request, { params }) {
  if (!(await exigirAdmin(request))) {
    return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  }

  const dados = await request.json();
  const atualizado = await atualizarMunicipio(params.slug, dados);

  if (!atualizado) {
    return NextResponse.json({ erro: "Município não encontrado." }, { status: 404 });
  }

  return NextResponse.json(atualizado);
}

export async function DELETE(request, { params }) {
  if (!(await exigirAdmin(request))) {
    return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  }

  await excluirMunicipio(params.slug);
  return NextResponse.json({ ok: true });
}
