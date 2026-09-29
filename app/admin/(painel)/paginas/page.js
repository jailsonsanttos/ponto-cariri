"use client";

import { useEffect, useState } from "react";
import UploadCampo from "@/components/UploadCampo";

const VAZIO = {
  slug: "",
  titulo: "",
  publicada: true,
  seoTitulo: "",
  seoDescricao: "",
  blocos: [{ id: "b1", tipo: "texto", dados: { texto: "" } }],
};

export default function AdminPaginasPage() {
  const [paginas, setPaginas] = useState([]);
  const [form, setForm] = useState(VAZIO);
  const [mensagem, setMensagem] = useState("");

  async function carregar() {
    setPaginas(await (await fetch("/api/cms?recurso=paginas")).json());
  }
  useEffect(() => {
    carregar();
  }, []);

  async function editar(slug) {
    const p = await (await fetch(`/api/cms?recurso=paginas&slug=${slug}`)).json();
    setForm({
      ...VAZIO,
      ...p,
      blocos: p.blocos?.length ? p.blocos : VAZIO.blocos,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function atualizarBloco(i, patch) {
    const blocos = [...form.blocos];
    blocos[i] = { ...blocos[i], ...patch, dados: { ...blocos[i].dados, ...patch.dados } };
    setForm({ ...form, blocos });
  }

  async function salvar(e) {
    e.preventDefault();
    const r = await fetch("/api/cms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recurso: "paginas", dados: form }),
    });
    setMensagem(r.ok ? "Página salva. Use o menu para apontar para /p/" + form.slug : "Erro ao salvar.");
    carregar();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Páginas</h1>
      <p className="text-sm text-cariri-cinza-texto mt-1">
        Sobre fica em /sobre. Outras páginas publicadas ficam em /p/seu-slug
      </p>
      {mensagem && <p className="mt-3 text-sm text-cariri-verde">{mensagem}</p>}

      <form onSubmit={salvar} className="mt-6 border rounded-lg p-5 space-y-3 max-w-2xl">
        <input
          required
          placeholder="slug (sobre, agenda, anuncie)"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          className="w-full border rounded-md px-3 py-2 text-sm"
        />
        <input
          required
          placeholder="Título"
          value={form.titulo}
          onChange={(e) => setForm({ ...form, titulo: e.target.value })}
          className="w-full border rounded-md px-3 py-2 text-sm"
        />
        <input
          placeholder="Título SEO"
          value={form.seoTitulo}
          onChange={(e) => setForm({ ...form, seoTitulo: e.target.value })}
          className="w-full border rounded-md px-3 py-2 text-sm"
        />
        <textarea
          placeholder="Descrição SEO"
          value={form.seoDescricao}
          onChange={(e) => setForm({ ...form, seoDescricao: e.target.value })}
          className="w-full border rounded-md px-3 py-2 text-sm"
        />
        <label className="text-sm flex gap-2">
          <input
            type="checkbox"
            checked={form.publicada}
            onChange={(e) => setForm({ ...form, publicada: e.target.checked })}
          />
          Publicada
        </label>

        {form.blocos.map((b, i) => (
          <div key={b.id || i} className="border rounded-md p-3 space-y-2">
            <select
              value={b.tipo}
              onChange={(e) => atualizarBloco(i, { tipo: e.target.value })}
              className="border rounded-md px-2 py-1 text-sm"
            >
              <option value="titulo">Título</option>
              <option value="texto">Texto</option>
              <option value="imagem">Imagem</option>
              <option value="video">Vídeo</option>
              <option value="botao">Botão</option>
              <option value="galeria">Galeria</option>
            </select>
            {b.tipo === "titulo" && (
              <input
                value={b.dados?.texto || ""}
                onChange={(e) => atualizarBloco(i, { dados: { texto: e.target.value } })}
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
            )}
            {b.tipo === "texto" && (
              <textarea
                rows={5}
                value={b.dados?.texto || ""}
                onChange={(e) => atualizarBloco(i, { dados: { texto: e.target.value } })}
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
            )}
            {b.tipo === "imagem" && (
              <div>
                <UploadCampo onEnviar={(url) => atualizarBloco(i, { dados: { ...b.dados, url } })} />
                {b.dados?.url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={b.dados.url} alt="" className="mt-2 h-24 object-cover rounded" />
                )}
              </div>
            )}
            {b.tipo === "video" && (
              <input
                placeholder="URL do YouTube ou arquivo"
                value={b.dados?.url || ""}
                onChange={(e) => atualizarBloco(i, { dados: { url: e.target.value } })}
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
            )}
            {b.tipo === "botao" && (
              <div className="grid sm:grid-cols-2 gap-2">
                <input
                  placeholder="Texto do botão"
                  value={b.dados?.texto || ""}
                  onChange={(e) => atualizarBloco(i, { dados: { ...b.dados, texto: e.target.value } })}
                  className="border rounded-md px-3 py-2 text-sm"
                />
                <input
                  placeholder="Link"
                  value={b.dados?.url || ""}
                  onChange={(e) => atualizarBloco(i, { dados: { ...b.dados, url: e.target.value } })}
                  className="border rounded-md px-3 py-2 text-sm"
                />
              </div>
            )}
            <button
              type="button"
              className="text-xs text-red-600"
              onClick={() => setForm({ ...form, blocos: form.blocos.filter((_, idx) => idx !== i) })}
            >
              Remover bloco
            </button>
          </div>
        ))}

        <button
          type="button"
          className="text-sm font-semibold text-cariri-verde"
          onClick={() =>
            setForm({
              ...form,
              blocos: [...form.blocos, { id: `b${Date.now()}`, tipo: "texto", dados: { texto: "" } }],
            })
          }
        >
          + Adicionar bloco
        </button>

        <div>
          <button className="bg-cariri-verde text-white px-4 py-2 rounded-md text-sm font-semibold">Salvar página</button>
        </div>
      </form>

      <ul className="mt-8 space-y-2">
        {paginas.map((p) => (
          <li key={p.slug} className="flex justify-between border rounded-md px-3 py-2 text-sm">
            <span>
              {p.titulo} <span className="text-cariri-cinza-texto">/{p.slug}</span>
            </span>
            <span className="flex gap-3">
              <button type="button" onClick={() => editar(p.slug)}>
                Editar
              </button>
              <button
                type="button"
                className="text-red-600"
                onClick={() =>
                  fetch("/api/cms", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ recurso: "paginas", acao: "excluir", slug: p.slug }),
                  }).then(carregar)
                }
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
