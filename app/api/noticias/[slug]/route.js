import { NextResponse } from "next/server";
import { atualizarNoticia, excluirNoticia } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";

// Evita que o Next.js tente pré-gerar esta rota durante o "build";
// ela precisa ser executada sempre na hora (usa o banco de dados).
export const dynamic = "force-dynamic";

export async function PUT(request, { params }) {
  if (!(await exigirAdmin(request))) {
    return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  }

  const dados = await request.json();
  const atualizado = await atualizarNoticia(params.slug, dados);

  if (!atualizado) {
    return NextResponse.json({ erro: "Notícia não encontrada." }, { status: 404 });
  }

  return NextResponse.json(atualizado);
}

export async function DELETE(request, { params }) {
  if (!(await exigirAdmin(request))) {
    return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  }

  await excluirNoticia(params.slug);
  return NextResponse.json({ ok: true });
}
