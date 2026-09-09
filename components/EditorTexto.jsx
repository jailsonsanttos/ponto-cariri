"use client";

// components/EditorTexto.jsx
// Editor de texto rico simples para o painel de administração, sem
// depender de nenhuma biblioteca externa. Permite negrito, itálico,
// links, listas e títulos. O conteúdo é salvo em formato HTML.

import { useEffect, useRef } from "react";

const BOTOES = [
  { comando: "bold", label: "N", titulo: "Negrito", estilo: "font-bold" },
  { comando: "italic", label: "I", titulo: "Itálico", estilo: "italic" },
  { comando: "insertUnorderedList", label: "•", titulo: "Lista" },
  { comando: "formatBlock", valor: "h2", label: "H2", titulo: "Título" },
  { comando: "formatBlock", valor: "p", label: "P", titulo: "Parágrafo normal" },
];

export default function EditorTexto({ value, onChange, placeholder }) {
  const editorRef = useRef(null);

  // Define o conteúdo inicial uma única vez, quando o editor é montado.
  // O componente pai força um "remount" (via prop key) sempre que o
  // usuário troca de notícia para editar, então isso é seguro.
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value || "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function executarComando(comando, valor) {
    editorRef.current.focus();
    document.execCommand(comando, false, valor);
    onChange(editorRef.current.innerHTML);
  }

  function inserirLink() {
    const url = window.prompt("Cole o link (ex: https://...)");
    if (url) executarComando("createLink", url);
  }

  return (
    <div className="border border-cariri-verde-claro rounded-md overflow-hidden">
      <div className="flex flex-wrap gap-1 border-b border-cariri-verde-claro bg-cariri-verde-claro/40 p-2">
        {BOTOES.map((botao) => (
          <button
            key={botao.titulo}
            type="button"
            title={botao.titulo}
            onClick={() => executarComando(botao.comando, botao.valor)}
            className={`w-8 h-8 rounded-md text-sm bg-white border border-cariri-verde-claro hover:border-cariri-verde ${botao.estilo || ""}`}
          >
            {botao.label}
          </button>
        ))}
        <button
          type="button"
          title="Inserir link"
          onClick={inserirLink}
          className="w-8 h-8 rounded-md text-sm bg-white border border-cariri-verde-claro hover:border-cariri-verde"
        >
          🔗
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        data-placeholder={placeholder}
        className="prose-noticia min-h-[220px] p-4 text-sm text-cariri-preto outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-cariri-cinza-texto"
      />
    </div>
  );
}
