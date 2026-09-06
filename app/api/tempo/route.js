// app/api/tempo/route.js
// Busca a previsão do tempo usando a API gratuita Open-Meteo
// (não precisa de cadastro nem de chave de API).

import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json(
      { erro: "Informe latitude (lat) e longitude (lon)." },
      { status: 400 }
    );
  }

  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,relative_humidity_2m,weather_code` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
    `&timezone=America%2FFortaleza`;

  try {
    const resposta = await fetch(url, { next: { revalidate: 1800 } });
    const dados = await resposta.json();
    return NextResponse.json(dados);
  } catch (erro) {
    return NextResponse.json(
      { erro: "Não foi possível buscar a previsão do tempo agora." },
      { status: 500 }
    );
  }
}
