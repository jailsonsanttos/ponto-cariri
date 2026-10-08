import Link from "next/link";
import { buscarConfig } from "@/lib/db";
import { buscarPaginaCompleta } from "@/lib/cms";
import PaginaBlocos from "@/components/PaginaBlocos";
import AdSlot from "@/components/AdSlot";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const pagina = await buscarPaginaCompleta("sobre").catch(() => null);
  return {
    title: pagina?.seoTitulo || pagina?.titulo || "Sobre o Ponto Cariri",
    description:
      pagina?.seoDescricao ||
      "Conheça o Ponto Cariri, portal independente de informação, cultura e riquezas do Cariri cearense.",
  };
}

function Icone({ tipo }) {
  const paths = {
    mapa: (
      <>
        <path d="M9 18 3 21V6l6-3 6 3 6-3v15l-6 3-6-3Z" />
        <path d="M9 3v15M15 6v15" />
      </>
    ),
    alvo: (
      <>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
      </>
    ),
    pessoas: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 5.5a3 3 0 0 1 0 5.8M18 14.5a5.5 5.5 0 0 1 3 5" />
      </>
    ),
    conversa: (
      <>
        <path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.7 8.7 0 0 1-3.5-.7L4 20l1.7-3.5A7.2 7.2 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z" />
        <path d="M8 12h.01M12 12h.01M16 12h.01" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[tipo] || paths.mapa}
    </svg>
  );
}

