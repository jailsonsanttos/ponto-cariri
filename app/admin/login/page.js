"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginAdminPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function aoEnviar(e) {
    e.preventDefault();
    setErro("");
    setEnviando(true);

    const resposta = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, senha }),
    });

    setEnviando(false);

    if (resposta.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const dados = await resposta.json();
      setErro(dados.erro || "Não foi possível entrar.");
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-5">
      <form
        onSubmit={aoEnviar}
        className="w-full max-w-sm border border-cariri-verde-claro rounded-lg p-6"
      >
        <p className="text-sm font-semibold text-cariri-verde uppercase tracking-wide">
          Ponto Cariri
        </p>
        <h1 className="mt-1 text-xl font-bold text-cariri-preto">
          Painel de administração
        </h1>

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="usuario" className="block text-sm font-medium text-cariri-preto mb-1">
              Usuário
            </label>
            <input
              id="usuario"
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
              className="w-full border border-cariri-verde-claro rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-cariri-preto mb-1">
              Senha
            </label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="w-full border border-cariri-verde-claro rounded-md px-3 py-2 text-sm"
            />
          </div>
        </div>

        {erro && <p className="mt-4 text-sm text-red-600">{erro}</p>}

        <button
          type="submit"
          disabled={enviando}
          className="mt-6 w-full bg-cariri-verde text-white font-semibold py-2.5 rounded-md hover:bg-cariri-verde-escuro transition-colors disabled:opacity-60"
        >
          {enviando ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}
