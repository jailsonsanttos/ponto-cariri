import { NextResponse } from "next/server";
import { listarMunicipios } from "@/lib/db";

export const dynamic = "force-dynamic";

const IBGE_BASE = "https://servicodados.ibge.gov.br/api/v1";
const TCE_BASE = "https://api-dados-abertos.tce.ce.gov.br/sim";
const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";
const INMET_RSS = "https://apiprevmet3.inmet.gov.br/avisos/rss";
const AREAS_CARIRI = ["Sul Cearense", "Centro-Sul Cearense", "Sertões Cearenses", "Cariri"];
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

async function buscarTexto(url) {
  const urls = [url, `https://r.jina.ai/${url}`];
  for (const endereco of urls) {
    try {
      const resposta = await fetch(endereco, {
        headers: { Accept: "text/html, text/plain", "User-Agent": "PontoCariri/1.0 (https://www.pontocariri.com.br)" },
        next: { revalidate: 86400 },
      });
      if (resposta.ok) return resposta.text();
    } catch {
      // Tenta a próxima fonte pública.
    }
  }
  throw new Error("Página do IBGE indisponível");
}

function removerHtml(valor = "") {
  return valor.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/!\[[^\]]*\]\([^)]*\)/g, " ").replace(/\[[^\]]*\]\([^)]*\)/g, " ").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'").replace(/[|*]/g, " ").replace(/\s+/g, " ").trim();
}

