"use client";

import { useState } from "react";

export default function DoacaoBotao({ chavePix, mensagem }) {
  const [aberto, setAberto] = useState(false);
  const [copiado, setCopiado] = useState(false);

  async function copiarChave() {
    try {
      await navigator.clipboard.writeText(chavePix);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch (erro) {
      setCopiado(false);
    }
  }

  // Gera a imagem do QR Code a partir do "payload" Pix, usando um serviço
  // gratuito de geração de QR Code (não requer nenhuma biblioteca instalada).
  const urlQrCode = `/api/pix-qrcode?chave=${encodeURIComponent(chavePix)}`;

  return (
    <>
      <button
        onClick={() => setAberto(true)}
        className="fixed bottom-5 right-5 z-50 bg-cariri-verde text-white text-sm font-semibold px-5 py-3 rounded-full shadow-lg hover:bg-cariri-verde-escuro transition-colors"
      >
        💚 Apoie o Ponto Cariri
      </button>

      {aberto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Fazer uma doação via Pix"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setAberto(false)}
        >
          <div
            className="bg-white rounded-xl max-w-sm w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setAberto(false)}
              aria-label="Fechar"
              className="absolute top-3 right-3 text-cariri-cinza-texto hover:text-cariri-preto text-xl leading-none"
            >
              ×
            </button>

            <h2 className="text-lg font-bold text-cariri-preto">
              Faça uma doação
            </h2>
            <p className="mt-2 text-sm text-cariri-cinza-texto leading-relaxed">
              {mensagem}
            </p>

            <div className="mt-4 flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={urlQrCode}
                alt="QR Code Pix para doação"
                width={220}
                height={220}
                className="rounded-md border border-cariri-verde-claro"
              />
            </div>

            <div className="mt-4">
              <p className="text-xs font-medium text-cariri-cinza-texto uppercase tracking-wide">
                Chave Pix
              </p>
              <div className="mt-1 flex items-center gap-2">
                <code className="flex-1 text-sm bg-cariri-verde-claro rounded-md px-3 py-2 text-cariri-preto break-all">
                  {chavePix}
                </code>
                <button
                  onClick={copiarChave}
                  className="text-sm font-semibold text-white bg-cariri-verde px-3 py-2 rounded-md hover:bg-cariri-verde-escuro transition-colors whitespace-nowrap"
                >
                  {copiado ? "Copiado!" : "Copiar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
