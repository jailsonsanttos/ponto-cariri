"use client";

import { useEffect, useMemo, useState } from "react";

const DESCRICOES_CLIMA = {
  0: "Céu limpo",
  1: "Predomínio de sol",
  2: "Parcialmente nublado",
  3: "Nublado",
  45: "Neblina",
  48: "Neblina com geada",
  51: "Garoa fraca",
  53: "Garoa moderada",
  55: "Garoa forte",
  61: "Chuva fraca",
  63: "Chuva moderada",
  65: "Chuva forte",
  80: "Pancadas fracas",
  81: "Pancadas moderadas",
  82: "Pancadas fortes",
  95: "Trovoadas",
};

function descreverClima(codigo) {
  return DESCRICOES_CLIMA[codigo] || "Condição indisponível";
}

function IconeClima({ codigo, grande = false }) {
  const tamanho = grande ? "h-20 w-20" : "h-9 w-9";
  const chuva = codigo >= 51;
  const nublado = codigo >= 2 && codigo <= 48;
  return (
    <div className={`${tamanho} relative flex items-center justify-center ${chuva ? "text-sky-600" : nublado ? "text-slate-500" : "text-amber-500"}`} aria-hidden="true">
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        {!chuva && !nublado && <><circle cx="24" cy="24" r="8" fill="currentColor" stroke="none" /><path d="M24 4v6M24 38v6M4 24h6M38 24h6M10 10l4 4M34 34l4 4M38 10l-4 4M14 34l-4 4" /></>}
        {nublado && <><path d="M14 33h22a7 7 0 0 0 0-14 10 10 0 0 0-19-2 8 8 0 0 0-3 16Z" fill="currentColor" opacity=".18" /><path d="M14 33h22a7 7 0 0 0 0-14 10 10 0 0 0-19-2 8 8 0 0 0-3 16Z" /></>}
        {chuva && <><path d="M13 27h22a7 7 0 0 0 0-14 10 10 0 0 0-19-2 8 8 0 0 0-3 16Z" fill="currentColor" opacity=".16" /><path d="M13 27h22a7 7 0 0 0 0-14 10 10 0 0 0-19-2 8 8 0 0 0-3 16Z" /><path d="m17 34-2 4M25 34l-2 4M33 34l-2 4" /></>}
      </svg>
    </div>
  );
}

function formatarDia(data, indice) {
  if (indice === 0) return "Hoje";
  return new Date(`${data}T12:00:00`).toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).replace(".", "");
}

export default function TempoCliente({ municipios }) {
  const [slugSelecionado, setSlugSelecionado] = useState(municipios[0]?.slug || "");
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  const municipio = useMemo(
    () => municipios.find((m) => m.slug === slugSelecionado),
    [municipios, slugSelecionado],
  );

  useEffect(() => {
    if (!municipio?.latitude || !municipio?.longitude) {
      setDados(null);
      setErro("Este município ainda não possui localização cadastrada.");
      return undefined;
    }

    let cancelado = false;
    setCarregando(true);
    setErro(null);
    setDados(null);

    fetch(`/api/tempo?lat=${municipio.latitude}&lon=${municipio.longitude}`)
      .then((res) => res.json())
      .then((json) => {
        if (cancelado) return;
        if (json.erro || !json.current) setErro(json.erro || "Previsão indisponível no momento.");
        else setDados(json);
      })
      .catch(() => {
        if (!cancelado) setErro("Não foi possível carregar a previsão do tempo.");
      })
      .finally(() => {
        if (!cancelado) setCarregando(false);
      });

    return () => { cancelado = true; };
  }, [municipio]);

  if (!municipios.length) {
    return <div className="mt-8 rounded-2xl border border-dashed border-cariri-verde-claro p-8 text-center text-cariri-cinza-texto">Nenhum município cadastrado para consultar a previsão.</div>;
  }

  const atual = dados?.current;
  const dias = dados?.daily?.time?.slice(0, 5) || [];

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-5 rounded-3xl bg-cariri-verde-claro/70 p-5 sm:p-7 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-cariri-verde">Consultar por município</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-cariri-preto">Como está o tempo hoje?</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-cariri-cinza-texto">Escolha uma cidade para acompanhar as condições atuais e a previsão dos próximos dias.</p>
        </div>
        <label htmlFor="municipio" className="w-full lg:w-72">
          <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-cariri-cinza-texto">Município selecionado</span>
          <select id="municipio" value={slugSelecionado} onChange={(e) => setSlugSelecionado(e.target.value)} className="w-full rounded-xl border border-cariri-verde/30 bg-white px-4 py-3 text-sm font-semibold text-cariri-preto outline-none transition focus:ring-2 focus:ring-cariri-verde/30">
            {municipios.map((m) => <option key={m.slug} value={m.slug}>{m.nome}</option>)}
          </select>
        </label>
      </div>

      <div className="mt-6">
        {carregando && (
          <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr] animate-pulse">
            <div className="h-64 rounded-3xl bg-cariri-verde-claro" />
            <div className="h-64 rounded-3xl bg-cariri-verde-claro" />
          </div>
        )}

        {erro && !carregando && <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">{erro}</div>}

        {atual && !carregando && (
          <div className="grid gap-5 lg:grid-cols-[0.78fr_1.22fr]">
            <section className="relative overflow-hidden rounded-3xl bg-cariri-verde-escuro p-6 text-white sm:p-8">
              <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full border-[18px] border-white/10" />
              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-white/70">Agora em</p>
                    <h3 className="mt-1 text-2xl font-black">{municipio.nome}</h3>
                  </div>
                  <IconeClima codigo={atual.weather_code} grande />
                </div>
                <p className="mt-8 text-6xl font-black tracking-tight">{Math.round(atual.temperature_2m)}°</p>
                <p className="mt-2 text-lg font-semibold text-white/90">{descreverClima(atual.weather_code)}</p>
                <div className="mt-8 grid grid-cols-2 gap-3 border-t border-white/15 pt-5 text-sm">
                  <div><p className="text-white/60">Umidade</p><p className="mt-1 font-bold">{atual.relative_humidity_2m}%</p></div>
                  <div><p className="text-white/60">Atualizado</p><p className="mt-1 font-bold">agora</p></div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-cariri-verde-claro bg-white p-5 shadow-sm sm:p-7">
              <div className="flex items-end justify-between gap-4">
                <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-cariri-verde">Previsão</p><h3 className="mt-1 text-xl font-black text-cariri-preto">Próximos dias</h3></div>
                <p className="text-xs text-cariri-cinza-texto">Temperaturas mínima / máxima</p>
              </div>
              <div className="mt-5 grid gap-2">
                {dias.map((data, i) => (
                  <div key={data} className={`flex items-center gap-3 rounded-2xl px-3 py-3 ${i === 0 ? "bg-cariri-verde-claro" : "bg-slate-50"}`}>
                    <span className="w-16 text-sm font-bold capitalize text-cariri-preto">{formatarDia(data, i)}</span>
                    <IconeClima codigo={dados.daily.weather_code[i]} />
                    <span className="min-w-0 flex-1 truncate text-sm text-cariri-cinza-texto">{descreverClima(dados.daily.weather_code[i])}</span>
                    <span className="text-sm font-black text-cariri-preto">{Math.round(dados.daily.temperature_2m_min[i])}° <span className="font-normal text-cariri-cinza-texto">/</span> {Math.round(dados.daily.temperature_2m_max[i])}°</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
