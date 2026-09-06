import { NextResponse } from "next/server";
import { buscarConfig, atualizarConfig } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";

// Evita que o Next.js tente pré-gerar esta rota durante o "build";
// ela precisa ser executada sempre na hora (usa o banco de dados).
export const dynamic = "force-dynamic";

export async function GET() {
  const config = await buscarConfig();
  return NextResponse.json(config);
}

export async function PUT(request) {
  if (!(await exigirAdmin(request))) {
    return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  }

  const dados = await request.json();
  const atual = await buscarConfig();
  const novoConfig = await atualizarConfig({ ...atual, ...dados });

  return NextResponse.json(novoConfig);
}
