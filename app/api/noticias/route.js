import { NextResponse } from "next/server";
import { listarNoticias, criarNoticia, buscarNoticia } from "@/lib/db";
import { gerarSlug } from "@/lib/data";
import { exigirAdmin } from "@/lib/auth";

// Evita que o Next.js tente pré-gerar esta rota durante o "build";
// ela precisa ser executada sempre na hora (usa o banco de dados).
export const dynamic = "force-dynamic";

export async function GET() {
  const noticias = await listarNoticias();
  return NextResponse.json(noticias);
}

export async function POST(request) {
  if (!(await exigirAdmin(request))) {
    return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  }

  const dados = await request.json();

  let slug = gerarSlug(dados.titulo);
  let sufixo = 1;
  const slugOriginal = slug;
  while (await buscarNoticia(slug)) {
    slug = `${slugOriginal}-${sufixo}`;
    sufixo++;
  }

  const nova = await criarNoticia(slug, dados);
  return NextResponse.json(nova, { status: 201 });
}
