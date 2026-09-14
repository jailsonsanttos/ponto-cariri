"use client";

import { useState } from "react";

// Botões circulares de compartilhamento, no estilo dos grandes portais
// de notícias: um ícone colorido por rede, lado a lado.
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

  const redes = [
    {
      nome: "WhatsApp",
      cor: "#25D366",
      href: `https://wa.me/?text=${encodeURIComponent(`${textoCompartilhado} ${urlAtual}`)}`,
      icone: (
        <path d="M17.5 14.4c-.3-.1-1.7-.8-2-1-.3-.1-.5-.1-.6.1-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.3-.5.1-.2 0-.4 0-.5C10.2 9 9.7 7.8 9.5 7.3c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3 4.8 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.4Z" />
      ),
    },
    {
      nome: "Facebook",
      cor: "#1877F2",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlAtual)}`,
      icone: <path d="M13.5 21v-7.5H16l.5-3H13.5V8.2c0-.87.24-1.46 1.5-1.46H16.6V4.14C16.3 4.1 15.3 4 14.1 4c-2.4 0-4 1.46-4 4.14V10.5H7.5v3H10V21h3.5Z" />,
    },
    {
      nome: "X",
      cor: "#000000",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(textoCompartilhado)}&url=${encodeURIComponent(urlAtual)}`,
      icone: <path d="M18.9 2H22l-7.6 8.7L23 22h-6.9l-5.4-6.6L4.5 22H1.4l8.1-9.3L1 2h7l4.9 6.1L18.9 2Zm-1.2 18h1.9L7.4 4H5.4l12.3 16Z" />,
    },
    {
      nome: "Telegram",
      cor: "#26A5E4",
      href: `https://t.me/share/url?url=${encodeURIComponent(urlAtual)}&text=${encodeURIComponent(textoCompartilhado)}`,
      icone: <path d="M21.5 3.5 2.7 10.9c-1 .4-1 1.7.1 2l4.6 1.5 1.8 5.6c.2.7 1 .9 1.6.4l2.6-2.3 4.6 3.4c.8.6 1.9.2 2.1-.8l3-14.4c.2-1-1-1.8-1.7-1.4ZM8.7 14.1l9.3-6.9c.3-.2.6.2.3.4l-7.7 7.3c-.3.3-.5.7-.5 1.1l-.2 2.5-1.2-4.4Z" />,
    },
  ];

  return (
    <div>
      <p className="text-sm font-semibold text-cariri-preto mb-3">
        Compartilhar
      </p>
      <div className="flex flex-wrap items-center gap-2.5">
        {redes.map((rede) => (
          <a
            key={rede.nome}
            href={rede.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Compartilhar no ${rede.nome}`}
            title={rede.nome}
            className="w-10 h-10 flex items-center justify-center rounded-full text-white hover:opacity-85 transition-opacity"
            style={{ backgroundColor: rede.cor }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              {rede.icone}
            </svg>
          </a>
        ))}
        <button
          onClick={copiarLink}
          aria-label="Copiar link"
          title={copiado ? "Link copiado!" : "Copiar link"}
          className="w-10 h-10 flex items-center justify-center rounded-full text-white bg-cariri-verde hover:opacity-85 transition-opacity"
        >
          {copiado ? (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 13a5 5 0 0 0 7.07 0l1.42-1.42a5 5 0 0 0-7.07-7.07L10 6" />
              <path d="M14 11a5 5 0 0 0-7.07 0l-1.42 1.42a5 5 0 0 0 7.07 7.07L14 18" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
