import { NextResponse } from "next/server";
import { exigirAdmin } from "@/lib/auth";
import { put } from "@vercel/blob";
import { validarArquivo, nomeSeguro } from "@/lib/upload";
import { criarMidia } from "@/lib/cms";
import { garantirSchema } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request) {
  if (!(await exigirAdmin(request))) {
    return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  }

  await garantirSchema();

  const formData = await request.formData();
  const arquivo = formData.get("arquivo");

  if (!arquivo || typeof arquivo === "string") {
    return NextResponse.json({ erro: "Nenhum arquivo enviado." }, { status: 400 });
  }

  const validacao = validarArquivo(arquivo);
  if (!validacao.ok) {
    return NextResponse.json({ erro: validacao.erro }, { status: 400 });
  }

  const nomeArquivo = nomeSeguro(arquivo.name);
  const resultado = await put(nomeArquivo, arquivo, {
    access: "public",
    contentType: arquivo.type || undefined,
    addRandomSuffix: false,
  });

  let item = null;
  try {
    item = await criarMidia({
      tipo: validacao.tipo,
      url: resultado.url,
      nome: arquivo.name,
      municipioSlug: formData.get("municipio") || "",
      alt: formData.get("alt") || "",
    });
  } catch {
    item = null;
  }

  return NextResponse.json({ url: resultado.url, tipo: validacao.tipo, midia: item });
}
