"use client";

import { useEffect, useRef, useState } from "react";

// Botão "Ouvir notícia": usa a função de voz já embutida no navegador
// (Web Speech API), sem precisar de nenhum serviço externo pago.
export default function OuvirNoticia({ titulo, texto }) {
  const [lendo, setLendo] = useState(false);
  const [suportado, setSuportado] = useState(true);
  const utteranceRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setSuportado(false);
    }
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  function alternar() {
    const synth = window.speechSynthesis;

    if (lendo) {
      synth.cancel();
      setLendo(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(`${titulo}. ${texto}`);
    utterance.lang = "pt-BR";
    utterance.rate = 1;
    utterance.onend = () => setLendo(false);
    utterance.onerror = () => setLendo(false);
    utteranceRef.current = utterance;

    synth.cancel();
    synth.speak(utterance);
    setLendo(true);
  }

  if (!suportado) return null;

  return (
    <button
      onClick={alternar}
      className="inline-flex items-center gap-2 text-sm font-semibold text-cariri-verde-escuro bg-cariri-verde-claro hover:bg-cariri-verde-claro/70 transition-colors px-4 py-2 rounded-full"
    >
      {lendo ? (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="5" width="4" height="14" />
            <rect x="14" y="5" width="4" height="14" />
          </svg>
          Parar
        </>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
          Ouvir notícia
        </>
      )}
    </button>
  );
}
