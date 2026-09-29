import { buscarConfig } from "@/lib/db";
import { buscarPaginaCompleta } from "@/lib/cms";
import PaginaBlocos from "@/components/PaginaBlocos";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const pagina = await buscarPaginaCompleta("sobre").catch(() => null);
  return {
    title: pagina?.seoTitulo || pagina?.titulo || "Sobre o Ponto Cariri",
    description: pagina?.seoDescricao || "Conheça o Ponto Cariri, portal regional do Cariri cearense.",
  };
}

function FotoEquipe({ foto, nome, cargo }) {
  return (
    <div className="text-center">
      <div className="w-28 h-36 mx-auto rounded-md overflow-hidden bg-cariri-verde-claro border border-cariri-verde-claro">
        {foto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={foto} alt={nome} className="w-full h-full object-cover object-center" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-cariri-verde text-3xl font-bold">
            {nome ? nome.charAt(0).toUpperCase() : "?"}
          </div>
        )}
      </div>
      <p className="mt-2 text-sm font-semibold text-cariri-preto">{nome || "—"}</p>
      <p className="text-xs text-cariri-cinza-texto">{cargo}</p>
    </div>
  );
}

export default async function SobrePage() {
  noStore();
  const [config, pagina] = await Promise.all([
    buscarConfig(),
    buscarPaginaCompleta("sobre").catch(() => null),
  ]);

  return (
    <div className="max-w-content mx-auto px-5 py-12">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-cariri-preto">
          {pagina?.titulo || "Sobre o Ponto Cariri"}
        </h1>

        <div className="mt-8">
          {pagina?.blocos?.length ? (
            <PaginaBlocos blocos={pagina.blocos} />
          ) : (
            <p className="text-cariri-preto/90 leading-relaxed whitespace-pre-line">{config?.sobreTexto}</p>
          )}
        </div>

        <div className="mt-10 rounded-lg border border-cariri-verde-claro p-6">
          <p className="text-sm font-semibold text-cariri-preto mb-5">Quem está por trás do projeto</p>
          <div className="grid grid-cols-3 gap-4">
            <FotoEquipe foto={config.responsavelFoto} nome={config.responsavel} cargo="Responsável" />
            <FotoEquipe foto={config.administradorFoto} nome={config.administradorNome} cargo="Administrador" />
            <FotoEquipe foto={config.coordenadorFoto} nome={config.coordenadorNome} cargo="Coordenador" />
          </div>
        </div>

        {config.responsavelBio && (
          <div className="mt-8">
            <h2 className="text-lg font-bold text-cariri-preto mb-3">
              Um pouco da história de {config.responsavel || "quem criou o projeto"}
            </h2>
            <p className="text-cariri-preto/90 leading-relaxed whitespace-pre-line">{config.responsavelBio}</p>
          </div>
        )}

        {(config.telefoneContato || config.emailContato) && (
          <div className="mt-8 rounded-lg border border-cariri-verde-claro p-6">
            <p className="text-sm font-semibold text-cariri-preto mb-3">Contato</p>
            <div className="space-y-1.5 text-sm">
              {config.telefoneContato && (
                <p className="text-cariri-cinza-texto">
                  📞{" "}
                  <a
                    href={`https://wa.me/55${config.telefoneContato.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cariri-verde font-medium"
                  >
                    {config.telefoneContato}
                  </a>
                </p>
              )}
              {config.emailContato && (
                <p className="text-cariri-cinza-texto">
                  ✉️{" "}
                  <a href={`mailto:${config.emailContato}`} className="text-cariri-verde font-medium">
                    {config.emailContato}
                  </a>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
