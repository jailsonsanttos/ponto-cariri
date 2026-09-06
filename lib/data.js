// lib/data.js
// Função auxiliar usada ao criar municípios, notícias e anúncios: transforma
// um texto (ex: nome do município) em um "slug" amigável para URLs.
// Ex: "Juazeiro do Norte" -> "juazeiro-do-norte"

export function gerarSlug(texto) {
  return texto
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
