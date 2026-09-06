"use client";

import { useEffect, useState } from "react";

export default function AdminConfigPage() {
  const [form, setForm] = useState(null);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then(setForm);
  }, []);

  async function salvar(e) {
    e.preventDefault();
    setMensagem("");

    const resposta = await fetch("/api/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setMensagem(resposta.ok ? "Configurações salvas!" : "Erro ao salvar.");
  }

  if (!form) return <p className="text-cariri-cinza-texto">Carregando…</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-cariri-preto">Configurações</h1>

      <form onSubmit={salvar} className="mt-6 border border-cariri-verde-claro rounded-lg p-5 space-y-5 max-w-2xl">
        <div>
          <label className="block text-sm font-medium mb-1">Chave Pix de doação</label>
          <input
            value={form.chavePix}
            onChange={(e) => setForm({ ...form, chavePix: e.target.value })}
            className="w-full border border-cariri-verde-claro rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Mensagem exibida no botão de doação</label>
          <textarea
            rows={3}
            value={form.mensagemDoacao}
            onChange={(e) => setForm({ ...form, mensagemDoacao: e.target.value })}
            className="w-full border border-cariri-verde-claro rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Nome do responsável</label>
          <input
            value={form.responsavel}
            onChange={(e) => setForm({ ...form, responsavel: e.target.value })}
            className="w-full border border-cariri-verde-claro rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Texto da página "Sobre o Ponto Cariri"</label>
          <textarea
            rows={5}
            value={form.sobreTexto}
            onChange={(e) => setForm({ ...form, sobreTexto: e.target.value })}
            className="w-full border border-cariri-verde-claro rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            ID do Google AdSense (ex: ca-pub-1234567890123456)
          </label>
          <input
            value={form.adsenseClientId || ""}
            onChange={(e) => setForm({ ...form, adsenseClientId: e.target.value })}
            className="w-full border border-cariri-verde-claro rounded-md px-3 py-2 text-sm"
          />
          <p className="text-xs text-cariri-cinza-texto mt-1">
            Para ativar totalmente os anúncios, coloque este mesmo valor na
            variável NEXT_PUBLIC_ADSENSE_CLIENT_ID do arquivo .env.local
            (veja o README.md).
          </p>
        </div>

        <button type="submit" className="bg-cariri-verde text-white font-semibold px-5 py-2 rounded-md hover:bg-cariri-verde-escuro">
          Salvar configurações
        </button>

        {mensagem && <p className="text-sm text-cariri-verde-escuro">{mensagem}</p>}
      </form>
    </div>
  );
}
