"use client";

import { useEffect } from "react";

// Componente "invisível": só dispara a contagem de visualização quando
// a página da notícia é aberta de verdade no navegador (evita contar
// robôs/rastreadores que só olham o HTML, já que eles não rodam JS).
export default function ContadorVisualizacao({ slug }) {
  useEffect(() => {
    fetch(`/api/noticias/${slug}/visualizar`, { method: "POST" }).catch(() => {});
  }, [slug]);

  return null;
}
