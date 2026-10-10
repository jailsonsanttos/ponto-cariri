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
  mapaUrl: "",
  fotos: [],
  videos: [],
  links: [],
  populacao: "",
  secoes: { cultura: "", turismo: "", agro: "", economia: "", educacao: "", saude: "", eventos: "", dados: "" },
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
      mapaUrl: "",
      fotos: m.fotos || [],
      videos: m.videos || [],
      links: m.links || [],
      populacao: m.populacao || "",
      secoes: {
        cultura: "",
        turismo: "",
        agro: "",
        economia: "",
        educacao: "",
        saude: "",
        eventos: "",
        dados: "",
        ...(m.secoes || {}),
      },
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

  function aplicarLinkMapa() {
    const valor = (form.mapaUrl || "").trim();
    const coordenadas = valor.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/) || valor.match(/[?&](?:q|ll)=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
    if (!coordenadas) {
      setMensagem("Cole um link do Google Maps contendo as coordenadas, por exemplo: https://maps.google.com/?q=-7.23,-39.31");
      return;
    }
    setForm({ ...form, latitude: coordenadas[1], longitude: coordenadas[2] });
    setMensagem("Coordenadas preenchidas a partir do mapa. Salve o município para confirmar.");
  }

  function tipoHino(url) {
    const limpo = (url || "").split("?")[0].toLowerCase();
    if (/\.(mp3|wav|ogg|oga|m4a|aac)$/.test(limpo)) return "audio";
    if (/\.(mp4|webm|mov|m4v)$/.test(limpo)) return "video";
    return "link";
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
          <label className="block text-sm font-medium mb-1">População (texto livre)</label>
          <input
            value={form.populacao || ""}
            onChange={(e) => setForm({ ...form, populacao: e.target.value })}
            className="w-full border border-cariri-verde-claro rounded-md px-3 py-2 text-sm"
          />
        </div>

        {["cultura", "turismo", "agro", "economia", "educacao", "saude", "eventos", "dados"].map((chave) => (
          <div key={chave}>
            <label className="block text-sm font-medium mb-1 capitalize">{chave}</label>
            <textarea
              rows={3}
              value={form.secoes?.[chave] || ""}
              onChange={(e) => setForm({ ...form, secoes: { ...form.secoes, [chave]: e.target.value } })}
              className="w-full border border-cariri-verde-claro rounded-md px-3 py-2 text-sm"
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium mb-1">Hino municipal</label>
          <p className="text-xs text-cariri-cinza-texto mb-2">
            Envie um arquivo de áudio (MP3) ou vídeo do hino, ou cole um
            link (ex: YouTube) se preferir.
          </p>

          <UploadCampo
            label="Enviar arquivo de áudio ou vídeo"
            tipoAceito="audio/*,video/*"
            ajuda="MP3, WAV, OGG, M4A, AAC, MP4, WEBM ou MOV. O arquivo será publicado com o tipo correto."
            onEnviar={(url) => setForm({ ...form, hinoUrl: url })}
          />

          <div className="mt-3">
            <label className="block text-xs font-medium text-cariri-cinza-texto mb-1">
              Ou cole um link (ex: YouTube)
            </label>
            <input
              value={form.hinoUrl}
              onChange={(e) => setForm({ ...form, hinoUrl: e.target.value })}
              placeholder="https://..."
              className="w-full border border-cariri-verde-claro rounded-md px-3 py-2 text-sm"
            />
          </div>

          {form.hinoUrl && (
            <div className="mt-3 space-y-2 rounded-md bg-cariri-verde-claro/40 p-3">
              {tipoHino(form.hinoUrl) === "audio" && <audio controls preload="metadata" className="w-full" src={form.hinoUrl} />}
              {tipoHino(form.hinoUrl) === "video" && <video controls preload="metadata" className="max-h-48 w-full rounded" src={form.hinoUrl} />}
              {tipoHino(form.hinoUrl) === "link" && <a href={form.hinoUrl} target="_blank" rel="noreferrer" className="text-xs font-medium text-cariri-verde">Abrir link do hino em nova aba →</a>}
              <div className="flex items-center gap-2">
              <span className="text-xs text-cariri-cinza-texto truncate max-w-xs">
                Atual: {form.hinoUrl}
              </span>
              <button
                type="button"
                onClick={() => setForm({ ...form, hinoUrl: "" })}
                className="text-xs text-red-600 font-medium shrink-0"
              >
                Remover
              </button>
              </div>
            </div>
          )}
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

        <div className="rounded-md border border-cariri-verde-claro bg-cariri-verde-claro/20 p-3">
          <label className="block text-sm font-medium mb-1">Localização pelo Google Maps</label>
          <p className="mb-2 text-xs text-cariri-cinza-texto">Cole o link do ponto no Google Maps e clique em preencher. Também é possível editar latitude e longitude manualmente acima.</p>
          <div className="flex gap-2">
            <input value={form.mapaUrl || ""} onChange={(e) => setForm({ ...form, mapaUrl: e.target.value })} placeholder="https://www.google.com/maps/@-7.23,-39.31,14z" className="min-w-0 flex-1 border border-cariri-verde-claro rounded-md px-3 py-2 text-sm" />
            <button type="button" onClick={aplicarLinkMapa} className="shrink-0 rounded-md border border-cariri-verde px-3 py-2 text-sm font-semibold text-cariri-verde">Preencher</button>
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
