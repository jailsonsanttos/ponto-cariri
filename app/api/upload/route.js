// app/api/upload/route.js
// Recebe uma imagem enviada pelo painel de administração e salva no
// Vercel Blob (armazenamento de arquivos na nuvem), devolvendo a URL
// pública para ser usada no site. Diferente de salvar em pasta local,
// os arquivos aqui ficam permanentes, mesmo depois de um novo deploy.

import { NextResponse } from "next/server";
import { exigirAdmin } from "@/lib/auth";
import { put } from "@vercel/blob";

export async function POST(request) {
  if (!(await exigirAdmin(request))) {
    return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  }

  const formData = await request.formData();
  const arquivo = formData.get("arquivo");

  if (!arquivo) {
    return NextResponse.json({ erro: "Nenhum arquivo enviado." }, { status: 400 });
  }

  const nomeArquivo = `${Date.now()}-${arquivo.name}`;

  const resultado = await put(nomeArquivo, arquivo, {
    access: "public",
  });

  return NextResponse.json({ url: resultado.url });
}
