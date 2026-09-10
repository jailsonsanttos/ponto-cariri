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

  if (itens.length === 0) return null;

  // Duplica a lista para a rolagem ficar contínua (efeito "infinito").
  const listaDupla = [...itens, ...itens];

  return (
    <div className="bg-cariri-preto text-white overflow-hidden">
      <div className="flex whitespace-nowrap py-2.5 faixa-tempo-rolando w-max">
        {listaDupla.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-2 px-6 text-sm border-r border-white/10">
            <span className="font-semibold">{item.nome}</span>
            <span className="text-white/70">{item.temperatura}°C</span>
            <span className="text-white/50">· {item.descricao}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
