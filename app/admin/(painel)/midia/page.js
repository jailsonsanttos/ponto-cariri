"use client";

import { useEffect, useState } from "react";
import UploadCampo from "@/components/UploadCampo";

export default function AdminMidiaPage() {
  const [itens, setItens] = useState([]);
  const [tipo, setTipo] = useState("");
  const [q, setQ] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function carregar() {
    setCarregando(true);
    const params = new URLSearchParams({ recurso: "midia" });
    if (tipo) params.set("tipo", tipo);
    if (q) params.set("q", q);
    try {
      const resposta = await fetch(`/api/cms?${params}`);
      setItens(resposta.ok ? await resposta.json() : []);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, [tipo]);

  return (
    <div>
      <h1 className="text-2xl font-black text-cariri-preto">Biblioteca de mídia</h1>
      <p className="text-sm text-cariri-cinza-texto mt-1">
        Envie uma vez e reutilize. A busca encontra nome, município, tags e texto alternativo.
      </p>

      <div className="mt-6 flex flex-wrap items-end gap-3 rounded-2xl border border-cariri-verde-claro bg-white p-4 shadow-sm">
        <UploadCampo label="Enviar arquivo" ajuda="Imagens, vídeos, áudios e documentos. O arquivo ficará disponível para reutilização." tipoAceito="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv" onEnviar={() => carregar()} />
        <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="border rounded-md px-3 py-2 text-sm">
          <option value="">Todos</option>
          <option value="imagem">Imagens</option>
          <option value="video">Vídeos</option>
          <option value="audio">Áudios</option>
          <option value="documento">Documentos</option>
        </select>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            carregar();
          }}
          className="flex gap-2"
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar (ex: Salitre)"
            className="border rounded-md px-3 py-2 text-sm"
          />
          <button className="bg-cariri-verde text-white px-3 py-2 rounded-md text-sm">Buscar</button>
        </form>
      </div>

      {carregando && <p className="mt-6 text-sm font-medium text-cariri-verde">Carregando biblioteca…</p>}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {itens.map((item) => (
          <article key={item.id} className="overflow-hidden rounded-2xl border border-cariri-verde-claro bg-white p-3 text-sm shadow-sm">
            {item.tipo === "imagem" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.url} alt={item.alt} className="w-full h-32 object-cover object-center rounded" />
            ) : item.tipo === "audio" ? (
              <audio controls preload="metadata" src={item.url} className="w-full" />
            ) : item.tipo === "video" ? (
              <video controls preload="metadata" src={item.url} className="aspect-video w-full rounded object-cover" />
            ) : (
              <div className="flex h-32 items-center justify-center rounded bg-cariri-verde-claro text-xs font-bold uppercase text-cariri-verde">{item.tipo}</div>
            )}
            <p className="mt-2 font-medium break-all">{item.nome || item.url}</p>
            <p className="text-xs text-cariri-cinza-texto">{item.municipioSlug}</p>
            <input
              className="mt-2 w-full border rounded px-2 py-1 text-xs"
              defaultValue={item.alt}
              placeholder="Texto alternativo / crédito"
              onBlur={(e) =>
                fetch("/api/cms", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    recurso: "midia",
                    id: item.id,
                    dados: { ...item, alt: e.target.value },
                  }),
                })
              }
            />
            <button
              type="button"
              className="mt-2 text-xs text-red-600"
              onClick={async () => {
                if (!confirm(`Excluir o arquivo \"${item.nome || item.url}\"?`)) return;
                await fetch("/api/cms", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ recurso: "midia", acao: "excluir", id: item.id }),
                });
                carregar();
              }}
            >
              Excluir
            </button>
            <p className="mt-1 text-[11px] break-all text-cariri-cinza-texto">{item.url}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
