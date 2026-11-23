import { NextResponse } from "next/server";

export const runtime = "edge";

export function GET(request) {
  const slug = request.nextUrl.searchParams.get("slug");

  if (!slug || !/^[a-z0-9-]+$/i.test(slug)) {
    return new NextResponse("Imagem social não encontrada", { status: 404 });
  }

  const destino = new URL(
    `/informacoes/${encodeURIComponent(slug)}/opengraph-image`,
    request.url
  );

  return NextResponse.redirect(destino, 302);
}