function Pessoa({ foto, nome, cargo }) {
  if (!nome) return null;
  return (
    <div className="group rounded-2xl border border-cariri-verde-claro bg-white p-4 transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-cariri-verde-claro">
          {foto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={foto} alt={nome} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-cariri-verde">
              {nome.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <p className="font-bold text-cariri-preto">{nome}</p>
          <p className="mt-1 text-sm text-cariri-cinza-texto">{cargo}</p>
        </div>
      </div>
    </div>
  );
}

export default async function SobrePage() {
  noStore();
  const [config, pagina] = await Promise.all([
    buscarConfig(),
    buscarPaginaCompleta("sobre").catch(() => null),
  ]);

  const pessoas = [
    { foto: config?.responsavelFoto, nome: config?.responsavel, cargo: "Responsável pelo projeto" },
    { foto: config?.administradorFoto, nome: config?.administradorNome, cargo: "Administração" },
    { foto: config?.coordenadorFoto, nome: config?.coordenadorNome, cargo: "Coordenação" },
  ].filter((p) => p.nome);

  const telefone = config?.telefoneContato?.replace(/\D/g, "");
  const textoSobre = config?.sobreTexto ||
    "O Ponto Cariri é uma iniciativa independente dedicada a valorizar as pessoas, os municípios, a cultura e as riquezas do Cariri cearense.";

  return (
    <div className="overflow-hidden bg-white">
      <section className="relative isolate bg-cariri-verde-escuro text-white">
        <div className="absolute inset-0 -z-10 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 15% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 70%, white 1px, transparent 1px)", backgroundSize: "34px 34px, 46px 46px" }} />
        <div className="mx-auto grid max-w-content items-center gap-10 px-5 py-16 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-cariri-verde-claro">
              <span className="h-2 w-2 rounded-full bg-cariri-verde-claro" />
              Sobre o Ponto Cariri
            </p>
            <h1 className="max-w-3xl text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Informação que nasce no Cariri e chega a toda a região.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
              Um portal independente para contar histórias, destacar talentos e tornar mais acessíveis as informações que fazem parte do dia a dia dos municípios caririenses.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/informacoes" className="rounded-full bg-white px-5 py-3 text-sm font-bold text-cariri-verde-escuro transition hover:bg-cariri-verde-claro">
                Conheça nossas publicações
              </Link>
              <Link href="/publicidade" className="rounded-full border border-white/30 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10">
                Anuncie conosco
              </Link>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-4 rounded-[2rem] border border-white/10" />
            <div className="relative rounded-[1.75rem] bg-white p-2 shadow-2xl shadow-black/20">
              <div className="rounded-[1.35rem] bg-cariri-verde-claro p-7 text-cariri-preto sm:p-9">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-cariri-verde">Nossa essência</p>
                <p className="mt-5 text-2xl font-black leading-tight sm:text-3xl">
                  Cultura, pessoas e riquezas do Cariri em um só lugar.
                </p>
                <div className="mt-8 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white p-4"><p className="text-2xl font-black text-cariri-verde">01</p><p className="mt-1 text-xs font-semibold text-cariri-cinza-texto">Olhar regional</p></div>
                  <div className="rounded-xl bg-white p-4"><p className="text-2xl font-black text-cariri-verde">24h</p><p className="mt-1 text-xs font-semibold text-cariri-cinza-texto">Informação acessível</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-content px-5 pt-7">
        <AdSlot label="Anúncio - página Sobre" />
      </div>

      <main className="mx-auto max-w-content px-5 pb-16">
        <section className="grid gap-10 py-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-cariri-verde">Quem somos</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-cariri-preto sm:text-4xl">Um projeto feito para valorizar o que é nosso.</h2>
          </div>
          <div className="rounded-3xl bg-cariri-verde-claro/70 p-6 sm:p-8">
            {pagina?.blocos?.length ? (
              <PaginaBlocos blocos={pagina.blocos} />
            ) : (
              <p className="whitespace-pre-line text-base leading-8 text-cariri-preto/80">{textoSobre}</p>
            )}
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["mapa", "Olhar local", "Acompanhamos de perto os municípios e as histórias que formam o Cariri."],
            ["alvo", "Informação útil", "Conteúdo claro, relevante e pensado para ajudar nas decisões do dia a dia."],
            ["pessoas", "Vozes da região", "Damos espaço para pessoas, iniciativas, cultura e negócios caririenses."],
            ["conversa", "Independência", "Um projeto autônomo, construído com responsabilidade e proximidade."],
          ].map(([icone, titulo, texto]) => (
            <article key={titulo} className="rounded-2xl border border-cariri-verde-claro bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cariri-verde-claro text-cariri-verde"><Icone tipo={icone} /></div>
              <h3 className="mt-5 font-bold text-cariri-preto">{titulo}</h3>
              <p className="mt-2 text-sm leading-6 text-cariri-cinza-texto">{texto}</p>
            </article>
          ))}
        </section>

        {config?.responsavelBio && (
          <section className="mt-16 grid gap-8 rounded-3xl bg-cariri-preto p-7 text-white sm:p-10 lg:grid-cols-[0.65fr_1.35fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-cariri-verde-claro">Nossa história</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight">Uma iniciativa que cresce com a região.</h2>
            </div>
            <p className="whitespace-pre-line text-base leading-8 text-white/70">{config.responsavelBio}</p>
          </section>
        )}

        {pessoas.length > 0 && (
          <section className="py-16">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-cariri-verde">Por trás do projeto</p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-cariri-preto">Pessoas que fazem acontecer.</h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-cariri-cinza-texto">O Ponto Cariri é construído com dedicação, responsabilidade e compromisso com a informação regional.</p>
            </div>
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pessoas.map((pessoa) => <Pessoa key={`${pessoa.cargo}-${pessoa.nome}`} {...pessoa} />)}
            </div>
          </section>
        )}

        {(config?.telefoneContato || config?.emailContato) && (
          <section className="relative overflow-hidden rounded-3xl bg-cariri-verde p-7 text-white sm:p-10">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border-[22px] border-white/10" />
            <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-white/70">Vamos conversar?</p>
                <h2 className="mt-2 text-3xl font-black tracking-tight">Tem uma pauta, parceria ou sugestão?</h2>
                <p className="mt-3 max-w-xl text-white/75">Entre em contato com o Ponto Cariri. Sua mensagem ajuda a construir um portal cada vez mais conectado com a região.</p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
                {telefone && <a href={`https://wa.me/55${telefone}`} target="_blank" rel="noopener noreferrer" className="rounded-full bg-white px-5 py-3 text-center text-sm font-bold text-cariri-verde transition hover:bg-cariri-verde-claro">Falar pelo WhatsApp</a>}
                {config.emailContato && <a href={`mailto:${config.emailContato}`} className="rounded-full border border-white/40 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-white/10">Enviar e-mail</a>}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
