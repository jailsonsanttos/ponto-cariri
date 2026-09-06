"use client";

import { useEffect, useState } from "react";
import UploadCampo from "@/components/UploadCampo";

const VAZIO = {
  nome: "",
  categoria: "Loja",
  descricao: "",
  telefone: "",
  municipio: "",
  fotos: [],
  video: "",
  ativo: true,
};

const CATEGORIAS = ["Loja", "Supermercado", "Farmácia", "Restaurante", "Outros"];

export default function AdminPropagandaPage() {
  const [propagandas, setPropagandas] = useState([]);
  const [form, setForm] = useState(VAZIO);
  const [editandoId, setEditandoId] = useState(null);
  const [mensagem, setMensagem] = useState("");

  async function carregar() {
    const resposta = await fetch("/api/propaganda");
    setPropagandas(await resposta.json());
  }

  useEffect(() => {
    carregar();
  }, []);

  function comecarEdicao(p) {
    setEditandoId(p.id);
    setForm({ ...VAZIO, ...p });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setForm(VAZIO);
  }

  async function salvar(e) {
    e.preventDefault();
    setMensagem("");

    const url = editandoId ? `/api/propaganda/${editandoId}` : "/api/propaganda";
    const metodo = editandoId ? "PUT" : "POST";

    const resposta = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (resposta.ok) {
      setMensagem(editandoId ? "Anúncio atualizado!" : "Anúncio criado!");
      cancelarEdicao();
      carregar();
    } else {
      setMensagem("Erro ao salvar.");
    }
  }

  async function excluir(id) {
    if (!confirm("Tem certeza que deseja excluir este anúncio?")) return;
    await fetch(`/api/propaganda/${id}`, { method: "DELETE" });
    carregar();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-cariri-preto">Propaganda / Anúncios</h1>

      <form onSubmit={salvar} className="mt-6 border border-cariri-verde-claro rounded-lg p-5 space-y-4 max-w-2xl">
        <h2 className="font-semibold text-cariri-preto">
          {editandoId ? "Editando anúncio" : "Novo anúncio"}
        </h2>

        <div>
          <label className="block text-sm font-medium mb-1">Nome do estabelecimento</label>
          <input
            required
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            className="w-full border border-cariri-verde-claro rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Categoria</label>
            <select
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })}
              className="w-full border border-cariri-verde-claro rounded-md px-3 py-2 text-sm"
            >
              {CATEGORIAS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">WhatsApp/Telefone</label>
            <input
              value={form.telefone}
              onChange={(e) => setForm({ ...form, telefone: e.target.value })}
              placeholder="88999999999"
              className="w-full border border-cariri-verde-claro rounded-md px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descrição</label>
          <textarea
            rows={4}
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            className="w-full border border-cariri-verde-claro rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Link de vídeo (opcional)</label>
          <input
            value={form.video}
            onChange={(e) => setForm({ ...form, video: e.target.value })}
            className="w-full border border-cariri-verde-claro rounded-md px-3 py-2 text-sm"
          />
        </div>

        <UploadCampo
          label="Adicionar foto"
          onEnviar={(url) => setForm({ ...form, fotos: [...form.fotos, url] })}
        />
        {form.fotos.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {form.fotos.map((foto, i) => (
              <div key={i} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={foto} alt="" className="w-20 h-20 object-cover rounded-md" />
                <button
                  type="button"
                  onClick={() => setForm({ ...form, fotos: form.fotos.filter((_, idx) => idx !== i) })}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.ativo}
            onChange={(e) => setForm({ ...form, ativo: e.target.checked })}
          />
          Anúncio ativo (visível no site)
        </label>

        <div className="flex gap-3">
          <button type="submit" className="bg-cariri-verde text-white font-semibold px-5 py-2 rounded-md hover:bg-cariri-verde-escuro">
            {editandoId ? "Salvar alterações" : "Criar anúncio"}
          </button>
          {editandoId && (
            <button type="button" onClick={cancelarEdicao} className="px-5 py-2 rounded-md border border-cariri-verde-claro">
              Cancelar
            </button>
          )}
        </div>

        {mensagem && <p className="text-sm text-cariri-verde-escuro">{mensagem}</p>}
      </form>

      <div className="mt-10 space-y-2">
        <h2 className="font-semibold text-cariri-preto mb-2">Anúncios cadastrados</h2>
        {propagandas.map((p) => (
          <div key={p.id} className="flex items-center justify-between border border-cariri-verde-claro rounded-md px-4 py-3">
            <span className="text-sm">
              {p.nome} <span className="text-cariri-cinza-texto">({p.categoria})</span>
              {!p.ativo && <em className="text-cariri-cinza-texto"> — inativo</em>}
            </span>
            <div className="flex gap-3">
              <button onClick={() => comecarEdicao(p)} className="text-sm text-cariri-verde font-medium">Editar</button>
              <button onClick={() => excluir(p.id)} className="text-sm text-red-600 font-medium">Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
