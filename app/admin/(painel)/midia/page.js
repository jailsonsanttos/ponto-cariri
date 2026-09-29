"use client";

import { useEffect, useState } from "react";
import UploadCampo from "@/components/UploadCampo";

export default function AdminMidiaPage() {
  const [itens, setItens] = useState([]);
  const [tipo, setTipo] = useState("");
  const [q, setQ] = useState("");

  async function carregar() {
    const params = new URLSearchParams({ recurso: "midia" });
    if (tipo) params.set("tipo", tipo);
    if (q) params.set("q", q);
    setItens(await (await fetch(`/api/cms?${params}`)).json());
  }

  useEffect(() => {
    carregar();
  }, [tipo]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Biblioteca de mídia</h1>
      <p className="text-sm text-cariri-cinza-texto mt-1">
        Envie uma vez e reutilize. A busca encontra nome, município, tags e texto alternativo.
      </p>

      <div className="mt-6 flex flex-wrap gap-3 items-end">
        <UploadCampo label="Enviar arquivo" tipoAceito="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx" onEnviar={() => carregar()} />
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

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {itens.map((item) => (
          <article key={item.id} className="border rounded-lg p-3 text-sm">
            {item.tipo === "imagem" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.url} alt={item.alt} className="w-full h-32 object-cover object-center rounded" />
            ) : (
              <p className="uppercase text-xs text-cariri-verde">{item.tipo}</p>
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
              onClick={() =>
                fetch("/api/cms", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ recurso: "midia", acao: "excluir", id: item.id }),
                }).then(carregar)
              }
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
