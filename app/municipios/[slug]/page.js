import { notFound } from "next/navigation";
import { buscarMunicipio } from "@/lib/db";
import AdSlot from "@/components/AdSlot";

// Garante que esta página busque dados novos a cada visita, em vez de
// usar uma versão "congelada" gerada no momento do build.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const municipio = await buscarMunicipio(params.slug);
  return { title: municipio ? municipio.nome : "Município" };
}

export default async function MunicipioPage({ params }) {
  const municipio = await buscarMunicipio(params.slug);

  if (!municipio) notFound();

  const temCoordenadas = municipio.latitude && municipio.longitude;
  const urlMapa = temCoordenadas
    ? `https://www.google.com/maps?q=${municipio.latitude},${municipio.longitude}&z=12&output=embed`
    : null;

  return (
    <div className="max-w-content mx-auto px-5 py-12">
      <p className="text-sm font-semibold text-cariri-verde uppercase tracking-wide">
        Município
      </p>
      <h1 className="mt-1 text-3xl sm:text-4xl font-bold text-cariri-preto">
        {municipio.nome}
      </h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-lg font-bold text-cariri-preto mb-2">História</h2>
            <p className="text-cariri-cinza-texto leading-relaxed whitespace-pre-line">
              {municipio.historia}
            </p>
          </section>

          {municipio.fotos && municipio.fotos.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-cariri-preto mb-3">Fotos</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {municipio.fotos.map((foto, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={foto}
                    alt={`Foto de ${municipio.nome}`}
                    className="rounded-md w-full h-32 object-cover"
                  />
                ))}
              </div>
            </section>
          )}

          <AdSlot label={`Anúncio - página de ${municipio.nome}`} />
        </div>

        <aside className="space-y-6">
          <div className="rounded-lg border border-cariri-verde-claro p-5">
            <h2 className="text-sm font-bold text-cariri-preto mb-2">Hino municipal</h2>
            {municipio.hinoUrl ? (
              <a
                href={municipio.hinoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-cariri-verde"
              >
                Ouvir o hino →
              </a>
            ) : (
              <p className="text-sm text-cariri-cinza-texto">
                Hino ainda não cadastrado. Adicione pelo painel de administração.
              </p>
            )}
          </div>

          <div className="rounded-lg border border-cariri-verde-claro overflow-hidden">
            <h2 className="text-sm font-bold text-cariri-preto p-5 pb-0">Mapa</h2>
            {urlMapa ? (
              <iframe
                title={`Mapa de ${municipio.nome}`}
                src={urlMapa}
                className="w-full h-56 mt-3 border-0"
                loading="lazy"
              />
            ) : (
              <p className="text-sm text-cariri-cinza-texto p-5">
                Localização ainda não cadastrada.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
