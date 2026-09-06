"use client";

import { useEffect, useState } from "react";
import UploadCampo from "@/components/UploadCampo";

const VAZIO = {
  titulo: "",
  resumo: "",
  conteudo: "",
  imagemCapa: "",
  categoria: "Geral",
  municipio: "",
  dataPublicacao: new Date().toISOString().slice(0, 10),
  publicada: true,
};

export default function AdminNoticiasPage() {
  const [noticias, setNoticias] = useState([]);
  const [form, setForm] = useState(VAZIO);
  const [editandoSlug, setEditandoSlug] = useState(null);
  const [mensagem, setMensagem] = useState("");

  async function carregar() {
    const resposta = await fetch("/api/noticias");
    setNoticias(await resposta.json());
  }

  useEffect(() => {
    carregar();
  }, []);

  function comecarEdicao(n) {
    setEditandoSlug(n.slug);
    setForm({ ...VAZIO, ...n });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelarEdicao() {
    setEditandoSlug(null);
    setForm(VAZIO);
  }

  async function salvar(e) {
    e.preventDefault();
    setMensagem("");

    const url = editandoSlug ? `/api/noticias/${editandoSlug}` : "/api/noticias";
    const metodo = editandoSlug ? "PUT" : "POST";

    const resposta = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (resposta.ok) {
      setMensagem(editandoSlug ? "Notícia atualizada!" : "Notícia publicada!");
      cancelarEdicao();
      carregar();
    } else {
      setMensagem("Erro ao salvar.");
    }
  }

  async function excluir(slug) {
    if (!confirm("Tem certeza que deseja excluir esta notícia?")) return;
    await fetch(`/api/noticias/${slug}`, { method: "DELETE" });
    carregar();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-cariri-preto">Notícias</h1>

      <form onSubmit={salvar} className="mt-6 border border-cariri-verde-claro rounded-lg p-5 space-y-4 max-w-2xl">
        <h2 className="font-semibold text-cariri-preto">
          {editandoSlug ? `Editando: ${editandoSlug}` : "Nova notícia"}
        </h2>

        <div>
          <label className="block text-sm font-medium mb-1">Título</label>
          <input
            required
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
            className="w-full border border-cariri-verde-claro rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Resumo</label>
          <input
            value={form.resumo}
            onChange={(e) => setForm({ ...form, resumo: e.target.value })}
            className="w-full border border-cariri-verde-claro rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Conteúdo completo</label>
          <textarea
            rows={6}
            value={form.conteudo}
            onChange={(e) => setForm({ ...form, conteudo: e.target.value })}
            className="w-full border border-cariri-verde-claro rounded-md px-3 py-2 text-sm"
          />
        </div>

        <UploadCampo
          label="Imagem de capa"
          onEnviar={(url) => setForm({ ...form, imagemCapa: url })}
        />
        {form.imagemCapa && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={form.imagemCapa} alt="" className="w-32 h-20 object-cover rounded-md" />
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Categoria</label>
            <input
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })}
              className="w-full border border-cariri-verde-claro rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Data de publicação</label>
            <input
              type="date"
              value={form.dataPublicacao}
              onChange={(e) => setForm({ ...form, dataPublicacao: e.target.value })}
              className="w-full border border-cariri-verde-claro rounded-md px-3 py-2 text-sm"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.publicada}
            onChange={(e) => setForm({ ...form, publicada: e.target.checked })}
          />
          Notícia publicada (visível no site)
        </label>

        <div className="flex gap-3">
          <button type="submit" className="bg-cariri-verde text-white font-semibold px-5 py-2 rounded-md hover:bg-cariri-verde-escuro">
            {editandoSlug ? "Salvar alterações" : "Publicar notícia"}
          </button>
          {editandoSlug && (
            <button type="button" onClick={cancelarEdicao} className="px-5 py-2 rounded-md border border-cariri-verde-claro">
              Cancelar
            </button>
          )}
        </div>

        {mensagem && <p className="text-sm text-cariri-verde-escuro">{mensagem}</p>}
      </form>

      <div className="mt-10 space-y-2">
        <h2 className="font-semibold text-cariri-preto mb-2">Notícias cadastradas</h2>
        {noticias.map((n) => (
          <div key={n.slug} className="flex items-center justify-between border border-cariri-verde-claro rounded-md px-4 py-3">
            <span className="text-sm">
              {n.titulo} {!n.publicada && <em className="text-cariri-cinza-texto">(rascunho)</em>}
            </span>
            <div className="flex gap-3">
              <button onClick={() => comecarEdicao(n)} className="text-sm text-cariri-verde font-medium">Editar</button>
              <button onClick={() => excluir(n.slug)} className="text-sm text-red-600 font-medium">Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
