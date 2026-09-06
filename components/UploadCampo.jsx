"use client";

import { useState } from "react";

export default function UploadCampo({ label = "Imagem", onEnviar }) {
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
      if (resposta.ok) {
        onEnviar(dados.url);
      } else {
        setErro(dados.erro || "Erro ao enviar imagem.");
      }
    } catch {
      setErro("Erro ao enviar imagem.");
    } finally {
      setEnviando(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-cariri-preto mb-1">{label}</label>
      <input
        type="file"
        accept="image/*"
        onChange={aoSelecionarArquivo}
        className="text-sm"
      />
      {enviando && <p className="text-xs text-cariri-cinza-texto mt-1">Enviando…</p>}
      {erro && <p className="text-xs text-red-600 mt-1">{erro}</p>}
    </div>
  );
}
