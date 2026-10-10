"use client";

import { useState } from "react";

// tipoAceito: string do atributo "accept" do input (ex: "image/*",
// "audio/*,video/*"). Deixa o mesmo componente servir pra fotos, hinos
// em áudio/vídeo, ou qualquer outro tipo de arquivo.
export default function UploadCampo({ label = "Arquivo", tipoAceito = "image/*", onEnviar, ajuda = "Formatos permitidos conforme o campo." }) {
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  async function aoSelecionarArquivo(e) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;

    setEnviando(true);
    setErro("");

    const formData = new FormData();
    formData.append("arquivo", arquivo);

    try {
      const resposta = await fetch("/api/upload", { method: "POST", body: formData });
      const dados = await resposta.json();
      if (resposta.ok && dados.url) {
        onEnviar(dados.url);
      } else {
        setErro(dados.erro || "O servidor não retornou o arquivo enviado.");
      }
    } catch (erro) {
      setErro(erro?.message || "Não foi possível enviar o arquivo. Tente novamente.");
    } finally {
      setEnviando(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      {label && <label className="block text-sm font-medium text-cariri-preto mb-1">{label}</label>}
      <input
        type="file"
        accept={tipoAceito}
        onChange={aoSelecionarArquivo}
        className="text-sm"
      />
      {ajuda && !enviando && <p className="mt-1 text-xs text-cariri-cinza-texto">{ajuda}</p>}
      {enviando && <p className="mt-1 text-xs font-medium text-cariri-verde">Enviando… aguarde a confirmação.</p>}
      {erro && <p className="text-xs text-red-600 mt-1">{erro}</p>}
    </div>
  );
}
