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
          verde: "var(--cariri-verde, #1B7A43)",
          "verde-escuro": "var(--cariri-verde-escuro, #124F2C)",
          "verde-claro": "var(--cariri-verde-claro, #E7F4EC)",
          preto: "var(--cariri-preto, #12130F)",
          branco: "#FFFFFF",
          "cinza-texto": "var(--cariri-texto-secundario, #4A4E48)",
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
