"use client";

import { useState } from "react";

export default function CompartilharBotoes({ titulo, slug }) {
  const [copiado, setCopiado] = useState(false);

  // Usa a URL atual do navegador (funciona tanto no domínio da Vercel
  // quanto em um domínio próprio, sem precisar configurar nada).
  const urlAtual =
    typeof window !== "undefined"
      ? window.location.href
      : `/noticias/${slug}`;

  const textoCompartilhado = `${titulo} - Ponto Cariri`;

  async function copiarLink() {
    try {
      await navigator.clipboard.writeText(urlAtual);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch (erro) {
      setCopiado(false);
    }
  }

  return (
    <div>
      <p className="text-sm font-semibold text-cariri-preto mb-3">
        Compartilhar
      </p>
      <div className="flex flex-wrap gap-2">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(`${textoCompartilhado} ${urlAtual}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-white bg-[#25D366] px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
        >
          WhatsApp
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlAtual)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-white bg-[#1877F2] px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
        >
          Facebook
        </a>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(textoCompartilhado)}&url=${encodeURIComponent(urlAtual)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-white bg-black px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
        >
          X / Twitter
        </a>
        <button
          onClick={copiarLink}
          className="inline-flex items-center gap-2 text-sm font-medium text-cariri-preto bg-cariri-verde-claro px-4 py-2 rounded-md hover:bg-cariri-verde-claro/70 transition-colors"
        >
          {copiado ? "Link copiado!" : "Copiar link"}
        </button>
      </div>
    </div>
  );
}
