// lib/midia.js
// Funções auxiliares para lidar com links de vídeo (YouTube) no "book"
// de mídias de cada município.

export function idDoYoutube(url) {
  if (!url) return null;
  const padroes = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const padrao of padroes) {
    const encontrado = url.match(padrao);
    if (encontrado) return encontrado[1];
  }
  return null;
}
