"use client";

import { useEffect, useState } from "react";
import UploadCampo from "@/components/UploadCampo";

function CampoFoto({ label, url, onEnviar }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="flex items-center gap-3">
        {url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" className="w-14 h-18 object-cover rounded-md border border-cariri-verde-claro" />
        )}
        <UploadCampo label="" onEnviar={onEnviar} />
      </div>
    </div>
  );
}

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
          <label className="block text-sm font-medium mb-1">Texto da página "Sobre o Ponto Cariri"</label>
          <textarea
            rows={5}
            value={form.sobreTexto}
            onChange={(e) => setForm({ ...form, sobreTexto: e.target.value })}
            className="w-full border border-cariri-verde-claro rounded-md px-3 py-2 text-sm"
          />
        </div>

        <hr className="border-cariri-verde-claro" />
        <p className="text-sm font-bold text-cariri-preto">Contato</p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Telefone / WhatsApp</label>
            <input
              value={form.telefoneContato || ""}
              onChange={(e) => setForm({ ...form, telefoneContato: e.target.value })}
              placeholder="88981228898"
              className="w-full border border-cariri-verde-claro rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">E-mail</label>
            <input
              type="email"
              value={form.emailContato || ""}
              onChange={(e) => setForm({ ...form, emailContato: e.target.value })}
              className="w-full border border-cariri-verde-claro rounded-md px-3 py-2 text-sm"
            />
          </div>
        </div>

        <hr className="border-cariri-verde-claro" />
        <p className="text-sm font-bold text-cariri-preto">Equipe (fotos 3x4)</p>

        <div>
          <label className="block text-sm font-medium mb-1">Nome do responsável</label>
          <input
            value={form.responsavel}
            onChange={(e) => setForm({ ...form, responsavel: e.target.value })}
            className="w-full border border-cariri-verde-claro rounded-md px-3 py-2 text-sm"
          />
        </div>
        <CampoFoto
          label="Foto do responsável"
          url={form.responsavelFoto}
          onEnviar={(url) => setForm({ ...form, responsavelFoto: url })}
        />

        <div>
          <label className="block text-sm font-medium mb-1">Nome do administrador</label>
          <input
            value={form.administradorNome || ""}
            onChange={(e) => setForm({ ...form, administradorNome: e.target.value })}
            className="w-full border border-cariri-verde-claro rounded-md px-3 py-2 text-sm"
          />
        </div>
        <CampoFoto
          label="Foto do administrador"
          url={form.administradorFoto}
          onEnviar={(url) => setForm({ ...form, administradorFoto: url })}
        />

        <div>
          <label className="block text-sm font-medium mb-1">Nome do coordenador</label>
          <input
            value={form.coordenadorNome || ""}
            onChange={(e) => setForm({ ...form, coordenadorNome: e.target.value })}
            className="w-full border border-cariri-verde-claro rounded-md px-3 py-2 text-sm"
          />
        </div>
        <CampoFoto
          label="Foto do coordenador"
          url={form.coordenadorFoto}
          onEnviar={(url) => setForm({ ...form, coordenadorFoto: url })}
        />

        <div>
          <label className="block text-sm font-medium mb-1">
            História de vida do responsável (aparece na página Sobre)
          </label>
          <textarea
            rows={6}
            value={form.responsavelBio || ""}
            onChange={(e) => setForm({ ...form, responsavelBio: e.target.value })}
            placeholder="Conte um pouco da sua trajetória..."
            className="w-full border border-cariri-verde-claro rounded-md px-3 py-2 text-sm"
          />
        </div>

        <hr className="border-cariri-verde-claro" />

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
            variável NEXT_PUBLIC_ADSENSE_CLIENT_ID nas variáveis de
            ambiente da Vercel.
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
