"use client";

import { useEffect, useState } from "react";
import UploadCampo from "@/components/UploadCampo";

const VAZIO = {
  nome: "",
  descricaoCurta: "",
  historia: "",
  hinoUrl: "",
  latitude: "",
  longitude: "",
  fotos: [],
  videos: [],
  links: [],
};

export default function AdminMunicipiosPage() {
  const [municipios, setMunicipios] = useState([]);
  const [form, setForm] = useState(VAZIO);
  const [editandoSlug, setEditandoSlug] = useState(null);
  const [mensagem, setMensagem] = useState("");

  async function carregar() {
    const resposta = await fetch("/api/municipios");
    setMunicipios(await resposta.json());
  }

  useEffect(() => {
    carregar();
  }, []);

  function comecarEdicao(m) {
    setEditandoSlug(m.slug);
    setForm({
      nome: m.nome,
      descricaoCurta: m.descricaoCurta,
      historia: m.historia,
      hinoUrl: m.hinoUrl,
      latitude: m.latitude ?? "",
      longitude: m.longitude ?? "",
      fotos: m.fotos || [],
      videos: m.videos || [],
      links: m.links || [],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelarEdicao() {
    setEditandoSlug(null);
    setForm(VAZIO);
  }

  async function salvar(e) {
    e.preventDefault();
    setMensagem("");

    const url = editandoSlug ? `/api/municipios/${editandoSlug}` : "/api/municipios";
    const metodo = editandoSlug ? "PUT" : "POST";

    const resposta = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (resposta.ok) {
      setMensagem(editandoSlug ? "Município atualizado!" : "Município criado!");
      cancelarEdicao();
      carregar();
    } else {
      const dados = await resposta.json();
      setMensagem(dados.erro || "Erro ao salvar.");
    }
  }

  async function excluir(slug) {
    if (!confirm("Tem certeza que deseja excluir este município?")) return;
    await fetch(`/api/municipios/${slug}`, { method: "DELETE" });
    carregar();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-cariri-preto">Municípios</h1>

      <form onSubmit={salvar} className="mt-6 border border-cariri-verde-claro rounded-lg p-5 space-y-4 max-w-2xl">
        <h2 className="font-semibold text-cariri-preto">
          {editandoSlug ? `Editando: ${editandoSlug}` : "Novo município"}
        </h2>

        <div>
          <label className="block text-sm font-medium mb-1">Nome do município</label>
          <input
            required
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            className="w-full border border-cariri-verde-claro rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descrição curta</label>
          <input
            value={form.descricaoCurta}
            onChange={(e) => setForm({ ...form, descricaoCurta: e.target.value })}
            className="w-full border border-cariri-verde-claro rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">História</label>
          <textarea
            rows={5}
            value={form.historia}
            onChange={(e) => setForm({ ...form, historia: e.target.value })}
            className="w-full border border-cariri-verde-claro rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Link do hino (YouTube, áudio, etc.)</label>
          <input
            value={form.hinoUrl}
            onChange={(e) => setForm({ ...form, hinoUrl: e.target.value })}
            className="w-full border border-cariri-verde-claro rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Latitude</label>
            <input
              value={form.latitude}
              onChange={(e) => setForm({ ...form, latitude: e.target.value })}
              className="w-full border border-cariri-verde-claro rounded-md px-3 py-2 text-sm"
              placeholder="-7.2130"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Longitude</label>
            <input
              value={form.longitude}
              onChange={(e) => setForm({ ...form, longitude: e.target.value })}
              className="w-full border border-cariri-verde-claro rounded-md px-3 py-2 text-sm"
              placeholder="-39.3151"
            />
          </div>
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

        <div>
          <label className="block text-sm font-medium mb-1">Vídeos (link do YouTube ou outro)</label>
          <div className="flex gap-2">
            <input
              id="campo-novo-video"
              placeholder="https://youtube.com/watch?v=..."
              className="flex-1 border border-cariri-verde-claro rounded-md px-3 py-2 text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const valor = e.currentTarget.value.trim();
                  if (valor) {
                    setForm({ ...form, videos: [...form.videos, valor] });
                    e.currentTarget.value = "";
                  }
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                const campo = document.getElementById("campo-novo-video");
                const valor = campo.value.trim();
                if (valor) {
                  setForm({ ...form, videos: [...form.videos, valor] });
                  campo.value = "";
                }
              }}
              className="px-4 py-2 rounded-md border border-cariri-verde-claro text-sm font-medium"
            >
              Adicionar
            </button>
          </div>
          {form.videos.length > 0 && (
            <ul className="mt-2 space-y-1">
              {form.videos.map((v, i) => (
                <li key={i} className="flex items-center justify-between text-xs bg-cariri-verde-claro/50 rounded-md px-3 py-1.5">
                  <span className="truncate">{v}</span>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, videos: form.videos.filter((_, idx) => idx !== i) })}
                    className="text-red-600 font-medium ml-2 shrink-0"
                  >
                    Remover
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Links úteis</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              id="campo-novo-link-titulo"
              placeholder="Título do link"
              className="border border-cariri-verde-claro rounded-md px-3 py-2 text-sm"
            />
            <input
              id="campo-novo-link-url"
              placeholder="https://..."
              className="border border-cariri-verde-claro rounded-md px-3 py-2 text-sm"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              const campoTitulo = document.getElementById("campo-novo-link-titulo");
              const campoUrl = document.getElementById("campo-novo-link-url");
              const url = campoUrl.value.trim();
              if (url) {
                setForm({
                  ...form,
                  links: [...form.links, { titulo: campoTitulo.value.trim(), url }],
                });
                campoTitulo.value = "";
                campoUrl.value = "";
              }
            }}
            className="mt-2 px-4 py-2 rounded-md border border-cariri-verde-claro text-sm font-medium"
          >
            Adicionar link
          </button>
          {form.links.length > 0 && (
            <ul className="mt-2 space-y-1">
              {form.links.map((l, i) => (
                <li key={i} className="flex items-center justify-between text-xs bg-cariri-verde-claro/50 rounded-md px-3 py-1.5">
                  <span className="truncate">{l.titulo || l.url}</span>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, links: form.links.filter((_, idx) => idx !== i) })}
                    className="text-red-600 font-medium ml-2 shrink-0"
                  >
                    Remover
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex gap-3">
          <button type="submit" className="bg-cariri-verde text-white font-semibold px-5 py-2 rounded-md hover:bg-cariri-verde-escuro">
            {editandoSlug ? "Salvar alterações" : "Criar município"}
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
        <h2 className="font-semibold text-cariri-preto mb-2">Municípios cadastrados</h2>
        {municipios.map((m) => (
          <div key={m.slug} className="flex items-center justify-between border border-cariri-verde-claro rounded-md px-4 py-3">
            <span className="text-sm">{m.nome}</span>
            <div className="flex gap-3">
              <button onClick={() => comecarEdicao(m)} className="text-sm text-cariri-verde font-medium">Editar</button>
              <button onClick={() => excluir(m.slug)} className="text-sm text-red-600 font-medium">Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
