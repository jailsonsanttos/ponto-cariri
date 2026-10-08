export const LAYOUTS_GALERIA = [
  { valor: "grade", label: "Grade (meia largura)" },
  { valor: "largura-total", label: "Largura total" },
  { valor: "destaque", label: "Destaque grande" },
  { valor: "esquerda", label: "Alinhada à esquerda" },
  { valor: "direita", label: "Alinhada à direita" },
];

export function normalizarImagemGaleria(item) {
  if (typeof item === "string") {
    return { url: item, posicao: "center center", layout: "grade", alt: "", legenda: "" };
  }

  if (!item || typeof item !== "object" || !item.url) return null;

  return {
    url: item.url,
    posicao: item.posicao || item.objectPosition || "center center",
    layout: item.layout || "grade",
    alt: item.alt || "",
    legenda: item.legenda || "",
  };
}

export function normalizarGaleria(galeria) {
  if (!Array.isArray(galeria)) return [];
  return galeria.map(normalizarImagemGaleria).filter(Boolean);
}

export function classeLayoutGaleria(layout) {
  switch (layout) {
    case "largura-total":
    case "destaque":
      return "sm:col-span-2";
    case "esquerda":
      return "sm:col-span-2 md:col-span-1 md:mr-auto";
    case "direita":
      return "sm:col-span-2 md:col-span-1 md:ml-auto";
    default:
      return "sm:col-span-1";
  }
}

export function alturaGaleria(layout) {
  return layout === "destaque" ? "h-72 sm:h-[30rem]" : "h-52 sm:h-64";
}
