import Image from "next/image";
import { idDoYoutube, tipoDeArquivo } from "@/lib/midia";

export default function PropagandaCard({ propaganda }) {
  const idYoutube = idDoYoutube(propaganda.video);
  const ehArquivoDeVideo = !idYoutube && tipoDeArquivo(propaganda.video) === "video";

  return (
    <div className="rounded-lg border border-cariri-verde-claro overflow-hidden bg-white flex flex-col">
      {idYoutube ? (
        <div className="w-full aspect-video">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${idYoutube}`}
            title={propaganda.nome}
            allowFullScreen
            loading="lazy"
          />
        </div>
      ) : ehArquivoDeVideo ? (
        <video controls className="w-full h-40 object-cover bg-cariri-preto" src={propaganda.video} />
      ) : propaganda.fotos && propaganda.fotos[0] ? (
        <div className="relative w-full h-40">
          <Image
            src={propaganda.fotos[0]}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 300px"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-40 bg-cariri-verde-claro" />
      )}

      <div className="p-5 flex-1 flex flex-col">
        <p className="text-xs font-medium text-cariri-verde uppercase tracking-wide">
          {propaganda.categoria}
        </p>
        <p className="mt-1 font-semibold text-cariri-preto">{propaganda.nome}</p>
        <p className="mt-2 text-sm text-cariri-cinza-texto leading-relaxed flex-1">
          {propaganda.descricao}
        </p>
        {propaganda.video && !idYoutube && !ehArquivoDeVideo && (
          <a
            href={propaganda.video}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-sm font-medium text-cariri-verde"
          >
            ▶ Ver vídeo
          </a>
        )}
        {propaganda.telefone && (
          <a
            href={`https://wa.me/55${propaganda.telefone.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm font-semibold text-white bg-cariri-verde px-4 py-2 rounded-md text-center hover:bg-cariri-verde-escuro transition-colors"
          >
            Chamar no WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}
