"use client";

import { useEffect, useState } from "react";

function formatarNumero(valor) {
  return new Intl.NumberFormat("pt-BR").format(valor);
}

export default function DadosPublicosCliente({ municipios }) {
  const [municipio, setMunicipio] = useState(municipios[0]?.slug || "");
  const [ibge, setIbge] = useState(null);
  const [tce, setTce] = useState(null);
  const [tceBusca, setTceBusca] = useState("");
  const [tceCarregando, setTceCarregando] = useState(false);
  const [inmet, setInmet] = useState(null);
  const [inmetCarregando, setInmetCarregando] = useState(false);
  const [busca, setBusca] = useState("");
  const [mapa, setMapa] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!municipio) return;
    let ativo = true;
    setCarregando(true);
    setErro("");
    fetch(`/api/dados-publicos?fonte=ibge&municipio=${encodeURIComponent(municipio)}`)
      .then((res) => res.json().then((json) => ({ ok: res.ok, json })))
      .then(({ ok, json }) => {
        if (!ativo) return;
        if (!ok) throw new Error(json.erro || "Não foi possível consultar o IBGE.");
        setIbge(json);
      })
      .catch((e) => ativo && setErro(e.message))
      .finally(() => ativo && setCarregando(false));
    return () => { ativo = false; };
  }, [municipio]);

  async function carregarTce() {
    setErro("");
    setTceCarregando(true);
    try {
      const res = await fetch("/api/dados-publicos?fonte=tce");
      const json = await res.json();
      if (!res.ok) throw new Error(json.erro || "Não foi possível consultar o TCE Ceará.");
      setTce(json);
    } catch (e) {
      setErro(e.message);
    } finally {
      setTceCarregando(false);
    }
  }

  useEffect(() => {
    let ativo = true;
    setInmetCarregando(true);
    fetch("/api/dados-publicos?fonte=inmet")
      .then((res) => res.json().then((json) => ({ ok: res.ok, json })))
      .then(({ ok, json }) => {
        if (!ok) throw new Error(json.erro || "Não foi possível consultar os alertas do INMET.");
        if (ativo) setInmet(json);
      })
      .catch((e) => ativo && setErro(e.message))
      .finally(() => ativo && setInmetCarregando(false));
    return () => { ativo = false; };
  }, []);

  const municipiosTce = (tce?.municipios || []).filter((item) =>
    `${item.nome_municipio} ${item.codigo_municipio_ibge}`.toLowerCase().includes(tceBusca.toLowerCase().trim())
  );

  function urlMapa(item) {
    const lat = Number(item?.lat || -7.25);
    const lon = Number(item?.lon || -39.35);
    const margem = 0.035;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${lon - margem}%2C${lat - margem}%2C${lon + margem}%2C${lat + margem}&layer=mapnik&marker=${lat}%2C${lon}`;
  }

  async function pesquisarMapa(event) {
    event.preventDefault();
    if (busca.trim().length < 3) return;
    setErro("");
    const res = await fetch(`/api/dados-publicos?fonte=mapa&q=${encodeURIComponent(busca.trim())}`);
    const json = await res.json();
    if (!res.ok) return setErro(json.erro || "Não foi possível pesquisar o local.");
    setMapa(json);
  }

  const local = ibge?.ibge;
  const regiao = local?.microrregiao?.mesorregiao?.UF?.regiao;

  return (
    <div className="mt-10 space-y-8">
      {erro && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{erro}</div>}

      <section className="rounded-3xl border border-cariri-verde-claro bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-cariri-verde">IBGE</p>
            <h2 className="mt-1 text-2xl font-black text-cariri-preto">Localidades e dados territoriais</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-cariri-cinza-texto">Consulte a identificação oficial e a divisão regional dos municípios do Cariri.</p>
          </div>
          <label className="w-full sm:w-72">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-cariri-cinza-texto">Município</span>
            <select value={municipio} onChange={(e) => setMunicipio(e.target.value)} className="w-full rounded-xl border border-cariri-verde/30 bg-white px-4 py-3 text-sm font-semibold text-cariri-preto">
              {municipios.map((item) => <option key={item.slug} value={item.slug}>{item.nome}</option>)}
            </select>
          </label>
        </div>
        {carregando && <p className="mt-6 text-sm text-cariri-cinza-texto">Consultando o IBGE...</p>}
        {local && !carregando && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-cariri-verde-claro/60 p-4"><p className="text-xs text-cariri-cinza-texto">Código IBGE</p><p className="mt-1 text-xl font-black text-cariri-preto">{local.id}</p></div>
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs text-cariri-cinza-texto">Microrregião</p><p className="mt-1 font-bold text-cariri-preto">{local.microrregiao?.nome || "—"}</p></div>
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs text-cariri-cinza-texto">Região intermediária</p><p className="mt-1 font-bold text-cariri-preto">{local["regiao-imediata"]?.["regiao-intermediaria"]?.nome || "—"}</p></div>
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs text-cariri-cinza-texto">Macrorregião</p><p className="mt-1 font-bold text-cariri-preto">{regiao?.nome || "—"}</p></div>
          </div>
        )}
        <p className="mt-5 text-xs text-cariri-cinza-texto">Fonte: <a className="font-semibold text-cariri-verde hover:underline" href="https://servicodados.ibge.gov.br/api/docs/localidades" target="_blank" rel="noreferrer">API de Localidades do IBGE</a>.</p>
      </section>

      <section className="rounded-3xl bg-cariri-verde-escuro p-6 text-white shadow-sm sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-cariri-verde-claro">INMET</p><h2 className="mt-2 text-2xl font-black">Alertas meteorológicos do Cariri</h2><p className="mt-3 max-w-3xl text-sm leading-6 text-white/75">Avisos oficiais exibidos dentro do Ponto Cariri, filtrados para as áreas do Ceará e do Cariri. A previsão detalhada continua disponível na página Tempo.</p></div>
          <a className="shrink-0 rounded-full bg-white px-4 py-2.5 text-center text-sm font-bold text-cariri-verde-escuro" href="/tempo">Ver previsão</a>
        </div>
        {inmetCarregando && <p className="mt-6 text-sm text-white/70">Atualizando alertas do INMET...</p>}
        {!inmetCarregando && inmet?.avisos?.length === 0 && <p className="mt-6 rounded-2xl border border-white/15 bg-white/10 p-4 text-sm text-white/80">Nenhum alerta ativo do INMET foi encontrado para o Ceará neste momento.</p>}
        {inmet?.avisos?.length > 0 && <div className="mt-6 grid gap-4 lg:grid-cols-2">{inmet.avisos.map((aviso, index) => <article key={`${aviso.link}-${index}`} className="rounded-2xl border border-white/15 bg-white/10 p-4"><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-amber-300 px-2.5 py-1 text-[11px] font-black uppercase text-amber-950">{aviso.severidade || "Aviso"}</span><span className="text-xs text-white/65">{aviso.evento}</span></div><h3 className="mt-3 font-bold text-white">{aviso.titulo}</h3><p className="mt-2 text-sm leading-6 text-white/75">{aviso.descricao}</p><p className="mt-3 text-xs text-white/55">Vigência: {aviso.inicio || "—"} até {aviso.fim || "—"}</p></article>)}</div>}
        <p className="mt-5 text-xs text-white/60">Fonte oficial: feed RSS do INMET. Atualização automática a cada 15 minutos.</p>
      </section>

      <section className="rounded-3xl border border-cariri-verde-claro bg-white p-6 shadow-sm sm:p-7">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-cariri-verde">TCE Ceará — SIM</p>
        <h2 className="mt-2 text-2xl font-black text-cariri-preto">Municípios disponíveis no SIM</h2>
        <p className="mt-3 text-sm leading-6 text-cariri-cinza-texto">Consulte diretamente nesta página o catálogo oficial de municípios e seus códigos no Sistema de Informações Municipais.</p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row"><button onClick={carregarTce} disabled={tceCarregando} className="rounded-xl bg-cariri-verde px-4 py-3 text-sm font-bold text-white disabled:cursor-wait disabled:opacity-60">{tceCarregando ? "Carregando municípios..." : tce ? "Atualizar municípios" : "Consultar municípios do SIM"}</button>{tce && <input value={tceBusca} onChange={(e) => setTceBusca(e.target.value)} placeholder="Filtrar por nome ou código" className="min-w-0 flex-1 rounded-xl border border-cariri-verde/30 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cariri-verde/30" />}</div>
        {tce && <><p className="mt-4 text-sm font-semibold text-cariri-verde">Exibindo {formatarNumero(municipiosTce.length)} de {formatarNumero(tce.total)} municípios.</p><div className="mt-4 max-h-[28rem] overflow-auto rounded-2xl border border-slate-200"><table className="w-full min-w-[34rem] text-left text-sm"><thead className="sticky top-0 bg-cariri-verde-escuro text-white"><tr><th className="px-4 py-3 font-bold">Município</th><th className="px-4 py-3 font-bold">Código SIM</th><th className="px-4 py-3 font-bold">Código IBGE</th><th className="px-4 py-3 font-bold">GeoNames</th></tr></thead><tbody>{municipiosTce.map((item) => <tr key={`${item.codigo_municipio}-${item.codigo_municipio_ibge}`} className="border-t border-slate-100 even:bg-slate-50"><td className="px-4 py-3 font-semibold text-cariri-preto">{item.nome_municipio}</td><td className="px-4 py-3 text-cariri-cinza-texto">{item.codigo_municipio || "—"}</td><td className="px-4 py-3 text-cariri-cinza-texto">{item.codigo_municipio_ibge || "—"}</td><td className="px-4 py-3 text-cariri-cinza-texto">{item.codigo_municipio_geonames || "—"}</td></tr>)}</tbody></table></div></>}
        <p className="mt-5 text-xs text-cariri-cinza-texto">Fonte: API Dados Abertos do SIM do TCE Ceará.</p>
      </section>

      <section className="rounded-3xl border border-cariri-verde-claro bg-white p-5 shadow-sm sm:p-7">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-cariri-verde">OpenStreetMap / Nominatim</p>
        <h2 className="mt-1 text-2xl font-black text-cariri-preto">Encontrar um endereço ou lugar</h2>
        <p className="mt-2 text-sm leading-6 text-cariri-cinza-texto">Pesquise um local no mapa. A busca é feita somente quando você envia o formulário, respeitando o limite do serviço público.</p>
        <form onSubmit={pesquisarMapa} className="mt-5 flex flex-col gap-3 sm:flex-row"><input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Ex.: Praça Padre Cícero, Juazeiro do Norte" className="min-w-0 flex-1 rounded-xl border border-cariri-verde/30 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cariri-verde/30" /><button className="rounded-xl bg-cariri-verde px-5 py-3 text-sm font-bold text-white">Pesquisar local</button></form>
        {mapa?.resultados?.length > 0 && <div className="mt-5 space-y-3">{mapa.resultados.map((item) => <div key={item.place_id} className="rounded-2xl bg-slate-50 p-4"><p className="font-bold text-cariri-preto">{item.display_name}</p><p className="mt-1 text-xs text-cariri-cinza-texto">{item.lat}, {item.lon}</p></div>)}</div>}
        {mapa && !mapa.resultados?.length && <p className="mt-5 text-sm text-cariri-cinza-texto">Nenhum local encontrado.</p>}
        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100"><iframe title="Mapa do OpenStreetMap" src={urlMapa(mapa?.resultados?.[0])} className="h-[24rem] w-full border-0" loading="lazy" /></div>
        <p className="mt-5 text-xs text-cariri-cinza-texto">Mapa e dados © OpenStreetMap contributors. <a className="font-semibold text-cariri-verde hover:underline" href="https://operations.osmfoundation.org/policies/nominatim/" target="_blank" rel="noreferrer">Política de uso do Nominatim</a>.</p>
      </section>
    </div>
  );
}
