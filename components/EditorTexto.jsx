"use client";

// Editor de texto rico simples para o painel de administração, sem
// depender de nenhuma biblioteca externa. Permite formatação básica,
// links e inserção de imagens no ponto escolhido do texto.

import { useRef, useState } from "react";

const BOTOES = [
  { comando: "bold", label: "N", titulo: "Negrito", estilo: "font-bold" },
  { comando: "italic", label: "I", titulo: "Itálico", estilo: "italic" },
  { comando: "insertUnorderedList", label: "•", titulo: "Lista" },
  { comando: "formatBlock", valor: "h2", label: "H2", titulo: "Título" },
  { comando: "formatBlock", valor: "p", label: "P", titulo: "Parágrafo normal" },
];

function escaparAtributo(valor = "") {
  return valor
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export default function EditorTexto({ value, onChange, placeholder }) {
  const editorRef = useRef(null);
  const arquivoImagemRef = useRef(null);
  const selecaoRef = useRef(null);
  const [enviandoImagem, setEnviandoImagem] = useState(false);
  const [erroImagem, setErroImagem] = useState("");

  function guardarSelecao() {
    const selecao = window.getSelection();
    if (!selecao?.rangeCount || !editorRef.current?.contains(selecao.anchorNode)) return;
    selecaoRef.current = selecao.getRangeAt(0).cloneRange();
  }

  function restaurarSelecao() {
    if (!selecaoRef.current) {
      editorRef.current?.focus();
      return;
    }
    const selecao = window.getSelection();
    selecao.removeAllRanges();
    selecao.addRange(selecaoRef.current);
    editorRef.current?.focus();
  }

  function executarComando(comando, valor) {
    editorRef.current.focus();
    document.execCommand(comando, false, valor);
    onChange(editorRef.current.innerHTML);
  }

  function inserirLink() {
    const url = window.prompt("Cole o link (ex: https://...)");
    if (url) executarComando("createLink", url);
  }

  function abrirUploadImagem() {
    guardarSelecao();
    setErroImagem("");
    arquivoImagemRef.current?.click();
  }

  async function enviarImagem(e) {
    const arquivo = e.target.files?.[0];
    e.target.value = "";
    if (!arquivo) return;

    setEnviandoImagem(true);
    setErroImagem("");
    const formData = new FormData();
    formData.append("arquivo", arquivo);

    try {
      const resposta = await fetch("/api/upload", { method: "POST", body: formData });
      const dados = await resposta.json();
      if (!resposta.ok || !dados.url) throw new Error(dados.erro || "Não foi possível enviar a imagem.");

      restaurarSelecao();
      const url = escaparAtributo(dados.url);
      const alt = escaparAtributo(arquivo.name.replace(/\.[^.]+$/, ""));
      document.execCommand(
        "insertHTML",
        false,
        `<p class="imagem-no-texto"><img src="${url}" alt="${alt}" /></p>`,
      );
      onChange(editorRef.current.innerHTML);
    } catch (erro) {
      setErroImagem(erro.message || "Erro ao enviar imagem.");
    } finally {
      setEnviandoImagem(false);
    }
  }

  return (
    <div className="border border-cariri-verde-claro rounded-md overflow-hidden">
      <div className="flex flex-wrap gap-1 border-b border-cariri-verde-claro bg-cariri-verde-claro/40 p-2">
        {BOTOES.map((botao) => (
          <button
            key={botao.titulo}
            type="button"
            title={botao.titulo}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executarComando(botao.comando, botao.valor)}
            className={`w-8 h-8 rounded-md text-sm bg-white border border-cariri-verde-claro hover:border-cariri-verde ${botao.estilo || ""}`}
          >
            {botao.label}
          </button>
        ))}
        <button
          type="button"
          title="Inserir link"
          onMouseDown={(e) => e.preventDefault()}
          onClick={inserirLink}
          className="w-8 h-8 rounded-md text-sm bg-white border border-cariri-verde-claro hover:border-cariri-verde"
        >
          🔗
        </button>
        <button
          type="button"
          title="Enviar e inserir imagem no ponto selecionado"
          onMouseDown={(e) => e.preventDefault()}
          onClick={abrirUploadImagem}
          className="h-8 rounded-md px-2 text-xs bg-white border border-cariri-verde-claro hover:border-cariri-verde"
        >
          Imagem no texto
        </button>
        <input
          ref={arquivoImagemRef}
          type="file"
          accept="image/*"
          onChange={enviarImagem}
          className="hidden"
        />
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        onKeyUp={guardarSelecao}
        onMouseUp={guardarSelecao}
        data-placeholder={placeholder}
        className="prose-noticia min-h-[220px] p-4 text-sm text-cariri-preto outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-cariri-cinza-texto"
        dangerouslySetInnerHTML={{ __html: value || "" }}
      />
      {enviandoImagem && <p className="px-3 pb-2 text-xs text-cariri-cinza-texto">Enviando imagem…</p>}
      {erroImagem && <p className="px-3 pb-2 text-xs text-red-600">{erroImagem}</p>}
      <p className="border-t border-cariri-verde-claro px-3 py-2 text-xs text-cariri-cinza-texto">
        Para colocar a imagem no meio do texto, clique no ponto desejado e use “Imagem no texto”.
      </p>
    </div>
  );
}
