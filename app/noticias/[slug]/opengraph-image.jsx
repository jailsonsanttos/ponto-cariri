import { ImageResponse } from "next/og";
import { buscarNoticia } from "@/lib/db";

export const runtime = "edge";

export const alt = "Notícia - Ponto Cariri";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }) {
  const noticia = await buscarNoticia(params.slug);
  const titulo = noticia?.titulo || "Ponto Cariri";
  const categoria = noticia?.categoria || "Notícias do Cariri";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#FFFFFF",
          padding: 70,
        }}
      >
        <div style={{ display: "flex", position: "absolute", top: 0, left: 0, right: 0, height: 14, background: "#1B7A43" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 20 }}>
          <svg width="52" height="52" viewBox="0 0 32 32">
            <circle cx="23" cy="9" r="3.2" fill="#1B7A43" fillOpacity="0.25" />
            <path d="M1 25 L9.5 11 L14 17.5 L19 8 L31 25 Z" fill="#1B7A43" />
            <path d="M1 25 L13 16 L18 21 L24 14 L31 25 Z" fill="#12130F" fillOpacity="0.12" />
          </svg>
          <div style={{ display: "flex", fontSize: 34, fontWeight: 700, color: "#12130F" }}>
            Ponto Cariri
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 1000 }}>
          <div style={{ display: "flex", fontSize: 28, fontWeight: 600, color: "#1B7A43", marginBottom: 16 }}>
            {categoria}
          </div>
          <div style={{ display: "flex", fontSize: 56, fontWeight: 700, color: "#12130F", lineHeight: 1.2 }}>
            {titulo}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
