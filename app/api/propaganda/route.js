import { NextResponse } from "next/server";
import { listarPropagandas, criarPropaganda } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";

// Evita que o Next.js tente pré-gerar esta rota durante o "build";
// ela precisa ser executada sempre na hora (usa o banco de dados).
export const dynamic = "force-dynamic";

export async function GET() {
  const propagandas = await listarPropagandas();
  return NextResponse.json(propagandas);
}

export async function POST(request) {
  if (!(await exigirAdmin(request))) {
    return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  }

  const dados = await request.json();
  const id = Date.now().toString(36);
  const nova = await criarPropaganda(id, dados);

  return NextResponse.json(nova, { status: 201 });
}
