import { sql } from "@vercel/postgres";
import { createHash } from "node:crypto";
import banco from "@/data/concurseiros/ibge-recenseador.json";

export const PRECO_CONCURSEIROS = "R$ 19,99";
export const CHAVE_PIX_CONCURSEIROS = "pontocariri.oficial@gmail.com";
export const COOKIE_CONCURSEIROS = "ponto_cariri_concurseiros";
export function listarQuestoes() { return banco.questoes; }
export function resumoQuestoes() { return { titulo: banco.titulo, total: banco.questoes.length, disciplinas: [...new Set(banco.questoes.map((q) => q.disciplina))] }; }
export function hashCodigo(codigo) { return createHash("sha256").update(`${process.env.ADMIN_SECRET || "ponto-cariri"}:${codigo}`).digest("hex"); }
export function gerarCodigo(id, email) { return createHash("sha256").update(`${process.env.ADMIN_SECRET || "ponto-cariri"}:${id}:${email.toLowerCase()}`).digest("hex").slice(0, 12).toUpperCase(); }
export async function solicitarAcesso({ nome, email, observacao = "" }) {
  const limpo = String(email || "").trim().toLowerCase();
  if (!limpo || !limpo.includes("@")) throw new Error("Informe um e-mail válido.");
  await sql`INSERT INTO concurseiros_solicitacoes (nome, email, observacao) VALUES (${String(nome || "").trim()}, ${limpo}, ${String(observacao || "").trim()})`;
  return true;
}
export async function listarSolicitacoesConcurseiros() {
  const { rows } = await sql`SELECT id, nome, email, observacao, status, criado_em AS "criadoEm", expira_em AS "expiraEm" FROM concurseiros_solicitacoes ORDER BY criado_em DESC`;
  return rows;
}
export async function aprovarSolicitacaoConcurseiros(id) {
  const { rows } = await sql`SELECT id, email FROM concurseiros_solicitacoes WHERE id = ${id}`;
  if (!rows[0]) throw new Error("Solicitação não encontrada.");
  const codigo = gerarCodigo(rows[0].id, rows[0].email);
  await sql`UPDATE concurseiros_solicitacoes SET status = 'aprovado', codigo_hash = ${hashCodigo(codigo)}, expira_em = NOW() + INTERVAL '30 days', aprovado_em = NOW() WHERE id = ${id}`;
  return { codigo, email: rows[0].email };
}
export async function recusarSolicitacaoConcurseiros(id) { await sql`UPDATE concurseiros_solicitacoes SET status = 'recusado' WHERE id = ${id}`; }
export async function validarAcessoConcurseiros(email, codigo) {
  const limpo = String(email || "").trim().toLowerCase();
  const hash = hashCodigo(String(codigo || "").trim().toUpperCase());
  const { rows } = await sql`SELECT id, email FROM concurseiros_solicitacoes WHERE email = ${limpo} AND status = 'aprovado' AND codigo_hash = ${hash} AND expira_em > NOW() LIMIT 1`;
  return rows[0] || null;
}
export async function acessoPorCookie(token) {
  if (!token) return false;
  const { rows } = await sql`SELECT id FROM concurseiros_solicitacoes WHERE status = 'aprovado' AND codigo_hash = ${hashCodigo(token)} AND expira_em > NOW() LIMIT 1`;
  return Boolean(rows[0]);
}
