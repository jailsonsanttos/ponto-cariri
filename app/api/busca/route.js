import { NextResponse } from "next/server";
import { buscar } from "@/lib/db";
import { unstable_noStore as noStore } from "next/cache";

// Evita que o Next.js tente pré-gerar esta rota durante o "build";
// ela precisa ser executada sempre na hora (usa o banco de dados).
export const dynamic = "force-dynamic";

export async function GET(request) {
  noStore();

  const { searchParams } = new URL(request.url);
  const termo = (searchParams.get("q") || "").trim();

  if (termo.length < 2) {
    return NextResponse.json({ municipios: [], noticias: [] });
  }

  const resultado = await buscar(termo);
  return NextResponse.json(resultado);
}