function slugIbge(nome = "") {
  return nome.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function extrairIndicador(texto, rotulo) {
  const partes = texto.split(new RegExp(rotulo, "ig"));
  for (let i = 1; i < partes.length; i += 1) {
    const valor = partes[i].slice(0, 220).match(/(?:R\$\s*)?\d[\d.]*[,]?\d*\s*(?:km²|hab\/km²|pessoas|%|R\$|óbitos por mil nascidos vivos)?\s*(?:\[\d{4}\])?/i);
    if (valor) return valor[0].replace(/\s+/g, " ").trim();
  }
  return "";
}

function extrairTextoIndicador(texto, rotulo) {
  const partes = texto.split(new RegExp(rotulo, "ig"));
  const trecho = partes[1]?.slice(0, 160) || "";
  return trecho.split(/(?:Área Territorial|População no último censo|Densidade demográfica|População estimada|Escolarização|IDHM|Mortalidade infantil|Total de receitas|Total de despesas|PIB per capita|Saiba mais)/i)[0].replace(/\[\d{4}\]/g, "").replace(/\s+/g, " ").trim();
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
  let locais = [];
  try {
    locais = await buscarJson(`${IBGE_BASE}/localidades/estados/23/municipios`);
  } catch {
    const urlIbge = `https://www.ibge.gov.br/cidades-e-estados/ce/${slugIbge(municipio.nome)}.html`;
    try {
      const texto = removerHtml(await buscarTexto(urlIbge));
      return {
        fonte: "IBGE",
        municipio: municipio.nome,
        ibge: { nome: municipio.nome, id: "" },
        resumo: {
          prefeito: extrairTextoIndicador(texto, "Prefeito"),
          gentilico: extrairTextoIndicador(texto, "Gentílico"),
          areaTerritorial: extrairIndicador(texto, "Área Territorial"),
          populacaoCenso: extrairIndicador(texto, "População no último censo"),
          densidadeDemografica: extrairIndicador(texto, "Densidade demográfica"),
          populacaoEstimada: extrairIndicador(texto, "População estimada"),
          escolarizacao: extrairIndicador(texto, "Escolarização 6 a 14 anos"),
          idhm: extrairIndicador(texto, "IDHM Índice de desenvolvimento humano municipal"),
          mortalidadeInfantil: extrairIndicador(texto, "Mortalidade infantil"),
          receitas: extrairIndicador(texto, "Total de receitas brutas realizadas"),
          despesas: extrairIndicador(texto, "Total de despesas brutas empenhadas"),
          pibPerCapita: extrairIndicador(texto, "PIB per capita"),
          url: urlIbge,
        },
        atualizadoEm: new Date().toISOString(),
      };
    } catch {
      // Continua com uma resposta estável e o link oficial para nova tentativa.
    }
    return {
      fonte: "IBGE",
      municipio: municipio.nome,
      ibge: { nome: municipio.nome, id: "" },
      resumo: { url: urlIbge, indisponivel: true },
      atualizadoEm: new Date().toISOString(),
    };
  }
  const local = locais.find((item) => nomeNormalizado(item.nome) === nomeNormalizado(municipio.nome));
  if (!local) throw new Error("Município não localizado na base do IBGE");
  let detalhes = local;
  try {
    detalhes = await buscarJson(`${IBGE_BASE}/localidades/municipios/${local.id}`);
  } catch {
    // Mantém a hierarquia recebida na listagem quando o endpoint detalhado oscilar.
  }
  const urlIbge = `https://www.ibge.gov.br/cidades-e-estados/ce/${slugIbge(municipio.nome)}.html`;
  let resumo = { url: urlIbge };
  try {
    const texto = removerHtml(await buscarTexto(urlIbge));
    resumo = {
      prefeito: extrairTextoIndicador(texto, "Prefeito"),
      gentilico: extrairTextoIndicador(texto, "Gentílico"),
      areaTerritorial: extrairIndicador(texto, "Área Territorial"),
      populacaoCenso: extrairIndicador(texto, "População no último censo"),
      densidadeDemografica: extrairIndicador(texto, "Densidade demográfica"),
      populacaoEstimada: extrairIndicador(texto, "População estimada"),
      escolarizacao: extrairIndicador(texto, "Escolarização 6 a 14 anos"),
      idhm: extrairIndicador(texto, "IDHM Índice de desenvolvimento humano municipal"),
      mortalidadeInfantil: extrairIndicador(texto, "Mortalidade infantil"),
      receitas: extrairIndicador(texto, "Total de receitas brutas realizadas"),
      despesas: extrairIndicador(texto, "Total de despesas brutas empenhadas"),
      pibPerCapita: extrairIndicador(texto, "PIB per capita"),
      url: urlIbge,
    };
  } catch {
    // A identificação territorial continua disponível mesmo se o resumo estiver indisponível.
  }
  return {
    fonte: "IBGE",
    municipio: municipio.nome,
    ibge: detalhes,
    resumo,
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

function normalizarNomeMunicipio(valor = "") {
  return valor.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().trim();
}

function textoCap(xml, nome) {
  const resultado = xml.match(new RegExp(`<${nome}[^>]*>([\\s\\S]*?)</${nome}>`, "i"));
  return resultado ? textoXml(resultado[1]) : "";
}

async function detalhesInmet(url, municipiosAtivos) {
  const resposta = await fetch(url, {
    headers: { Accept: "application/xml, text/xml", "User-Agent": "PontoCariri/1.0 (https://www.pontocariri.com.br)" },
    next: { revalidate: 900 },
  });
  if (!resposta.ok) return null;
  const xml = await resposta.text();
  const info = xml.match(/<info>([\s\S]*?)<\/info>/i)?.[1] || xml;
  const parametro = [...xml.matchAll(/<parameter>([\s\S]*?)<\/parameter>/gi)]
    .map(([, bloco]) => ({ nome: textoCap(bloco, "valueName"), valor: textoCap(bloco, "value") }))
    .find((item) => item.nome === "Municipios");
  const municipios = municipiosAtivos.filter((nome) => normalizarNomeMunicipio(parametro?.valor || "").includes(normalizarNomeMunicipio(`${nome} - CE`)));
  if (municipios.length === 0) return null;
  const severidade = { Minor: "Baixo", Moderate: "Perigo Potencial", Severe: "Perigo", Extreme: "Grande Perigo" };
  const nivel = textoCap(info, "severity");
  return {
    evento: textoCap(info, "event") || "Aviso meteorológico",
    severidade: severidade[nivel] || nivel || "Aviso",
    inicio: textoCap(info, "onset"),
    fim: textoCap(info, "expires"),
    descricao: textoCap(info, "description"),
    municipios,
  };
}

async function dadosInmet(municipiosAtivos = []) {
  const resposta = await fetch(INMET_RSS, {
    headers: { Accept: "application/rss+xml, application/xml, text/xml" },
    next: { revalidate: 900 },
  });
  if (!resposta.ok) throw new Error(`INMET respondeu ${resposta.status}`);
  const xml = await resposta.text();
  const agora = Date.now();
  const avisosBase = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)]
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
    .filter((aviso) => AREAS_CARIRI.some((area) => aviso.area.includes(area)))
    .filter((aviso) => {
      const dataFim = Date.parse(aviso.fim.replace(" ", "T"));
      return Number.isNaN(dataFim) || dataFim >= agora;
    })
    .slice(0, 20);
  const avisos = (await Promise.all(avisosBase.map(async (aviso) => {
    const detalhes = await detalhesInmet(aviso.link, municipiosAtivos);
    return detalhes ? { ...aviso, ...detalhes } : null;
  }))).filter(Boolean).slice(0, 2);
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
    if (fonte === "inmet") {
      const municipios = (searchParams.get("municipios") || "").split("|").map((item) => item.trim()).filter(Boolean);
      return NextResponse.json(await dadosInmet(municipios));
    }
    if (fonte === "mapa") return NextResponse.json(await geocodificar(searchParams.get("q")));
    return NextResponse.json({ erro: "Fonte de dados não suportada." }, { status: 400 });
  } catch (erro) {
    return NextResponse.json({ erro: erro.message || "Não foi possível consultar a fonte agora." }, { status: 502 });
  }
}
