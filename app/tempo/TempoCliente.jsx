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
  80: "Pancadas de chuva fracas",
  81: "Pancadas de chuva moderadas",
  82: "Pancadas de chuva fortes",
  95: "Trovoadas",
};

function descreverClima(codigo) {
  return DESCRICOES_CLIMA[codigo] || "Condição indisponível";
}

export default function TempoCliente({ municipios }) {
  const [slugSelecionado, setSlugSelecionado] = useState(
    municipios[0]?.slug || ""
  );
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  const municipio = useMemo(
    () => municipios.find((m) => m.slug === slugSelecionado),
    [municipios, slugSelecionado]
  );

  useEffect(() => {
    if (!municipio) return;

    let cancelado = false;
    setCarregando(true);
    setErro(null);

    fetch(`/api/tempo?lat=${municipio.latitude}&lon=${municipio.longitude}`)
      .then((res) => res.json())
      .then((json) => {
        if (cancelado) return;
        if (json.erro) {
          setErro(json.erro);
        } else {
          setDados(json);
        }
      })
      .catch(() => {
        if (!cancelado) setErro("Não foi possível carregar a previsão do tempo.");
      })
      .finally(() => {
        if (!cancelado) setCarregando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [municipio]);

  return (
    <div className="mt-8">
      <label htmlFor="municipio" className="block text-sm font-medium text-cariri-preto mb-2">
        Município
      </label>
      <select
        id="municipio"
        value={slugSelecionado}
        onChange={(e) => setSlugSelecionado(e.target.value)}
        className="w-full sm:w-72 border border-cariri-verde-claro rounded-md px-3 py-2 text-sm"
      >
        {municipios.map((m) => (
          <option key={m.slug} value={m.slug}>
            {m.nome}
          </option>
        ))}
      </select>

      <div className="mt-8">
        {carregando && (
          <p className="text-sm text-cariri-cinza-texto">Carregando previsão do tempo…</p>
        )}

        {erro && <p className="text-sm text-red-600">{erro}</p>}

        {dados && dados.current && !carregando && (
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-lg border border-cariri-verde-claro p-6">
              <p className="text-sm text-cariri-cinza-texto">Agora em {municipio?.nome}</p>
              <p className="mt-2 text-4xl font-bold text-cariri-preto">
                {Math.round(dados.current.temperature_2m)}°C
              </p>
              <p className="mt-1 text-cariri-cinza-texto">
                {descreverClima(dados.current.weather_code)}
              </p>
              <p className="mt-1 text-sm text-cariri-cinza-texto">
                Umidade: {dados.current.relative_humidity_2m}%
              </p>
            </div>

            {dados.daily && (
              <div className="rounded-lg border border-cariri-verde-claro p-6">
                <p className="text-sm font-semibold text-cariri-preto mb-3">
                  Próximos dias
                </p>
                <ul className="space-y-2">
                  {dados.daily.time.slice(0, 5).map((data, i) => (
                    <li key={data} className="flex items-center justify-between text-sm">
                      <span className="text-cariri-cinza-texto">
                        {new Date(data + "T12:00:00").toLocaleDateString("pt-BR", {
                          weekday: "short",
                          day: "2-digit",
                          month: "2-digit",
                        })}
                      </span>
                      <span className="text-cariri-cinza-texto">
                        {descreverClima(dados.daily.weather_code[i])}
                      </span>
                      <span className="font-medium text-cariri-preto">
                        {Math.round(dados.daily.temperature_2m_min[i])}° / {Math.round(dados.daily.temperature_2m_max[i])}°
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
