import { ImageResponse } from "next/og";
import { buscarNoticia } from "@/lib/db";

export const runtime = "edge";
export const alt = "Notícia do Ponto Cariri";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }) {
  const noticia = await buscarNoticia(params.slug);
  const titulo = noticia?.titulo || "Ponto Cariri";
  const categoria = noticia?.categoria || "Informação do Cariri";
  const capa = noticia?.imagemCapa || "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "#12130F",
          color: "#FFFFFF",
        }}
      >
        {capa ? (
          <img
            src={capa}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : null}

        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background: capa
              ? "linear-gradient(90deg, rgba(0,0,0,.86) 0%, rgba(0,0,0,.58) 48%, rgba(0,0,0,.12) 100%)"
              : "linear-gradient(135deg, #12130F 0%, #1B7A43 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 14,
            display: "flex",
            background: "#1B7A43",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: "54px 70px 58px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 58,
                height: 58,
                borderRadius: 14,
                background: "#1B7A43",
                fontSize: 30,
                fontWeight: 800,
              }}
            >
              PC
            </div>
            <div style={{ display: "flex", fontSize: 34, fontWeight: 700 }}>
              Ponto Cariri
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", maxWidth: 970 }}>
            <div
              style={{
                display: "flex",
                fontSize: 27,
                fontWeight: 700,
                color: "#A9E5BF",
                marginBottom: 16,
                textTransform: "uppercase",
              }}
            >
              {categoria}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: titulo.length > 85 ? 42 : titulo.length > 58 ? 49 : 57,
                fontWeight: 800,
                lineHeight: 1.16,
                textShadow: "0 2px 8px rgba(0,0,0,.35)",
              }}
            >
              {titulo}
            </div>
          </div>

          <div style={{ display: "flex", fontSize: 25, fontWeight: 600, color: "#E8F5EC" }}>
            www.pontocariri.com.br
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
