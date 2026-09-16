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

// Identifica se um arquivo é áudio, vídeo, ou nenhum dos dois (link comum),
// pela extensão do arquivo — usado para o hino municipal, por exemplo.
export function tipoDeArquivo(url) {
  if (!url) return "link";
  const limpo = url.split("?")[0].toLowerCase();
  if (/\.(mp3|wav|ogg|m4a|aac)$/.test(limpo)) return "audio";
  if (/\.(mp4|webm|mov|m4v)$/.test(limpo)) return "video";
  return "link";
}
