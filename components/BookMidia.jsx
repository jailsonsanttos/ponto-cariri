import { idDoYoutube } from "@/lib/midia";

// Exibe o "book" de fotos, vídeos e links de um município.
export default function BookMidia({ municipio }) {
  const temFotos = municipio.fotos && municipio.fotos.length > 0;
  const temVideos = municipio.videos && municipio.videos.length > 0;
  const temLinks = municipio.links && municipio.links.length > 0;

  if (!temFotos && !temVideos && !temLinks) return null;

  return (
    <section>
      <h2 className="text-lg font-bold text-cariri-preto mb-4">
        Book de fotos, vídeos e links
      </h2>

      {temFotos && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {municipio.fotos.map((foto, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={foto}
              alt={`Foto de ${municipio.nome}`}
              className="rounded-md w-full h-32 sm:h-40 object-cover"
            />
          ))}
        </div>
      )}

      {temVideos && (
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {municipio.videos.map((video, i) => {
            const idYoutube = idDoYoutube(video);
            return idYoutube ? (
              <div key={i} className="aspect-video rounded-md overflow-hidden">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${idYoutube}`}
                  title={`Vídeo de ${municipio.nome}`}
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            ) : (
              <a
                key={i}
                href={video}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-40 rounded-md border border-cariri-verde-claro bg-cariri-verde-claro/40 text-sm font-medium text-cariri-verde"
              >
                ▶ Assistir vídeo
              </a>
            );
          })}
        </div>
      )}

      {temLinks && (
        <div className="flex flex-wrap gap-2">
          {municipio.links.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-cariri-verde-escuro bg-cariri-verde-claro px-4 py-2 rounded-md hover:bg-cariri-verde-claro/70 transition-colors"
            >
              🔗 {link.titulo || link.url}
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
