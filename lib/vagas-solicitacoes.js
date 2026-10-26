import { sql } from "@vercel/postgres";
import { salvarVaga } from "@/lib/vagas";

function novoId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function criarSolicitacao(dados) {
  const id = novoId();
  await sql`
    INSERT INTO vagas_solicitacoes (
      id, titulo, empresa, email, telefone, descricao, municipio, tipo, modalidade,
      salario, requisitos, como_candidatar, url, data_expiracao
    ) VALUES (
      ${id}, ${dados.titulo}, ${dados.empresa || ""}, ${dados.email || ""}, ${dados.telefone || ""},
      ${dados.descricao || ""}, ${dados.municipio || ""}, ${dados.tipo || "Emprego"},
      ${dados.modalidade || "Presencial"}, ${dados.salario || ""}, ${dados.requisitos || ""},
      ${dados.comoCandidatar || ""}, ${dados.url || ""}, ${dados.dataExpiracao || null}
    );
  `;
  return id;
}

export async function listarSolicitacoes(status = "pendente") {
  const { rows } = await sql`
    SELECT id, titulo, empresa, email, telefone, descricao, municipio, tipo, modalidade,
           salario, requisitos, como_candidatar AS "comoCandidatar", url,
           to_char(data_expiracao, 'YYYY-MM-DD') AS "dataExpiracao",
           status, observacao, criado_em AS "criadoEm"
    FROM vagas_solicitacoes
    WHERE (${status} = '' OR status = ${status})
    ORDER BY criado_em DESC;
  `;
  return rows;
}

export async function aprovarSolicitacao(id, observacao = "") {
  const { rows } = await sql`SELECT * FROM vagas_solicitacoes WHERE id = ${id} AND status = 'pendente' LIMIT 1;`;
  const pedido = rows[0];
  if (!pedido) return null;
  const vaga = await salvarVaga({
    titulo: pedido.titulo,
    empresa: pedido.empresa,
    descricao: pedido.descricao,
    municipio: pedido.municipio,
    tipo: pedido.tipo,
    modalidade: pedido.modalidade,
    salario: pedido.salario,
    requisitos: pedido.requisitos,
    comoCandidatar: pedido.como_candidatar,
    url: pedido.url,
    fonte: `Envio de ${pedido.empresa || "empresa"}`,
    origem: "submissao-publica",
    dataExpiracao: pedido.data_expiracao,
    publicado: true,
  });
  await sql`UPDATE vagas_solicitacoes SET status = 'aprovada', observacao = ${observacao} WHERE id = ${id};`;
  return vaga;
}

export async function recusarSolicitacao(id, observacao = "") {
  await sql`UPDATE vagas_solicitacoes SET status = 'recusada', observacao = ${observacao} WHERE id = ${id} AND status = 'pendente';`;
}
