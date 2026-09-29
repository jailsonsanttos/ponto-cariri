"use client";

import { useMemo, useState } from "react";
import BookMidia from "@/components/BookMidia";
import { idDoYoutube } from "@/lib/midia";

const LABELS = {
  info: "Informações",
  historia: "História",
  cultura: "Cultura",
  turismo: "Turismo",
  agro: "Agro",
  economia: "Economia",
  educacao: "Educação",
  saude: "Saúde",
  eventos: "Eventos",
  dados: "Dados",
  fotos: "Fotos",
  videos: "Vídeos",
};

export default function MunicipioAbas({ municipio, relacionadas = [] }) {
  const secoesExtra = municipio.secoes && typeof municipio.secoes === "object" ? municipio.secoes : {};

  const abas = useMemo(() => {
    const lista = [
      { id: "info", label: LABELS.info, visivel: true },
      { id: "historia", label: LABELS.historia, visivel: Boolean(municipio.historia) },
    ];
    for (const chave of ["cultura", "turismo", "agro", "economia", "educacao", "saude", "eventos", "dados"]) {
      lista.push({ id: chave, label: LABELS[chave], visivel: Boolean(secoesExtra[chave]) });
    }
    for (const [chave, valor] of Object.entries(secoesExtra)) {
      if (LABELS[chave]) continue;
      if (valor) lista.push({ id: chave, label: chave, visivel: true });
    }
    lista.push({
      id: "fotos",
      label: "Fotos",
      visivel: Array.isArray(municipio.fotos) && municipio.fotos.length > 0,
    });
    lista.push({
      id: "videos",
      label: "Vídeos",
      visivel: Array.isArray(municipio.videos) && municipio.videos.length > 0,
    });
    return lista.filter((a) => a.visivel);
  }, [municipio, secoesExtra]);

  const [ativa, setAtiva] = useState(abas[0]?.id || "info");

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
        {abas.map((aba) => (
          <button
            key={aba.id}
            type="button"
            onClick={() => setAtiva(aba.id)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium ${
              ativa === aba.id
                ? "bg-cariri-verde text-white"
                : "bg-cariri-verde-claro text-cariri-verde-escuro"
            }`}
          >
            {aba.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {ativa === "info" && (
          <div className="space-y-3 text-cariri-cinza-texto leading-relaxed">
            <p className="whitespace-pre-line">{municipio.descricaoCurta}</p>
            {municipio.populacao && <p>População: {municipio.populacao}</p>}
            {relacionadas.length > 0 && (
              <div className="pt-4">
                <p className="font-semibold text-cariri-preto mb-2">Conteúdos deste município</p>
                <ul className="space-y-1">
                  {relacionadas.map((n) => (
                    <li key={n.slug}>
                      <a href={`/informacoes/${n.slug}`} className="text-cariri-verde text-sm font-medium">
                        {n.titulo}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        {ativa === "historia" && (
          <p className="text-cariri-cinza-texto leading-relaxed whitespace-pre-line">{municipio.historia}</p>
        )}
        {["cultura", "turismo", "agro", "economia", "educacao", "saude", "eventos", "dados"].includes(ativa) && (
          <p className="text-cariri-cinza-texto leading-relaxed whitespace-pre-line">{secoesExtra[ativa]}</p>
        )}
        {ativa === "fotos" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(municipio.fotos || []).map((foto, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={foto}
                alt={`Foto de ${municipio.nome}`}
                className="w-full h-36 sm:h-44 object-cover object-center rounded-md"
              />
            ))}
          </div>
        )}
        {ativa === "videos" && (
          <div className="grid sm:grid-cols-2 gap-4">
            {(municipio.videos || []).map((video, i) => {
              const yt = idDoYoutube(video);
              return yt ? (
                <div key={i} className="aspect-video rounded-md overflow-hidden">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${yt}`}
                    title={`Vídeo de ${municipio.nome}`}
                    allowFullScreen
                  />
                </div>
              ) : (
                <video key={i} src={video} controls className="w-full rounded-md" />
              );
            })}
          </div>
        )}
        {!["info", "historia", "fotos", "videos", "cultura", "turismo", "agro", "economia", "educacao", "saude", "eventos", "dados"].includes(
          ativa
        ) && <p className="text-cariri-cinza-texto whitespace-pre-line">{secoesExtra[ativa]}</p>}
      </div>

      {ativa === "info" && <div className="mt-8"><BookMidia municipio={municipio} /></div>}
    </div>
  );
}
