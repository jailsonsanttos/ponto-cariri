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
      className="inline-flex items-center gap-2.5 text-[15px] font-semibold text-cariri-preto hover:text-cariri-verde transition-colors"
    >
      <span
        className={`w-9 h-9 flex items-center justify-center rounded-full text-white transition-colors ${
          lendo ? "bg-cariri-preto" : "bg-cariri-verde"
        }`}
      >
        {lendo ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="5" width="4" height="14" />
            <rect x="14" y="5" width="4" height="14" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </span>
      {lendo ? "Parar" : "Ouvir notícia"}
    </button>
  );
}
