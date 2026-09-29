"use client";

import { useEffect, useState } from "react";

const VAZIO = {
  municipio: "",
  produto: "",
  categoria: "agricola",
  preco: "",
  unidade: "",
  data: new Date().toISOString().slice(0, 10),
  fonte: "",
};

export default function AdminPrecosPage() {
  const [itens, setItens] = useState([]);
  const [form, setForm] = useState(VAZIO);

  async function carregar() {
    setItens(await (await fetch("/api/cms?recurso=precos")).json());
  }
  useEffect(() => {
    carregar();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">Preços do Cariri</h1>
      <p className="text-sm text-cariri-cinza-texto mt-1">
        Sempre informe município, data e fonte. O site deixa claro que o valor não é universal.
      </p>
      <form
        className="mt-6 grid sm:grid-cols-2 gap-3 max-w-2xl"
        onSubmit={(e) => {
          e.preventDefault();
          fetch("/api/cms", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ recurso: "precos", dados: form }),
          }).then(() => {
            setForm(VAZIO);
            carregar();
          });
        }}
      >
        <input
          required
          placeholder="Município"
          value={form.municipio}
          onChange={(e) => setForm({ ...form, municipio: e.target.value })}
          className="border rounded-md px-3 py-2 text-sm"
        />
        <input
          required
          placeholder="Produto (mandioca, gasolina…)"
          value={form.produto}
          onChange={(e) => setForm({ ...form, produto: e.target.value })}
          className="border rounded-md px-3 py-2 text-sm"
        />
        <select
          value={form.categoria}
          onChange={(e) => setForm({ ...form, categoria: e.target.value })}
          className="border rounded-md px-3 py-2 text-sm"
        >
          <option value="agricola">Agrícola</option>
          <option value="combustivel">Combustível</option>
          <option value="alimento">Alimento</option>
          <option value="outro">Outro</option>
        </select>
        <input
          required
          type="number"
          step="0.01"
          placeholder="Preço"
          value={form.preco}
          onChange={(e) => setForm({ ...form, preco: e.target.value })}
          className="border rounded-md px-3 py-2 text-sm"
        />
        <input
          placeholder="Unidade (kg, litro, saca)"
          value={form.unidade}
          onChange={(e) => setForm({ ...form, unidade: e.target.value })}
          className="border rounded-md px-3 py-2 text-sm"
        />
        <input
          type="date"
          value={form.data}
          onChange={(e) => setForm({ ...form, data: e.target.value })}
          className="border rounded-md px-3 py-2 text-sm"
        />
        <input
          required
          placeholder="Fonte"
          value={form.fonte}
          onChange={(e) => setForm({ ...form, fonte: e.target.value })}
          className="sm:col-span-2 border rounded-md px-3 py-2 text-sm"
        />
        <button className="bg-cariri-verde text-white px-4 py-2 rounded-md text-sm font-semibold">Salvar preço</button>
      </form>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left bg-cariri-verde-claro">
              <th className="p-2">Município</th>
              <th className="p-2">Produto</th>
              <th className="p-2">Preço</th>
              <th className="p-2">Data</th>
              <th className="p-2">Fonte</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {itens.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-2">{p.municipio}</td>
                <td className="p-2">
                  {p.produto} {p.unidade ? `(${p.unidade})` : ""}
                </td>
                <td className="p-2">{p.preco}</td>
                <td className="p-2">{p.data}</td>
                <td className="p-2">{p.fonte}</td>
                <td className="p-2">
                  <button
                    type="button"
                    className="text-red-600"
                    onClick={() =>
                      fetch("/api/cms", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ recurso: "precos", acao: "excluir", id: p.id }),
                      }).then(carregar)
                    }
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
