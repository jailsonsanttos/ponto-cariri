import { NextResponse } from "next/server";
import { handleUpload } from "@vercel/blob/client";
import { exigirAdmin } from "@/lib/auth";
import { criarMidia } from "@/lib/cms";
import { garantirSchema } from "@/lib/db";
import { extensaoDe, tipoDeUpload } from "@/lib/upload";

export const dynamic = "force-dynamic";

const TIPOS_PERMITIDOS = [
  "image/jpeg", "image/png", "image/webp",
  "video/mp4", "video/webm", "video/quicktime", "video/x-m4v",
  "audio/mpeg", "audio/wav", "audio/x-wav", "audio/wave", "audio/ogg", "application/ogg", "audio/mp4", "audio/x-m4a", "audio/aac",
  "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain", "text/csv",
];

export async function POST(request) {
  if (!(await exigirAdmin(request))) {
    return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  }

  await garantirSchema();

  try {
    const body = await request.json();
    const resposta = await handleUpload({
      token: process.env.BLOB_READ_WRITE_TOKEN,
      request,
      body,
      onBeforeGenerateToken: async (pathname, clientPayload, multipart) => {
        const ext = extensaoDe(pathname);
        const tiposAudio = ["mp3", "wav", "ogg", "oga", "m4a", "aac"];
        if (!ext || !tipoDeUpload({ name: pathname })) {
          throw new Error("Formato de arquivo não permitido.");
        }
        return {
          allowedContentTypes: TIPOS_PERMITIDOS,
          maximumSizeInBytes: 32 * 1024 * 1024,
          addRandomSuffix: false,
          tokenPayload: JSON.stringify({ nome: pathname, audio: tiposAudio.includes(ext), multipart: Boolean(multipart), clientPayload }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        const tipo = tipoDeUpload({ name: blob.pathname, type: blob.contentType, size: blob.size });
        if (!tipo) return;
        await criarMidia({
          tipo,
          url: blob.url,
          nome: tokenPayload ? JSON.parse(tokenPayload).nome : blob.pathname,
          municipioSlug: "",
          alt: "",
        }).catch(() => null);
      },
    });
    return NextResponse.json(resposta);
  } catch (erro) {
    console.error("Falha no upload:", erro);
    return NextResponse.json({ erro: erro?.message || "Não foi possível processar o upload." }, { status: 500 });
  }
}
