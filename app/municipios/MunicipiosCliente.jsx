"use client";

import { useMemo, useState } from "react";
import MunicipioCard from "@/components/MunicipioCard";

export default function MunicipiosCliente({ municipios = [] }) {
  const [busca, setBusca] = useState("");
  const [comLocalizacao, setComLocalizacao] = useState(false);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");
    return municipios.filter((m) => {
      const texto = `${m.nome} ${m.descricaoCurta || ""}`.toLocaleLowerCase("pt-BR");
      const temLocalizacao = Boolean(m.latitude && m.longitude);
      return (!termo || texto.includes(termo)) && (!comLocalizacao || temLocalizacao);
    });
  }, [busca, comLocalizacao, municipios]);

  return (
    <div>
      <div className="rounded-3xl border border-cariri-verde-claro bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <label className="flex-1">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-cariri-cinza-texto">Buscar município</span>
            <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Digite o nome da cidade..." className="w-full rounded-xl border border-cariri-verde-claro bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cariri-verde focus:ring-2 focus:ring-cariri-verde/20" />
          </label>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-cariri-preto sm:mb-0">
            <input type="checkbox" checked={comLocalizacao} onChange={(e) => setComLocalizacao(e.target.checked)} className="h-4 w-4 accent-[var(--cariri-verde)]" />
            Com localização no mapa
          </label>
        </div>
        {(busca || comLocalizacao) && <button type="button" onClick={() => { setBusca(""); setComLocalizacao(false); }} className="mt-3 text-xs font-bold text-cariri-verde hover:underline">Limpar filtros</button>}
      </div>

      <div className="mt-7 flex items-end justify-between gap-3">
        <div><h2 className="text-xl font-black text-cariri-preto">Explore o Cariri</h2><p className="mt-1 text-sm text-cariri-cinza-texto">{filtrados.length} {filtrados.length === 1 ? "município encontrado" : "municípios encontrados"}</p></div>
      </div>

      {!filtrados.length ? (
        <div className="mt-5 rounded-2xl border border-dashed border-cariri-verde-claro p-10 text-center"><p className="font-bold text-cariri-preto">Nenhum município encontrado</p><p className="mt-2 text-sm text-cariri-cinza-texto">Tente pesquisar por outro nome ou remova o filtro.</p></div>
      ) : (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtrados.map((m) => <MunicipioCard key={m.slug} municipio={m} />)}
        </div>
      )}
    </div>
  );
}
