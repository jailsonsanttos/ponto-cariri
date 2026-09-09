import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Ponto Cariri";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#FFFFFF",
        }}
      >
        <div style={{ display: "flex", position: "absolute", top: 0, left: 0, right: 0, height: 14, background: "#1B7A43" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <svg width="110" height="110" viewBox="0 0 32 32">
            <circle cx="23" cy="9" r="3.2" fill="#1B7A43" fillOpacity="0.25" />
            <path d="M1 25 L9.5 11 L14 17.5 L19 8 L31 25 Z" fill="#1B7A43" />
            <path d="M1 25 L13 16 L18 21 L24 14 L31 25 Z" fill="#12130F" fillOpacity="0.12" />
          </svg>
          <div style={{ display: "flex", fontSize: 96, fontWeight: 700, color: "#12130F" }}>
            Ponto Cariri
          </div>
        </div>
        <div style={{ display: "flex", marginTop: 24, fontSize: 34, color: "#4A4E48" }}>
          Notícias e informações do Cariri cearense
        </div>
      </div>
    ),
    { ...size }
  );
}
