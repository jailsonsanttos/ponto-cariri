import { NextResponse } from "next/server";
import { listarMunicipios, criarMunicipio, buscarMunicipio } from "@/lib/db";
import { gerarSlug } from "@/lib/data";
import { exigirAdmin } from "@/lib/auth";

// Evita que o Next.js tente pré-gerar esta rota durante o "build";
// ela precisa ser executada sempre na hora (usa o banco de dados).
export const dynamic = "force-dynamic";

export async function GET() {
  const municipios = await listarMunicipios();
  return NextResponse.json(municipios);
}

export async function POST(request) {
  if (!(await exigirAdmin(request))) {
    return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  }

  const dados = await request.json();
  const slug = gerarSlug(dados.nome);

  const existente = await buscarMunicipio(slug);
  if (existente) {
    return NextResponse.json(
      { erro: "Já existe um município com esse nome." },
      { status: 400 }
    );
  }

  const novo = await criarMunicipio(slug, dados);
  return NextResponse.json(novo, { status: 201 });
}
