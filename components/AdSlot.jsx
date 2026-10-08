"use client";

// components/AdSlot.jsx
// Espaço reutilizável para anúncios do Google AdSense.
// O cliente e o bloco podem ser substituídos por variáveis de ambiente,
// mas já têm os valores aprovados para este site como fallback.

import { useEffect } from "react";

export default function AdSlot({ label = "Espaço publicitário" }) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-5549752585345376";
  const slotId = process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID || "5890880600";

  useEffect(() => {
    if (!clientId) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (erro) {
      // Silencioso: em ambiente de teste/local o AdSense pode não carregar.
    }
  }, [clientId]);

  return (
    <ins
      className="adsbygoogle block"
      style={{ display: "block" }}
      data-ad-client={clientId}
      data-ad-slot={slotId}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
