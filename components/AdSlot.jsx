"use client";

// components/AdSlot.jsx
// Espaço reutilizável para anúncios do Google AdSense.
// Basta configurar o NEXT_PUBLIC_ADSENSE_CLIENT_ID no arquivo .env.local
// (e na Vercel) — o script oficial já é carregado automaticamente pelo
// app/layout.js. Enquanto o AdSense não estiver configurado, mostra um
// espaço reservado no lugar do anúncio.

import { useEffect } from "react";

export default function AdSlot({ label = "Espaço publicitário" }) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  useEffect(() => {
    if (!clientId) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (erro) {
      // Silencioso: em ambiente de teste/local o AdSense pode não carregar.
    }
  }, [clientId]);

  if (!clientId) {
    return (
      <div className="w-full border border-dashed border-cariri-verde-claro rounded-md py-8 text-center text-xs text-cariri-cinza-texto">
        {label} — configure o Google AdSense em .env.local
      </div>
    );
  }

  return (
    <ins
      className="adsbygoogle block"
      style={{ display: "block" }}
      data-ad-client={clientId}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
