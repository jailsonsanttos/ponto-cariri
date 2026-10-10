"use client";

import { useEffect, useState } from "react";
import UploadCampo from "@/components/UploadCampo";

export default function AdminAparenciaPage() {
  const [form, setForm] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/cms?recurso=aparencia")
      .then((r) => r.json())
      .then(setForm);
  }, []);

  if (!form) return <p>Carregando…</p>;

  async function salvar(e) {
    e.preventDefault();
    const r = await fetch("/api/cms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recurso: "aparencia", dados: form }),
    });
    setMsg(r.ok ? "Aparência salva." : "Erro ao salvar.");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Aparência</h1>
      <p className="text-sm text-cariri-cinza-texto mt-1">
        Cores e logo sem alterar código. Mantenha o visual simples: verde, branco e preto.
      </p>
      <form onSubmit={salvar} className="mt-6 max-w-xl space-y-3">
        {[
          ["corPrincipal", "Cor principal"],
          ["corSecundaria", "Cor secundária"],
          ["corFundoSuave", "Fundo suave"],
          ["corTexto", "Texto"],
          ["corTextoSecundario", "Texto secundário"],
          ["corFundo", "Fundo da página"],
          ["corLink", "Links"],
        ].map(([k, label]) => (
          <label key={k} className="flex items-center justify-between gap-3 text-sm">
            {label}
            <input
              type="color"
              value={form[k] || "#000000"}
              onChange={(e) => setForm({ ...form, [k]: e.target.value })}
            />
          </label>
        ))}
        <input
          value={form.slogan || ""}
          onChange={(e) => setForm({ ...form, slogan: e.target.value })}
          placeholder="Slogan"
          className="w-full border rounded-md px-3 py-2 text-sm"
        />
        <label className="block text-sm font-medium">
          Fonte dos textos
          <select value={form.fonte || "sistema"} onChange={(e) => setForm({ ...form, fonte: e.target.value })} className="mt-1 w-full border rounded-md px-3 py-2 text-sm">
            <option value="sistema">Sistema (rápida e acessível)</option>
            <option value="inter">Inter (moderna)</option>
            <option value="serif">Serifada (editorial)</option>
            <option value="mono">Monoespaçada (técnica)</option>
          </select>
        </label>
        <div className="rounded-md border bg-slate-50 p-3 text-sm" style={{ fontFamily: form.fonte === "serif" ? "Georgia, serif" : form.fonte === "mono" ? "ui-monospace, monospace" : form.fonte === "inter" ? "Arial, sans-serif" : "system-ui, sans-serif" }}>
          <strong>Prévia da aparência</strong>
          <p className="mt-1 text-cariri-cinza-texto">Veja aqui como a tipografia ficará no portal.</p>
        </div>
        <div>
          <p className="text-sm font-medium mb-1">Logo</p>
          <UploadCampo onEnviar={(url) => setForm({ ...form, logoUrl: url })} />
        </div>
        <div>
          <p className="text-sm font-medium mb-1">Favicon</p>
          <UploadCampo onEnviar={(url) => setForm({ ...form, faviconUrl: url })} />
        </div>
        <button className="bg-cariri-verde text-white px-4 py-2 rounded-md text-sm font-semibold">Salvar</button>
        {msg && <p className="text-sm text-cariri-verde">{msg}</p>}
      </form>
    </div>
  );
}
