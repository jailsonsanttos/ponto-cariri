"use client";

import { useEffect, useState } from "react";

const CHAVE_ARMAZENAMENTO = "ponto_cariri_cookies_aceitos";

export default function AvisoCookies() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const jaAceitou = localStorage.getItem(CHAVE_ARMAZENAMENTO);
    if (!jaAceitou) setVisivel(true);
  }, []);

  function aceitar() {
    localStorage.setItem(CHAVE_ARMAZENAMENTO, "sim");
    setVisivel(false);
  }

  if (!visivel) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[60] bg-cariri-verde-escuro text-white">
      <div className="max-w-content mx-auto px-5 py-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-white/85">
          Usamos cookies para melhorar sua experiência e exibir anúncios.
          Saiba mais na nossa{" "}
          <a href="/privacidade" className="underline font-medium">
            Política de Privacidade
          </a>
          .
        </p>
        <button
          onClick={aceitar}
          className="shrink-0 bg-white text-cariri-verde-escuro font-semibold text-sm px-4 py-2 rounded-md hover:bg-white/90 transition-colors"
        >
          Entendi
        </button>
      </div>
    </div>
  );
}
