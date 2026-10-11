import { NextResponse } from "next/server";
import { listarMunicipios } from "@/lib/db";

export const dynamic = "force-dynamic";

const IBGE_BASE = "https://servicodados.ibge.gov.br/api/v1";
const TCE_BASE = "https://api-dados-abertos.tce.ce.gov.br/sim";
const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";
const INMET_RSS = "https://apiprevmet3.inmet.gov.br/avisos/rss";
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

function textoXml(valor = "") {
  return valor
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function campoXml(bloco, nome) {
  const resultado = bloco.match(new RegExp(`<${nome}[^>]*>([\\s\\S]*?)</${nome}>`, "i"));
  return resultado ? textoXml(resultado[1]) : "";
}

function campoTabela(valor, nome) {
  const resultado = valor.match(new RegExp(`>${nome}</th>\\s*<td>([^<]*)`, "i"));
  return resultado ? textoXml(resultado[1]) : "";
}

async function dadosInmet() {
  const resposta = await fetch(INMET_RSS, {
    headers: { Accept: "application/rss+xml, application/xml, text/xml" },
    next: { revalidate: 900 },
  });
  if (!resposta.ok) throw new Error(`INMET respondeu ${resposta.status}`);
  const xml = await resposta.text();
  const agora = Date.now();
  const avisos = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)]
    .map(([, bloco]) => {
      const descricaoBruta = bloco.match(/<description[^>]*>([\s\S]*?)<\/description>/i)?.[1] || "";
      const descricao = textoXml(descricaoBruta);
      const inicio = campoTabela(descricaoBruta, "In[ií]cio");
      const fim = campoTabela(descricaoBruta, "Fim");
      const area = campoTabela(descricaoBruta, "Área");
      return {
        titulo: campoXml(bloco, "title"),
        evento: campoTabela(descricaoBruta, "Evento") || "Aviso meteorológico",
        severidade: campoTabela(descricaoBruta, "Severidade"),
        inicio,
        fim,
        area,
        descricao,
        link: campoXml(bloco, "link"),
      };
    })
    .filter((aviso) => /Cearense|Cariri|Ceará/i.test(`${aviso.area} ${aviso.descricao}`))
    .filter((aviso) => {
      const dataFim = Date.parse(aviso.fim.replace(" ", "T"));
      return Number.isNaN(dataFim) || dataFim >= agora;
    })
    .slice(0, 30);
  return { fonte: "INMET", atualizadoEm: new Date().toISOString(), avisos };
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
    if (fonte === "inmet") return NextResponse.json(await dadosInmet());
    if (fonte === "mapa") return NextResponse.json(await geocodificar(searchParams.get("q")));
    return NextResponse.json({ erro: "Fonte de dados não suportada." }, { status: 400 });
  } catch (erro) {
    return NextResponse.json({ erro: erro.message || "Não foi possível consultar a fonte agora." }, { status: 502 });
  }
}
