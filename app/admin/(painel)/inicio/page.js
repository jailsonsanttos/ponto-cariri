"use client";

import { useEffect, useState } from "react";

const TIPOS = [
  { id: "tempo", label: "Faixa do tempo" },
  { id: "destaque", label: "Destaque" },
  { id: "publicacoes", label: "Publicações recentes" },
  { id: "mais_lidas", label: "Mais lidas (barra lateral)" },
  { id: "publicidade", label: "Publicidade (barra lateral)" },
  { id: "precos", label: "Tabela de preços" },
  { id: "eventos", label: "Eventos" },
  { id: "adsense", label: "Espaço AdSense" },
];

export default function AdminInicioPage() {
  const [secoes, setSecoes] = useState([]);
  const [tipo, setTipo] = useState("publicacoes");
  const [titulo, setTitulo] = useState("");

  async function carregar() {
    const r = await fetch("/api/cms?recurso=home");
    setSecoes(await r.json());
  }
  useEffect(() => {
    carregar();
  }, []);

  async function enviar(corpo) {
    await fetch("/api/cms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(corpo),
    });
    carregar();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Página inicial</h1>
      <p className="text-sm text-cariri-cinza-texto mt-1">
        Ative, desative e reordene seções. Arraste com os botões ↑ ↓.
      </p>

      <form
        className="mt-6 flex flex-wrap gap-2 items-end"
        onSubmit={(e) => {
          e.preventDefault();
          enviar({
            recurso: "home",
            dados: { tipo, titulo, ordem: secoes.length + 1, ativo: true, dados: { limite: 6 } },
          });
          setTitulo("");
        }}
      >
        <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="border rounded-md px-3 py-2 text-sm">
          {TIPOS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Título da seção"
          className="border rounded-md px-3 py-2 text-sm"
        />
        <button className="bg-cariri-verde text-white px-4 py-2 rounded-md text-sm font-semibold">Adicionar</button>
      </form>

      <ul className="mt-6 space-y-2 max-w-2xl">
        {secoes.map((s) => (
          <li key={s.id} className="border rounded-md p-3 flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-sm">{s.titulo || s.tipo}</p>
              <p className="text-xs text-cariri-cinza-texto">{s.tipo}</p>
            </div>
            <div className="flex gap-2 text-sm">
              <button type="button" onClick={() => enviar({ recurso: "home", dados: { ...s, ordem: s.ordem - 1 } })}>
                ↑
              </button>
              <button type="button" onClick={() => enviar({ recurso: "home", dados: { ...s, ordem: s.ordem + 1 } })}>
                ↓
              </button>
              <button
                type="button"
                onClick={() => enviar({ recurso: "home", dados: { ...s, ativo: !s.ativo } })}
              >
                {s.ativo ? "Ocultar" : "Mostrar"}
              </button>
              <button
                type="button"
                className="text-red-600"
                onClick={() => enviar({ recurso: "home", acao: "excluir", id: s.id })}
              >
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
