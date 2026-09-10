// app/api/pix-qrcode/route.js
// Gera o QR Code de doação a partir da chave Pix, montando o "payload"
// oficial (Banco Central) e usando um serviço público gratuito de imagem
// de QR Code — assim não é necessário instalar nenhuma biblioteca extra.

import { NextResponse } from "next/server";
import { gerarPayloadPix } from "@/lib/pix";
import { buscarConfig } from "@/lib/db";
import { unstable_noStore as noStore } from "next/cache";

// Evita que o Next.js tente pré-gerar esta rota durante o "build";
// ela precisa ser executada sempre na hora (usa o banco de dados).
export const dynamic = "force-dynamic";

export async function GET(request) {
  noStore();

  const { searchParams } = new URL(request.url);
  const config = await buscarConfig();
  const chave = searchParams.get("chave") || config.chavePix;

  const payload = gerarPayloadPix({
    chave,
    nomeRecebedor: config.responsavel || "PONTO CARIRI",
    descricao: "Doacao Ponto Cariri",
  });

  const urlImagem = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    payload
  )}`;

  return NextResponse.redirect(urlImagem);
}
