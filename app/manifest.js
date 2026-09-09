// app/manifest.js
// Gera automaticamente o arquivo manifest.webmanifest, que permite às
// pessoas "instalarem" o Ponto Cariri na tela inicial do celular, como
// se fosse um aplicativo.

export default function manifest() {
  return {
    name: "Ponto Cariri",
    short_name: "Ponto Cariri",
    description:
      "Notícias, municípios, previsão do tempo e comércio local da região do Cariri cearense.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#1B7A43",
    icons: [
      { src: "/icon", sizes: "192x192", type: "image/png" },
      { src: "/icon-512", sizes: "512x512", type: "image/png" },
    ],
  };
}
