import { sql } from "@vercel/postgres";

function novoId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function slugify(valor = "") {
  return valor.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 100);
}

export async function listarVagas({ publicadas = false, busca = "", municipio = "", tipo = "" } = {}) {
  const termo = `%${busca}%`;
  const { rows } = await sql`
    SELECT id, slug, titulo, empresa, descricao, municipio, tipo, modalidade, salario,
           requisitos, como_candidatar AS "comoCandidatar", url, fonte, origem,
           external_id AS "externalId",
           to_char(data_publicacao, 'YYYY-MM-DD') AS "dataPublicacao",
           to_char(data_expiracao, 'YYYY-MM-DD') AS "dataExpiracao",
           imagem, publicado, criado_em AS "criadoEm", atualizado_em AS "atualizadoEm"
    FROM vagas
    WHERE (${publicadas} = false OR (publicado = true AND (data_expiracao IS NULL OR data_expiracao >= CURRENT_DATE)))
      AND (${municipio} = '' OR municipio = ${municipio})
      AND (${tipo} = '' OR tipo = ${tipo})
      AND (${busca} = '' OR titulo ILIKE ${termo} OR empresa ILIKE ${termo} OR descricao ILIKE ${termo} OR municipio ILIKE ${termo})
    ORDER BY data_publicacao DESC NULLS LAST, atualizado_em DESC;
  `;
  return rows;
}

export async function buscarVaga(slug) {
  const { rows } = await sql`
    SELECT id, slug, titulo, empresa, descricao, municipio, tipo, modalidade, salario,
           requisitos, como_candidatar AS "comoCandidatar", url, fonte, origem,
           external_id AS "externalId",
           to_char(data_publicacao, 'YYYY-MM-DD') AS "dataPublicacao",
           to_char(data_expiracao, 'YYYY-MM-DD') AS "dataExpiracao",
           imagem, publicado, criado_em AS "criadoEm", atualizado_em AS "atualizadoEm"
    FROM vagas WHERE slug = ${slug} LIMIT 1;
  `;
  return rows[0] || null;
}

export async function salvarVaga(dados) {
  let id = dados.id || novoId();
  let slugExistente = "";
  if (!dados.id && dados.externalId) {
    const existentes = await sql`SELECT id, slug FROM vagas WHERE external_id = ${dados.externalId} LIMIT 1;`;
    if (existentes.rows[0]?.id) {
      id = existentes.rows[0].id;
      slugExistente = existentes.rows[0].slug;
    }
  }
  const slug = dados.slug || slugExistente || `${slugify(dados.titulo)}-${id.slice(-5)}`;
  await sql`
    INSERT INTO vagas (
      id, slug, titulo, empresa, descricao, municipio, tipo, modalidade, salario,
      requisitos, como_candidatar, url, fonte, origem, external_id,
      data_publicacao, data_expiracao, imagem, publicado, atualizado_em
    ) VALUES (
      ${id}, ${slug}, ${dados.titulo || ""}, ${dados.empresa || ""}, ${dados.descricao || ""},
      ${dados.municipio || ""}, ${dados.tipo || "Emprego"}, ${dados.modalidade || "Presencial"},
      ${dados.salario || ""}, ${dados.requisitos || ""}, ${dados.comoCandidatar || ""},
      ${dados.url || ""}, ${dados.fonte || "Cadastro manual"}, ${dados.origem || "manual"},
      ${dados.externalId || ""}, ${dados.dataPublicacao || null}, ${dados.dataExpiracao || null},
      ${dados.imagem || ""}, ${dados.publicado !== false}, NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      slug = EXCLUDED.slug, titulo = EXCLUDED.titulo, empresa = EXCLUDED.empresa,
      descricao = EXCLUDED.descricao, municipio = EXCLUDED.municipio, tipo = EXCLUDED.tipo,
      modalidade = EXCLUDED.modalidade, salario = EXCLUDED.salario, requisitos = EXCLUDED.requisitos,
      como_candidatar = EXCLUDED.como_candidatar, url = EXCLUDED.url, fonte = EXCLUDED.fonte,
      origem = EXCLUDED.origem, external_id = EXCLUDED.external_id,
      data_publicacao = EXCLUDED.data_publicacao, data_expiracao = EXCLUDED.data_expiracao,
      imagem = EXCLUDED.imagem, publicado = EXCLUDED.publicado, atualizado_em = NOW();
  `;
  return buscarVaga(slug);
}

export async function excluirVaga(id) {
  await sql`DELETE FROM vagas WHERE id = ${id};`;
}
