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
          verde: "#1B7A43",       // verde principal (serra/mata)
          "verde-escuro": "#124F2C",
          "verde-claro": "#E7F4EC",
          preto: "#12130F",
          branco: "#FFFFFF",
          "cinza-texto": "#4A4E48",
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
