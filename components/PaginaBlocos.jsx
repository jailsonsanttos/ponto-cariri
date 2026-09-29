"use client";

import { idDoYoutube } from "@/lib/midia";

export default function PaginaBlocos({ blocos = [] }) {
  if (!blocos.length) return null;

  return (
    <div className="space-y-8">
      {blocos.map((bloco) => {
        const d = bloco.dados || {};
        if (bloco.tipo === "titulo") {
          return (
            <h2 key={bloco.id} className="text-2xl font-bold text-cariri-preto">
              {d.texto}
            </h2>
          );
        }
        if (bloco.tipo === "texto") {
          if (d.html) {
            return (
              <div
                key={bloco.id}
                className="prose-noticia text-cariri-preto/90 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: d.html }}
              />
            );
          }
          return (
            <p key={bloco.id} className="text-cariri-preto/90 leading-relaxed whitespace-pre-line">
              {d.texto}
            </p>
          );
        }
        if (bloco.tipo === "imagem" && d.url) {
          return (
            <figure key={bloco.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={d.url} alt={d.alt || ""} className="w-full rounded-xl object-cover max-h-[480px]" />
              {d.legenda && (
                <figcaption className="mt-2 text-sm text-cariri-cinza-texto">{d.legenda}</figcaption>
              )}
            </figure>
          );
        }
        if (bloco.tipo === "video" && d.url) {
          const yt = idDoYoutube(d.url);
          return yt ? (
            <div key={bloco.id} className="aspect-video rounded-xl overflow-hidden">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${yt}`}
                title={d.titulo || "Vídeo"}
                allowFullScreen
                loading="lazy"
              />
            </div>
          ) : (
            <video key={bloco.id} src={d.url} controls className="w-full rounded-xl" />
          );
        }
        if (bloco.tipo === "botao" && d.url) {
          return (
            <a
              key={bloco.id}
              href={d.url}
              className="inline-flex items-center rounded-full bg-cariri-verde text-white px-5 py-2.5 text-sm font-semibold"
            >
              {d.texto || "Abrir"}
            </a>
          );
        }
        if (bloco.tipo === "galeria" && Array.isArray(d.urls)) {
          return (
            <div key={bloco.id} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {d.urls.map((url, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={url} alt="" className="w-full h-36 object-cover object-center rounded-lg" />
              ))}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
