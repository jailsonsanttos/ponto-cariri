/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta oficial do Ponto Cariri: branco, verde e preto
        cariri: {
          verde: "var(--cariri-verde, #2F8062)",
          "verde-escuro": "var(--cariri-verde-escuro, #174A3A)",
          "verde-claro": "var(--cariri-verde-claro, #E3EFE8)",
          preto: "var(--cariri-preto, #1E2925)",
          branco: "#FFFFFF",
          "cinza-texto": "var(--cariri-texto-secundario, #68736C)",
          laranja: "var(--cariri-laranja, #C96F45)",
          areia: "var(--cariri-areia, #F5F0E6)",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      maxWidth: {
        content: "1180px",
      },
    },
  },
  plugins: [],
};
