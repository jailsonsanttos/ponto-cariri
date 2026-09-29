"use client";

import { useEffect, useState } from "react";
import { gerarSlug } from "@/lib/data";

export default function AdminCategoriasPage() {
  const [itens, setItens] = useState([]);
  const [nome, setNome] = useState("");

  async function carregar() {
    setItens(await (await fetch("/api/cms?recurso=categorias")).json());
  }
  useEffect(() => {
    carregar();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">Categorias de Informações</h1>
      <form
        className="mt-6 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const slug = gerarSlug(nome);
          fetch("/api/cms", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              recurso: "categorias",
              dados: { slug, nome, ordem: itens.length + 1, ativo: true },
            }),
          }).then(() => {
            setNome("");
            carregar();
          });
        }}
      >
        <input
          required
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nova categoria"
          className="border rounded-md px-3 py-2 text-sm"
        />
        <button className="bg-cariri-verde text-white px-4 py-2 rounded-md text-sm">Adicionar</button>
      </form>
      <ul className="mt-6 space-y-2 max-w-lg">
        {itens.map((c) => (
          <li key={c.slug} className="flex justify-between border rounded-md px-3 py-2 text-sm">
            {c.nome}
            <button
              type="button"
              className="text-red-600"
              onClick={() =>
                fetch("/api/cms", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ recurso: "categorias", acao: "excluir", id: c.slug }),
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
