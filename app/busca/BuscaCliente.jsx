"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import NoticiaCard from "@/components/NoticiaCard";
import MunicipioCard from "@/components/MunicipioCard";

export default function BuscaCliente() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const termoInicial = searchParams.get("q") || "";

  const [termo, setTermo] = useState(termoInicial);
  const [resultado, setResultado] = useState(null);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (!termoInicial || termoInicial.length < 2) {
      setResultado(null);
      return;
    }

    let cancelado = false;
    setCarregando(true);

    fetch(`/api/busca?q=${encodeURIComponent(termoInicial)}`)
      .then((r) => r.json())
      .then((dados) => {
        if (!cancelado) setResultado(dados);
      })
      .finally(() => {
        if (!cancelado) setCarregando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [termoInicial]);

  function aoBuscar(e) {
    e.preventDefault();
    if (termo.trim().length < 2) return;
    router.push(`/busca?q=${encodeURIComponent(termo.trim())}`);
  }

  const semResultados =
    resultado &&
    resultado.municipios.length === 0 &&
    resultado.noticias.length === 0;

  return (
    <div>
      <form onSubmit={aoBuscar} className="mt-6 flex gap-2 max-w-lg">
        <input
          type="search"
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          placeholder="Buscar notícias ou municípios..."
          className="flex-1 border border-cariri-verde-claro rounded-md px-4 py-2.5 text-sm"
        />
        <button
          type="submit"
          className="bg-cariri-verde text-white font-semibold px-5 py-2.5 rounded-md hover:bg-cariri-verde-escuro transition-colors"
        >
          Buscar
        </button>
      </form>

      <div className="mt-8">
        {carregando && (
          <p className="text-sm text-cariri-cinza-texto">Buscando…</p>
        )}

        {!carregando && termoInicial && semResultados && (
          <p className="text-cariri-cinza-texto">
            Nenhum resultado encontrado para "{termoInicial}".
          </p>
        )}

        {resultado && resultado.noticias.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-bold text-cariri-preto mb-4">
              Notícias
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {resultado.noticias.map((n) => (
                <NoticiaCard key={n.slug} noticia={n} />
              ))}
            </div>
          </section>
        )}

        {resultado && resultado.municipios.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-cariri-preto mb-4">
              Municípios
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {resultado.municipios.map((m) => (
                <MunicipioCard key={m.slug} municipio={m} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
