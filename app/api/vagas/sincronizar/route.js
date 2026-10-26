import { NextResponse } from "next/server";
import { garantirSchema } from "@/lib/db";
import { salvarVaga } from "@/lib/vagas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalizar(item) {
  return {
    titulo: item.titulo || item.title || item.nome,
    empresa: item.empresa || item.company || item.hiringOrganization?.name || "",
    descricao: item.descricao || item.description || "",
    municipio: item.municipio || item.city || item.location?.city || "",
    tipo: item.tipo || item.employmentType || "Emprego",
    modalidade: item.modalidade || item.workMode || "Presencial",
    salario: item.salario || item.salary || "",
    requisitos: item.requisitos || item.requirements || "",
    comoCandidatar: item.comoCandidatar || item.apply || "",
    url: item.url || item.link || item.applyUrl || "",
    fonte: item.fonte || item.source || "Fonte autorizada",
    origem: item.origem || "api",
    externalId: String(item.externalId || item.id || item.url || ""),
    dataPublicacao: item.dataPublicacao || item.datePosted || null,
    dataExpiracao: item.dataExpiracao || item.validThrough || null,
    imagem: item.imagem || item.image || "",
    publicado: item.publicado !== false,
  };
}

export async function GET(request) {
  const secret = process.env.CRON_SECRET;
  const recebido = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || request.headers.get("x-cron-secret");
  if (!secret || recebido !== secret) return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  const feedUrl = process.env.VAGAS_FEED_URL;
  if (!feedUrl) return NextResponse.json({ ok: true, importadas: 0, aviso: "Configure VAGAS_FEED_URL com uma fonte JSON autorizada." });
  try {
    await garantirSchema();
    const resposta = await fetch(feedUrl, { headers: { accept: "application/json" }, cache: "no-store" });
    if (!resposta.ok) throw new Error(`Fonte respondeu ${resposta.status}`);
    const bruto = await resposta.json();
    const itens = Array.isArray(bruto) ? bruto : bruto.vagas || bruto.jobs || bruto.data || [];
    let importadas = 0;
    for (const item of itens) {
      const vaga = normalizar(item);
      if (!vaga.titulo) continue;
      await salvarVaga(vaga);
      importadas += 1;
    }
    return NextResponse.json({ ok: true, importadas, fonte: feedUrl });
  } catch (erro) {
    console.error("Falha na sincronização de vagas:", erro);
    return NextResponse.json({ erro: erro?.message || "Falha na sincronização." }, { status: 500 });
  }
}
