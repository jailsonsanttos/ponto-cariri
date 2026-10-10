"use client";

import { useState } from "react";
import { upload } from "@vercel/blob/client";

export default function UploadCampo({ label = "Arquivo", tipoAceito = "image/*", onEnviar, ajuda = "Formatos permitidos conforme o campo." }) {
  const [enviando, setEnviando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [erro, setErro] = useState("");

  async function aoSelecionarArquivo(e) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;

    setEnviando(true);
    setProgresso(0);
    setErro("");

    try {
      const nome = `${Date.now()}-${arquivo.name}`;
      const resultado = await upload(nome, arquivo, {
        access: "public",
        contentType: arquivo.type || undefined,
        handleUploadUrl: "/api/upload",
        multipart: arquivo.size > 4 * 1024 * 1024,
        onUploadProgress: ({ loaded, total }) => {
          if (total) setProgresso(Math.round((loaded / total) * 100));
        },
      });
      if (!resultado?.url) throw new Error("O servidor não retornou a URL do arquivo.");
      onEnviar(resultado.url);
      setProgresso(100);
    } catch (erroUpload) {
      let mensagem = erroUpload?.message || "Não foi possível enviar o arquivo.";
      if (/entity too large|request entity|413/i.test(mensagem)) {
        mensagem = "Este arquivo ultrapassou o limite da plataforma. Tente um arquivo menor ou comprima o áudio antes de enviar.";
      }
      setErro(mensagem);
    } finally {
      setEnviando(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      {label && <label className="mb-1 block text-sm font-medium text-cariri-preto">{label}</label>}
      <input type="file" accept={tipoAceito} onChange={aoSelecionarArquivo} disabled={enviando} className="text-sm disabled:cursor-wait disabled:opacity-60" />
      {ajuda && !enviando && <p className="mt-1 text-xs text-cariri-cinza-texto">{ajuda}</p>}
      {enviando && <p className="mt-1 text-xs font-medium text-cariri-verde">Enviando arquivo diretamente para a biblioteca… {progresso}%</p>}
      {erro && <p className="mt-1 text-xs text-red-600">{erro}</p>}
    </div>
  );
}
