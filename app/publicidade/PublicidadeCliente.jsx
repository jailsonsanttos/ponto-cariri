"use client";

import { useMemo, useState } from "react";
import PropagandaCard from "@/components/PropagandaCard";

export default function PublicidadeCliente({ propagandas = [] }) {
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("");

  const categorias = useMemo(
    () => [...new Set(propagandas.map((p) => p.categoria).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    [propagandas],
  );
  const filtradas = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");
    return propagandas.filter((p) => {
      const texto = `${p.nome} ${p.descricao} ${p.municipio} ${p.categoria}`.toLocaleLowerCase("pt-BR");
      return (!termo || texto.includes(termo)) && (!categoria || p.categoria === categoria);
    });
  }, [busca, categoria, propagandas]);

  return (
    <div>
      <div className="rounded-3xl border border-cariri-verde-claro bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex-1">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-cariri-cinza-texto">Buscar anunciante ou serviço</span>
            <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Ex.: restaurante, loja, farmácia..." className="w-full rounded-xl border border-cariri-verde-claro bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cariri-verde focus:ring-2 focus:ring-cariri-verde/20" />
          </label>
          <label className="sm:w-56">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-cariri-cinza-texto">Categoria</span>
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="w-full rounded-xl border border-cariri-verde-claro bg-slate-50 px-4 py-3 text-sm outline-none focus:border-cariri-verde">
              <option value="">Todas as categorias</option>
              {categorias.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
        </div>
        {(busca || categoria) && <button type="button" onClick={() => { setBusca(""); setCategoria(""); }} className="mt-3 text-xs font-bold text-cariri-verde hover:underline">Limpar filtros</button>}
      </div>

      <div className="mt-7 flex items-end justify-between gap-3">
        <div><h2 className="text-xl font-black text-cariri-preto">Encontre o que você precisa</h2><p className="mt-1 text-sm text-cariri-cinza-texto">{filtradas.length} {filtradas.length === 1 ? "anunciante disponível" : "anunciantes disponíveis"}</p></div>
      </div>

      {!filtradas.length ? (
        <div className="mt-5 rounded-2xl border border-dashed border-cariri-verde-claro p-10 text-center"><p className="font-bold text-cariri-preto">Nenhum anúncio encontrado</p><p className="mt-2 text-sm text-cariri-cinza-texto">Tente outra busca ou remova os filtros.</p></div>
      ) : (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtradas.map((p) => <PropagandaCard key={p.id} propaganda={p} />)}
        </div>
      )}
    </div>
  );
}
