"use client";

// components/TempoFaixa.jsx
// Faixa de previsão do tempo que fica rolando automaticamente no topo
// da página inicial, mostrando a temperatura de vários municípios.

import { useEffect, useState } from "react";

const DESCRICOES_CLIMA = {
  0: "céu limpo", 1: "sol", 2: "parcialmente nublado", 3: "nublado",
  45: "neblina", 48: "neblina", 51: "garoa", 53: "garoa", 55: "garoa",
  61: "chuva fraca", 63: "chuva", 65: "chuva forte",
  80: "pancadas de chuva", 81: "pancadas de chuva", 82: "pancadas de chuva",
  95: "trovoadas",
};

export default function TempoFaixa({ municipios }) {
  const [itens, setItens] = useState([]);

  useEffect(() => {
    let cancelado = false;

    async function carregar() {
      const resultados = await Promise.all(
        municipios.slice(0, 8).map(async (m) => {
          try {
            const resposta = await fetch(`/api/tempo?lat=${m.latitude}&lon=${m.longitude}`);
            const dados = await resposta.json();
            if (!dados.current) return null;
            return {
              nome: m.nome,
              temperatura: Math.round(dados.current.temperature_2m),
              descricao: DESCRICOES_CLIMA[dados.current.weather_code] || "",
            };
          } catch {
            return null;
          }
        })
      );
      if (!cancelado) setItens(resultados.filter(Boolean));
    }

    carregar();
    return () => {
      cancelado = true;
    };
  }, [municipios]);

  if (itens.length === 0) return <div className="h-11" aria-hidden="true" />;

  // Duplica a lista para a rolagem ficar contínua (efeito "infinito").
  const listaDupla = [...itens, ...itens];

  return (
    <div
      className="relative z-10 w-full border-y border-white/10 bg-[#0b100e] shadow-[0_8px_24px_-18px_rgba(0,0,0,.9)]"
      role="status"
      aria-label="Previsão do tempo nos municípios do Cariri"
    >
      <div className="mx-auto flex min-h-12 max-w-content items-center overflow-hidden sm:min-h-14">
        <span className="flex h-12 shrink-0 items-center gap-2 border-r border-white/10 bg-white/[.03] px-3 text-[10px] font-black uppercase tracking-[0.12em] text-white sm:h-14 sm:px-5 sm:text-[11px] sm:tracking-[0.14em]"><span className="h-1.5 w-1.5 rounded-full bg-[#8ee7b9] shadow-[0_0_0_3px_rgba(142,231,185,.12)]" /><span className="sm:hidden">Agora</span><span className="hidden sm:inline">Tempo agora</span></span>
        <div className="flex w-max whitespace-nowrap py-2.5 faixa-tempo-rolando sm:py-3">
        {listaDupla.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-1.5 border-r border-white/10 px-4 text-[13px] sm:gap-2 sm:px-5 sm:text-sm">
            <span className="font-semibold text-white">{item.nome}</span>
            <span className="font-bold text-white">{item.temperatura}°C</span>
            <span className="hidden text-white/70 sm:inline">· {item.descricao}</span>
          </span>
        ))}
        </div>
      </div>
    </div>
  );
}
