"use client";

import { useEffect, useState } from "react";
import UploadCampo from "@/components/UploadCampo";
import EditorTexto from "@/components/EditorTexto";
import { POSICOES_IMAGEM } from "@/components/ImagemCapa";
import { LAYOUTS_GALERIA, normalizarGaleria } from "@/lib/galeria";

const VAZIO = {
  titulo: "",
  resumo: "",
  conteudo: "",
  imagemCapa: "",
  categoria: "Cultura",
  municipio: "",
  dataPublicacao: new Date().toISOString().slice(0, 10),
  publicada: true,
  destaque: false,
  autor: "",
  fonte: "",
  tags: [],
  seoTitulo: "",
  seoDescricao: "",
  galeria: [],
  videoUrl: "",
  audioUrl: "",
  arquivos: [],
  imagemPosicao: "center center",
  tipo: "informacao",
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
    setForm({ ...VAZIO, ...n, galeria: normalizarGaleria(n.galeria) });
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

  function atualizarImagemGaleria(indice, alteracoes) {
    setForm({
      ...form,
      galeria: (form.galeria || []).map((imagem, i) =>
        i === indice ? { ...imagem, ...alteracoes } : imagem,
      ),
    });
  }

  function removerImagemGaleria(indice) {
    setForm({
      ...form,
      galeria: (form.galeria || []).filter((_, i) => i !== indice),
    });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-cariri-preto">Publicações</h1>
      <p className="text-sm text-cariri-cinza-texto mt-1">
        Informações permanentes ou recentes. Use categorias como Cultura, Agro e Turismo.
      </p>

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
          <EditorTexto
            key={editandoSlug || "novo"}
            value={form.conteudo}
            onChange={(html) => setForm({ ...form, conteudo: html })}
            placeholder="Escreva o conteúdo..."
          />
        </div>

        <UploadCampo
          label="Imagem de capa"
          onEnviar={(url) => setForm({ ...form, imagemCapa: url })}
        />
        {form.imagemCapa && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.imagemCapa}
                alt=""
                className="w-40 h-24 object-cover rounded-md"
                style={{ objectPosition: form.imagemPosicao || "center center" }}
              />
              <button
                type="button"
                onClick={() => setForm({ ...form, imagemCapa: "" })}
                className="text-xs text-red-600 font-medium"
              >
                Remover
              </button>
            </div>
            <label className="block text-sm font-medium">Enquadramento da capa</label>
            <select
              value={form.imagemPosicao || "center center"}
              onChange={(e) => setForm({ ...form, imagemPosicao: e.target.value })}
              className="w-full border border-cariri-verde-claro rounded-md px-3 py-2 text-sm"
            >
              {POSICOES_IMAGEM.map((p) => (
                <option key={p.valor} value={p.valor}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
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
            <label className="block text-sm font-medium mb-1">Município</label>
            <input
              value={form.municipio}
              onChange={(e) => setForm({ ...form, municipio: e.target.value })}
              className="w-full border border-cariri-verde-claro rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Data</label>
            <input
              type="date"
              value={form.dataPublicacao}
              onChange={(e) => setForm({ ...form, dataPublicacao: e.target.value })}
              className="w-full border border-cariri-verde-claro rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Autor</label>
            <input
              value={form.autor || ""}
              onChange={(e) => setForm({ ...form, autor: e.target.value })}
              className="w-full border border-cariri-verde-claro rounded-md px-3 py-2 text-sm"
            />
          </div>
        </div>
        <input
          placeholder="Fonte"
          value={form.fonte || ""}
          onChange={(e) => setForm({ ...form, fonte: e.target.value })}
          className="w-full border border-cariri-verde-claro rounded-md px-3 py-2 text-sm"
        />
        <input
          placeholder="Título SEO"
          value={form.seoTitulo || ""}
          onChange={(e) => setForm({ ...form, seoTitulo: e.target.value })}
          className="w-full border border-cariri-verde-claro rounded-md px-3 py-2 text-sm"
        />
        <textarea
          placeholder="Descrição SEO"
          value={form.seoDescricao || ""}
          onChange={(e) => setForm({ ...form, seoDescricao: e.target.value })}
          className="w-full border border-cariri-verde-claro rounded-md px-3 py-2 text-sm"
        />
        <UploadCampo
          label="Adicionar imagem à galeria"
          onEnviar={(url) =>
            setForm({
              ...form,
              galeria: [
                ...(form.galeria || []),
                { url, posicao: "center center", layout: "grade", alt: "", legenda: "" },
              ],
            })
          }
        />
        {(form.galeria || []).length > 0 && (
          <div className="space-y-4 rounded-md border border-cariri-verde-claro p-4">
            <div>
              <p className="text-sm font-semibold text-cariri-preto">Imagens da galeria</p>
              <p className="mt-1 text-xs text-cariri-cinza-texto">
                Cada imagem pode ter seu próprio enquadramento e posição na publicação.
              </p>
            </div>
            {normalizarGaleria(form.galeria).map((imagem, i) => (
              <div key={`${imagem.url}-${i}`} className="grid gap-3 border-t border-cariri-verde-claro pt-4 sm:grid-cols-[8rem_1fr]">
                <div className="relative h-24 w-32 overflow-hidden rounded-md bg-cariri-verde-claro">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagem.url}
                    alt={imagem.alt || "Prévia da galeria"}
                    className="h-full w-full object-cover"
                    style={{ objectPosition: imagem.posicao }}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-cariri-cinza-texto">Imagem {i + 1}</span>
                    <button
                      type="button"
                      onClick={() => removerImagemGaleria(i)}
                      className="text-xs font-medium text-red-600"
                    >
                      Remover
                    </button>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <label className="text-xs font-medium text-cariri-preto">
                      Enquadramento
                      <select
                        value={imagem.posicao}
                        onChange={(e) => atualizarImagemGaleria(i, { posicao: e.target.value })}
                        className="mt-1 w-full border border-cariri-verde-claro rounded-md px-2 py-1.5 text-sm font-normal"
                      >
                        {POSICOES_IMAGEM.map((p) => (
                          <option key={p.valor} value={p.valor}>{p.label}</option>
                        ))}
                      </select>
                    </label>
                    <label className="text-xs font-medium text-cariri-preto">
                      Posição na publicação
                      <select
                        value={imagem.layout}
                        onChange={(e) => atualizarImagemGaleria(i, { layout: e.target.value })}
                        className="mt-1 w-full border border-cariri-verde-claro rounded-md px-2 py-1.5 text-sm font-normal"
                      >
                        {LAYOUTS_GALERIA.map((layout) => (
                          <option key={layout.valor} value={layout.valor}>{layout.label}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <input
                    value={imagem.alt}
                    onChange={(e) => atualizarImagemGaleria(i, { alt: e.target.value })}
                    placeholder="Texto alternativo da imagem (SEO e acessibilidade)"
                    className="w-full border border-cariri-verde-claro rounded-md px-2 py-1.5 text-xs"
                  />
                  <input
                    value={imagem.legenda}
                    onChange={(e) => atualizarImagemGaleria(i, { legenda: e.target.value })}
                    placeholder="Legenda opcional"
                    className="w-full border border-cariri-verde-claro rounded-md px-2 py-1.5 text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
        <input
          placeholder="URL de vídeo (YouTube ou arquivo)"
          value={form.videoUrl || ""}
          onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
          className="w-full border border-cariri-verde-claro rounded-md px-3 py-2 text-sm"
        />
        <UploadCampo
          label="Áudio"
          tipoAceito="audio/*"
          onEnviar={(url) => setForm({ ...form, audioUrl: url })}
        />
        <UploadCampo
          label="PDF ou documento"
          tipoAceito=".pdf,.doc,.docx,.xls,.xlsx"
          onEnviar={(url) => setForm({ ...form, arquivos: [...(form.arquivos || []), { url, nome: "Arquivo" }] })}
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.publicada}
            onChange={(e) => setForm({ ...form, publicada: e.target.checked })}
          />
          Publicada (visível no site)
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.destaque || false}
            onChange={(e) => setForm({ ...form, destaque: e.target.checked })}
          />
          Destacar esta notícia na página inicial (matéria principal)
        </label>

        <div className="flex gap-3">
          <button type="submit" className="bg-cariri-verde text-white font-semibold px-5 py-2 rounded-md hover:bg-cariri-verde-escuro">
            {editandoSlug ? "Salvar alterações" : "Publicar"}
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
        <h2 className="font-semibold text-cariri-preto mb-2">Cadastradas</h2>
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
