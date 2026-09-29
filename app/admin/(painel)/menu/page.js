"use client";

import { useEffect, useState } from "react";

async function cms(corpo) {
  const r = await fetch("/api/cms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(corpo),
  });
  return r.json();
}

export default function AdminMenuPage() {
  const [itens, setItens] = useState([]);
  const [form, setForm] = useState({
    label: "",
    href: "",
    parentId: "",
    ordem: 0,
    visivel: true,
  });
  const [mensagem, setMensagem] = useState("");

  async function carregar() {
    const r = await fetch("/api/cms?recurso=menu");
    setItens(await r.json());
  }

  useEffect(() => {
    carregar();
  }, []);

  const raizes = itens.filter((i) => !i.parentId);

  async function salvar(e) {
    e.preventDefault();
    await cms({ recurso: "menu", dados: form });
    setForm({ label: "", href: "", parentId: "", ordem: itens.length + 1, visivel: true });
    setMensagem("Menu atualizado.");
    carregar();
  }

  async function mover(item, direcao) {
    await cms({ recurso: "menu", dados: { ...item, ordem: item.ordem + direcao } });
    carregar();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Menu do site</h1>
      <p className="text-sm text-cariri-cinza-texto mt-1">
        Crie botões, submenus e altere a ordem. O visitante vê só o que estiver visível.
      </p>
      {mensagem && <p className="mt-3 text-sm text-cariri-verde">{mensagem}</p>}

      <form onSubmit={salvar} className="mt-6 border border-cariri-verde-claro rounded-lg p-5 space-y-3 max-w-xl">
        <input
          required
          placeholder="Nome do botão"
          value={form.label}
          onChange={(e) => setForm({ ...form, label: e.target.value })}
          className="w-full border rounded-md px-3 py-2 text-sm"
        />
        <input
          placeholder="Link (ex: /informacoes ou /p/agenda)"
          value={form.href}
          onChange={(e) => setForm({ ...form, href: e.target.value })}
          className="w-full border rounded-md px-3 py-2 text-sm"
        />
        <select
          value={form.parentId}
          onChange={(e) => setForm({ ...form, parentId: e.target.value })}
          className="w-full border rounded-md px-3 py-2 text-sm"
        >
          <option value="">Item principal</option>
          {raizes.map((r) => (
            <option key={r.id} value={r.id}>
              Submenu de {r.label}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.visivel}
            onChange={(e) => setForm({ ...form, visivel: e.target.checked })}
          />
          Visível
        </label>
        <button className="bg-cariri-verde text-white px-4 py-2 rounded-md text-sm font-semibold">Salvar item</button>
      </form>

      <ul className="mt-8 space-y-2 max-w-xl">
        {itens.map((item) => (
          <li key={item.id} className="flex items-center justify-between border rounded-md px-3 py-2 text-sm">
            <span>
              {item.parentId ? "↳ " : ""}
              <strong>{item.label}</strong> <span className="text-cariri-cinza-texto">{item.href}</span>
              {!item.visivel && <em className="ml-2 text-xs">oculto</em>}
            </span>
            <span className="flex gap-2">
              <button type="button" onClick={() => mover(item, -1)}>
                ↑
              </button>
              <button type="button" onClick={() => mover(item, 1)}>
                ↓
              </button>
              <button
                type="button"
                className="text-red-600"
                onClick={() => cms({ recurso: "menu", acao: "excluir", id: item.id }).then(carregar)}
              >
                Excluir
              </button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
