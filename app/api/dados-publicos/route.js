import { NextResponse } from "next/server";
import { listarMunicipios } from "@/lib/db";

export const dynamic = "force-dynamic";

const IBGE_BASE = "https://servicodados.ibge.gov.br/api/v1";
const TCE_BASE = "https://api-dados-abertos.tce.ce.gov.br/sim";
const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";
const headersNominatim = {
  Accept: "application/json",
  "User-Agent": "PontoCariri/1.0 (https://www.pontocariri.com.br)",
};

async function buscarJson(url, opcoes = {}) {
  const resposta = await fetch(url, {
    ...opcoes,
    headers: { Accept: "application/json", ...(opcoes.headers || {}) },
    next: { revalidate: 3600 },
  });
  if (!resposta.ok) throw new Error(`Fonte externa respondeu ${resposta.status}`);
  return resposta.json();
}

function nomeNormalizado(valor = "") {
  return valor.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().trim();
}

async function municipioSelecionado(slug) {
  const locais = await listarMunicipios();
  const municipio = locais.find((item) => item.slug === slug) || locais[0];
  if (!municipio) throw new Error("Nenhum município cadastrado");
  return municipio;
}

async function dadosIbge(slug) {
  const municipio = await municipioSelecionado(slug);
  const locais = await buscarJson(`${IBGE_BASE}/localidades/estados/23/municipios`);
  const local = locais.find((item) => nomeNormalizado(item.nome) === nomeNormalizado(municipio.nome));
  if (!local) throw new Error("Município não localizado na base do IBGE");
  const detalhes = await buscarJson(`${IBGE_BASE}/localidades/municipios/${local.id}`);
  return {
    fonte: "IBGE",
    municipio: municipio.nome,
    ibge: detalhes,
    atualizadoEm: new Date().toISOString(),
  };
}

async function dadosTceMunicipios() {
  const dados = await buscarJson(`${TCE_BASE}/municipios?$format=json&$count=1000`);
  return {
    fonte: "TCE Ceará — SIM",
    total: Array.isArray(dados.elements) ? dados.elements.length : 0,
    municipios: dados.elements || [],
    observacao: "Os demais módulos do SIM exigem parâmetros do exercício e do município. Esta consulta usa o catálogo oficial de municípios.",
  };
}

async function geocodificar(q) {
  const termo = String(q || "").trim();
  if (termo.length < 3) throw new Error("Informe pelo menos 3 caracteres para pesquisar um local");
  const url = `${NOMINATIM_BASE}/search?format=jsonv2&limit=5&addressdetails=1&countrycodes=br&q=${encodeURIComponent(termo)}`;
  const resultados = await buscarJson(url, { headers: headersNominatim });
  return {
    fonte: "OpenStreetMap / Nominatim",
    resultados,
    atribuicao: "© OpenStreetMap contributors",
  };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const fonte = searchParams.get("fonte") || "ibge";
  try {
    if (fonte === "ibge") return NextResponse.json(await dadosIbge(searchParams.get("municipio")));
    if (fonte === "tce") return NextResponse.json(await dadosTceMunicipios());
    if (fonte === "mapa") return NextResponse.json(await geocodificar(searchParams.get("q")));
    return NextResponse.json({ erro: "Fonte de dados não suportada." }, { status: 400 });
  } catch (erro) {
    return NextResponse.json({ erro: erro.message || "Não foi possível consultar a fonte agora." }, { status: 502 });
  }
}
