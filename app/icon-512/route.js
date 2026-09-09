import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FFFFFF",
        }}
      >
        <svg width="370" height="370" viewBox="0 0 32 32">
          <circle cx="23" cy="9" r="3.2" fill="#1B7A43" fillOpacity="0.25" />
          <path d="M1 25 L9.5 11 L14 17.5 L19 8 L31 25 Z" fill="#1B7A43" />
          <path d="M1 25 L13 16 L18 21 L24 14 L31 25 Z" fill="#12130F" fillOpacity="0.12" />
        </svg>
      </div>
    ),
    { width: 512, height: 512 }
  );
}
