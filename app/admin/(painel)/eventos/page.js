"use client";

import { useEffect, useState } from "react";
import UploadCampo from "@/components/UploadCampo";

const VAZIO = {
  titulo: "",
  resumo: "",
  municipio: "",
  local: "",
  dataInicio: "",
  dataFim: "",
  imagem: "",
  publicado: true,
};

export default function AdminEventosPage() {
  const [itens, setItens] = useState([]);
  const [form, setForm] = useState(VAZIO);

  async function carregar() {
    setItens(await (await fetch("/api/cms?recurso=eventos")).json());
  }
  useEffect(() => {
    carregar();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">Eventos</h1>
      <form
        className="mt-6 space-y-3 max-w-xl"
        onSubmit={(e) => {
          e.preventDefault();
          fetch("/api/cms", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ recurso: "eventos", dados: form }),
          }).then(() => {
            setForm(VAZIO);
            carregar();
          });
        }}
      >
        <input
          required
          placeholder="Título"
          value={form.titulo}
          onChange={(e) => setForm({ ...form, titulo: e.target.value })}
          className="w-full border rounded-md px-3 py-2 text-sm"
        />
        <textarea
          placeholder="Resumo"
          value={form.resumo}
          onChange={(e) => setForm({ ...form, resumo: e.target.value })}
          className="w-full border rounded-md px-3 py-2 text-sm"
        />
        <input
          placeholder="Município"
          value={form.municipio}
          onChange={(e) => setForm({ ...form, municipio: e.target.value })}
          className="w-full border rounded-md px-3 py-2 text-sm"
        />
        <input
          placeholder="Local"
          value={form.local}
          onChange={(e) => setForm({ ...form, local: e.target.value })}
          className="w-full border rounded-md px-3 py-2 text-sm"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="date"
            value={form.dataInicio}
            onChange={(e) => setForm({ ...form, dataInicio: e.target.value })}
            className="border rounded-md px-3 py-2 text-sm"
          />
          <input
            type="date"
            value={form.dataFim}
            onChange={(e) => setForm({ ...form, dataFim: e.target.value })}
            className="border rounded-md px-3 py-2 text-sm"
          />
        </div>
        <UploadCampo onEnviar={(url) => setForm({ ...form, imagem: url })} />
        <button className="bg-cariri-verde text-white px-4 py-2 rounded-md text-sm font-semibold">Salvar evento</button>
      </form>

      <ul className="mt-8 space-y-2">
        {itens.map((ev) => (
          <li key={ev.id} className="border rounded-md px-3 py-2 flex justify-between text-sm">
            <span>
              {ev.titulo} — {ev.dataInicio} {ev.municipio}
            </span>
            <button
              type="button"
              className="text-red-600"
              onClick={() =>
                fetch("/api/cms", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ recurso: "eventos", acao: "excluir", id: ev.id }),
                }).then(carregar)
              }
            >
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
