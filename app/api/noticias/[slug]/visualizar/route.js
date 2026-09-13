import { NextResponse } from "next/server";
import { incrementarVisualizacao } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request, { params }) {
  await incrementarVisualizacao(params.slug);
  return NextResponse.json({ ok: true });
}
