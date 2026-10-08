"use client";

import { useMemo, useState } from "react";

const NOMES_CATEGORIA = {
  agricola: "Agrícola",
  combustivel: "Combustível",
  alimento: "Alimento",
  outro: "Outro",
};

function formatarPreco(valor) {
  if (valor == null) return "—";
  return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatarData(data) {
  return data ? new Date(`${data}T12:00:00`).toLocaleDateString("pt-BR") : "—";
}

export default function PrecosCliente({ precos = [] }) {
  const [busca, setBusca] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [categoria, setCategoria] = useState("");

  const municipios = useMemo(
    () => [...new Set(precos.map((p) => p.municipio).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    [precos],
  );
  const categorias = useMemo(
    () => [...new Set(precos.map((p) => p.categoria).filter(Boolean))].sort(),
    [precos],
  );
  const filtrados = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");
    return precos.filter((p) => {
      const texto = `${p.produto} ${p.municipio} ${p.fonte}`.toLocaleLowerCase("pt-BR");
      return (!termo || texto.includes(termo)) && (!municipio || p.municipio === municipio) && (!categoria || p.categoria === categoria);
    });
  }, [busca, categoria, municipio, precos]);

  const ultimaData = precos[0]?.data;

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-cariri-verde-claro p-5">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-cariri-verde">Registros</p>
          <p className="mt-2 text-3xl font-black text-cariri-preto">{precos.length}</p>
          <p className="mt-1 text-sm text-cariri-cinza-texto">preços cadastrados</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-cariri-verde">Municípios</p>
          <p className="mt-2 text-3xl font-black text-cariri-preto">{municipios.length}</p>
          <p className="mt-1 text-sm text-cariri-cinza-texto">com dados disponíveis</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-cariri-verde">Atualização</p>
          <p className="mt-2 text-3xl font-black text-cariri-preto">{formatarData(ultimaData)}</p>
          <p className="mt-1 text-sm text-cariri-cinza-texto">registro mais recente</p>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-cariri-verde-claro bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <label className="flex-1">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-cariri-cinza-texto">Buscar produto ou fonte</span>
            <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Ex.: mandioca, gasolina..." className="w-full rounded-xl border border-cariri-verde-claro bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cariri-verde focus:ring-2 focus:ring-cariri-verde/20" />
          </label>
          <label className="lg:w-56">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-cariri-cinza-texto">Município</span>
            <select value={municipio} onChange={(e) => setMunicipio(e.target.value)} className="w-full rounded-xl border border-cariri-verde-claro bg-slate-50 px-4 py-3 text-sm outline-none focus:border-cariri-verde">
              <option value="">Todos os municípios</option>
              {municipios.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="lg:w-48">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-cariri-cinza-texto">Categoria</span>
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="w-full rounded-xl border border-cariri-verde-claro bg-slate-50 px-4 py-3 text-sm outline-none focus:border-cariri-verde">
              <option value="">Todas</option>
              {categorias.map((item) => <option key={item} value={item}>{NOMES_CATEGORIA[item] || item}</option>)}
            </select>
          </label>
        </div>
        {(busca || municipio || categoria) && <button type="button" onClick={() => { setBusca(""); setMunicipio(""); setCategoria(""); }} className="mt-3 text-xs font-bold text-cariri-verde hover:underline">Limpar filtros</button>}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <div><h2 className="text-xl font-black text-cariri-preto">Valores informados</h2><p className="mt-1 text-sm text-cariri-cinza-texto">{filtrados.length} {filtrados.length === 1 ? "resultado encontrado" : "resultados encontrados"}</p></div>
      </div>

      {!filtrados.length ? (
        <div className="mt-5 rounded-2xl border border-dashed border-cariri-verde-claro p-10 text-center"><p className="font-bold text-cariri-preto">Nenhum preço encontrado</p><p className="mt-2 text-sm text-cariri-cinza-texto">Tente remover ou alterar os filtros da busca.</p></div>
      ) : (
        <div className="mt-5 overflow-hidden rounded-2xl border border-cariri-verde-claro bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-sm">
              <thead className="bg-cariri-verde-claro text-left text-xs uppercase tracking-wide text-cariri-verde-escuro">
                <tr><th className="px-4 py-3 font-bold">Produto</th><th className="px-4 py-3 font-bold">Município</th><th className="px-4 py-3 font-bold">Categoria</th><th className="px-4 py-3 font-bold">Preço</th><th className="px-4 py-3 font-bold">Data / fonte</th></tr>
              </thead>
              <tbody>
                {filtrados.map((p) => (
                  <tr key={p.id} className="border-t border-cariri-verde-claro/70 transition hover:bg-cariri-verde-claro/30">
                    <td className="px-4 py-4"><p className="font-bold text-cariri-preto">{p.produto}</p>{p.unidade && <p className="mt-0.5 text-xs text-cariri-cinza-texto">por {p.unidade}</p>}</td>
                    <td className="px-4 py-4 text-cariri-cinza-texto">{p.municipio || "—"}</td>
                    <td className="px-4 py-4"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-cariri-cinza-texto">{NOMES_CATEGORIA[p.categoria] || p.categoria || "Outro"}</span></td>
                    <td className="px-4 py-4 text-base font-black text-cariri-verde">{formatarPreco(p.preco)}</td>
                    <td className="px-4 py-4 text-xs text-cariri-cinza-texto"><p>{formatarData(p.data)}</p><p className="mt-1 max-w-[180px] truncate" title={p.fonte || "Fonte não informada"}>{p.fonte || "Fonte não informada"}</p></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
