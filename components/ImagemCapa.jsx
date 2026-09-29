export default function ImagemCapa({
  src,
  alt = "",
  posicao = "center center",
  className = "",
  sizes,
  priority = false,
}) {
  if (!src) return <div className={`bg-cariri-verde-claro ${className}`} />;

  const estilo = { objectFit: "cover", objectPosition: posicao || "center center" };

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      sizes={sizes}
      className={`w-full h-full ${className}`}
      style={estilo}
      loading={priority ? "eager" : "lazy"}
    />
  );
}

export const POSICOES_IMAGEM = [
  { valor: "center center", label: "Centro" },
  { valor: "left center", label: "Esquerda" },
  { valor: "right center", label: "Direita" },
  { valor: "center top", label: "Cima" },
  { valor: "center bottom", label: "Baixo" },
  { valor: "left top", label: "Cima esquerda" },
  { valor: "right top", label: "Cima direita" },
  { valor: "left bottom", label: "Baixo esquerda" },
  { valor: "right bottom", label: "Baixo direita" },
];
