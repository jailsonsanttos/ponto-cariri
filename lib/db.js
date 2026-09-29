// lib/db.js
// Camada de acesso ao banco de dados (Vercel Postgres).
// Todas as páginas e rotas de API do site passam por aqui para ler e
// gravar municípios, notícias, propagandas e configurações.
//
// Em produção, a Vercel injeta automaticamente a variável POSTGRES_URL
// quando você cria um banco "Vercel Postgres" e o conecta ao projeto.
// Para rodar no seu computador, veja o passo a passo no README.md
// (comando "vercel env pull .env.local").

import { sql } from "@vercel/postgres";
import { criarTabelasCms, seedCms } from "./cms.js";

let schemaPromise = null;

export async function garantirSchema() {
  if (!schemaPromise) {
    schemaPromise = criarTabelas().catch((erro) => {
      schemaPromise = null;
      throw erro;
    });
  }
  return schemaPromise;
}

// ---------- Criação/atualização das tabelas ----------
// Roda com "npm run db:setup". É seguro rodar de novo a qualquer momento:
// "IF NOT EXISTS" garante que nada existente é apagado, só adiciona o
// que ainda estiver faltando (útil quando novos campos são criados).

export async function criarTabelas() {
  await sql`
    CREATE TABLE IF NOT EXISTS municipios (
      slug TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      descricao_curta TEXT DEFAULT '',
      historia TEXT DEFAULT '',
      hino_url TEXT DEFAULT '',
      latitude DOUBLE PRECISION,
      longitude DOUBLE PRECISION,
      fotos JSONB DEFAULT '[]'
    );
  `;
  await sql`ALTER TABLE municipios ADD COLUMN IF NOT EXISTS videos JSONB DEFAULT '[]';`;
  await sql`ALTER TABLE municipios ADD COLUMN IF NOT EXISTS links JSONB DEFAULT '[]';`;

  await sql`
    CREATE TABLE IF NOT EXISTS noticias (
      slug TEXT PRIMARY KEY,
      titulo TEXT NOT NULL,
      resumo TEXT DEFAULT '',
      conteudo TEXT DEFAULT '',
      imagem_capa TEXT DEFAULT '',
      categoria TEXT DEFAULT 'Geral',
      municipio TEXT DEFAULT '',
      data_publicacao DATE DEFAULT CURRENT_DATE,
      publicada BOOLEAN DEFAULT true
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS propagandas (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      categoria TEXT DEFAULT 'Loja',
      descricao TEXT DEFAULT '',
      telefone TEXT DEFAULT '',
      municipio TEXT DEFAULT '',
      fotos JSONB DEFAULT '[]',
      video TEXT DEFAULT '',
      ativo BOOLEAN DEFAULT true
    );
  `;
  await sql`ALTER TABLE propagandas ADD COLUMN IF NOT EXISTS criado_em TIMESTAMPTZ DEFAULT NOW();`;

  await sql`ALTER TABLE noticias ADD COLUMN IF NOT EXISTS destaque BOOLEAN DEFAULT false;`;
  await sql`ALTER TABLE noticias ADD COLUMN IF NOT EXISTS visualizacoes INTEGER DEFAULT 0;`;

  await sql`
    CREATE TABLE IF NOT EXISTS config (
      id INTEGER PRIMARY KEY DEFAULT 1,
      chave_pix TEXT DEFAULT '',
      mensagem_doacao TEXT DEFAULT '',
      sobre_texto TEXT DEFAULT '',
      responsavel TEXT DEFAULT '',
      adsense_client_id TEXT DEFAULT ''
    );
  `;
  await sql`ALTER TABLE config ADD COLUMN IF NOT EXISTS telefone_contato TEXT DEFAULT '';`;
  await sql`ALTER TABLE config ADD COLUMN IF NOT EXISTS email_contato TEXT DEFAULT '';`;
  await sql`ALTER TABLE config ADD COLUMN IF NOT EXISTS responsavel_foto TEXT DEFAULT '';`;
  await sql`ALTER TABLE config ADD COLUMN IF NOT EXISTS responsavel_bio TEXT DEFAULT '';`;
  await sql`ALTER TABLE config ADD COLUMN IF NOT EXISTS administrador_nome TEXT DEFAULT '';`;
  await sql`ALTER TABLE config ADD COLUMN IF NOT EXISTS administrador_foto TEXT DEFAULT '';`;
  await sql`ALTER TABLE config ADD COLUMN IF NOT EXISTS coordenador_nome TEXT DEFAULT '';`;
  await sql`ALTER TABLE config ADD COLUMN IF NOT EXISTS coordenador_foto TEXT DEFAULT '';`;
  await sql`ALTER TABLE config ADD COLUMN IF NOT EXISTS instagram_url TEXT DEFAULT '';`;
  await sql`ALTER TABLE config ADD COLUMN IF NOT EXISTS facebook_url TEXT DEFAULT '';`;
  await sql`ALTER TABLE config ADD COLUMN IF NOT EXISTS twitter_url TEXT DEFAULT '';`;

  await criarTabelasCms();
  await seedCms();
}

// ---------- Municípios ----------

export async function listarMunicipios() {
  await garantirSchema();
  const { rows } = await sql`
    SELECT slug, nome,
           descricao_curta AS "descricaoCurta",
           historia,
           hino_url AS "hinoUrl",
           latitude, longitude, fotos, videos, links, populacao, secoes
    FROM municipios ORDER BY nome ASC;
  `;
  return rows;
}

export async function buscarMunicipio(slug) {
  const { rows } = await sql`
    SELECT slug, nome,
           descricao_curta AS "descricaoCurta",
           historia,
           hino_url AS "hinoUrl",
           latitude, longitude, fotos, videos, links, populacao, secoes
    FROM municipios WHERE slug = ${slug};
  `;
  return rows[0] || null;
}

export async function criarMunicipio(slug, dados) {
  const { rows } = await sql`
    INSERT INTO municipios (slug, nome, descricao_curta, historia, hino_url, latitude, longitude, fotos, videos, links, populacao, secoes)
    VALUES (
      ${slug}, ${dados.nome || ""}, ${dados.descricaoCurta || ""}, ${dados.historia || ""},
      ${dados.hinoUrl || ""}, ${dados.latitude || null}, ${dados.longitude || null},
      ${JSON.stringify(dados.fotos || [])}, ${JSON.stringify(dados.videos || [])},
      ${JSON.stringify(dados.links || [])}, ${dados.populacao || ""},
      ${JSON.stringify(dados.secoes || {})}
    )
    RETURNING slug, nome, descricao_curta AS "descricaoCurta", historia,
              hino_url AS "hinoUrl", latitude, longitude, fotos, videos, links, populacao, secoes;
  `;
  return rows[0];
}

export async function atualizarMunicipio(slug, dados) {
  const { rows } = await sql`
    UPDATE municipios SET
      nome = ${dados.nome},
      descricao_curta = ${dados.descricaoCurta},
      historia = ${dados.historia},
      hino_url = ${dados.hinoUrl},
      latitude = ${dados.latitude || null},
      longitude = ${dados.longitude || null},
      fotos = ${JSON.stringify(dados.fotos || [])},
      videos = ${JSON.stringify(dados.videos || [])},
      links = ${JSON.stringify(dados.links || [])},
      populacao = ${dados.populacao || ""},
      secoes = ${JSON.stringify(dados.secoes || {})}
    WHERE slug = ${slug}
    RETURNING slug, nome, descricao_curta AS "descricaoCurta", historia,
              hino_url AS "hinoUrl", latitude, longitude, fotos, videos, links, populacao, secoes;
  `;
  return rows[0] || null;
}

export async function excluirMunicipio(slug) {
  await sql`DELETE FROM municipios WHERE slug = ${slug};`;
}

// ---------- Notícias ----------

export async function listarNoticias() {
  await garantirSchema();
  const { rows } = await sql`
    SELECT slug, titulo, resumo, conteudo,
           imagem_capa AS "imagemCapa",
           categoria, municipio,
           to_char(data_publicacao, 'YYYY-MM-DD') AS "dataPublicacao",
           publicada, destaque, visualizacoes,
           autor, fonte, tags,
           seo_titulo AS "seoTitulo",
           seo_descricao AS "seoDescricao",
           galeria, video_url AS "videoUrl", audio_url AS "audioUrl", arquivos,
           imagem_posicao AS "imagemPosicao", tipo
    FROM noticias ORDER BY data_publicacao DESC;
  `;
  return rows;
}

export async function buscarNoticia(slug) {
  const { rows } = await sql`
    SELECT slug, titulo, resumo, conteudo,
           imagem_capa AS "imagemCapa",
           categoria, municipio,
           to_char(data_publicacao, 'YYYY-MM-DD') AS "dataPublicacao",
           publicada, destaque, visualizacoes,
           autor, fonte, tags,
           seo_titulo AS "seoTitulo",
           seo_descricao AS "seoDescricao",
           galeria, video_url AS "videoUrl", audio_url AS "audioUrl", arquivos,
           imagem_posicao AS "imagemPosicao", tipo
    FROM noticias WHERE slug = ${slug};
  `;
  return rows[0] || null;
}

// A notícia marcada como destaque (ou, se nenhuma estiver marcada, a mais recente).
export async function buscarNoticiaDestaque() {
  const { rows } = await sql`
    SELECT slug, titulo, resumo, imagem_capa AS "imagemCapa", categoria,
           to_char(data_publicacao, 'YYYY-MM-DD') AS "dataPublicacao",
           imagem_posicao AS "imagemPosicao"
    FROM noticias
    WHERE publicada = true
    ORDER BY destaque DESC, data_publicacao DESC
    LIMIT 1;
  `;
  return rows[0] || null;
}

export async function criarNoticia(slug, dados) {
  const { rows } = await sql`
    INSERT INTO noticias (
      slug, titulo, resumo, conteudo, imagem_capa, categoria, municipio, data_publicacao, publicada, destaque,
      autor, fonte, tags, seo_titulo, seo_descricao, galeria, video_url, audio_url, arquivos, imagem_posicao, tipo
    )
    VALUES (
      ${slug}, ${dados.titulo || ""}, ${dados.resumo || ""}, ${dados.conteudo || ""},
      ${dados.imagemCapa || ""}, ${dados.categoria || "Geral"}, ${dados.municipio || ""},
      ${dados.dataPublicacao || new Date().toISOString().slice(0, 10)},
      ${dados.publicada !== undefined ? dados.publicada : true},
      ${dados.destaque || false},
      ${dados.autor || ""}, ${dados.fonte || ""}, ${JSON.stringify(dados.tags || [])},
      ${dados.seoTitulo || ""}, ${dados.seoDescricao || ""},
      ${JSON.stringify(dados.galeria || [])}, ${dados.videoUrl || ""}, ${dados.audioUrl || ""},
      ${JSON.stringify(dados.arquivos || [])}, ${dados.imagemPosicao || "center center"},
      ${dados.tipo || "informacao"}
    )
    RETURNING slug;
  `;
  return buscarNoticia(rows[0].slug);
}

export async function atualizarNoticia(slug, dados) {
  await sql`
    UPDATE noticias SET
      titulo = ${dados.titulo},
      resumo = ${dados.resumo},
      conteudo = ${dados.conteudo},
      imagem_capa = ${dados.imagemCapa},
      categoria = ${dados.categoria},
      municipio = ${dados.municipio},
      data_publicacao = ${dados.dataPublicacao},
      publicada = ${dados.publicada},
      destaque = ${dados.destaque || false},
      autor = ${dados.autor || ""},
      fonte = ${dados.fonte || ""},
      tags = ${JSON.stringify(dados.tags || [])},
      seo_titulo = ${dados.seoTitulo || ""},
      seo_descricao = ${dados.seoDescricao || ""},
      galeria = ${JSON.stringify(dados.galeria || [])},
      video_url = ${dados.videoUrl || ""},
      audio_url = ${dados.audioUrl || ""},
      arquivos = ${JSON.stringify(dados.arquivos || [])},
      imagem_posicao = ${dados.imagemPosicao || "center center"},
      tipo = ${dados.tipo || "informacao"}
    WHERE slug = ${slug};
  `;
  return buscarNoticia(slug);
}

export async function excluirNoticia(slug) {
  await sql`DELETE FROM noticias WHERE slug = ${slug};`;
}

// Usada na listagem pública, com paginação e filtro opcional por categoria.
export async function listarNoticiasPaginado({ pagina = 1, porPagina = 9, categoria = "" } = {}) {
  await garantirSchema();
  const offset = (pagina - 1) * porPagina;

  const { rows } = categoria
    ? await sql`
        SELECT slug, titulo, resumo, imagem_capa AS "imagemCapa", categoria, visualizacoes,
               to_char(data_publicacao, 'YYYY-MM-DD') AS "dataPublicacao",
               imagem_posicao AS "imagemPosicao", municipio
        FROM noticias
        WHERE publicada = true AND categoria = ${categoria}
        ORDER BY data_publicacao DESC
        LIMIT ${porPagina} OFFSET ${offset};
      `
    : await sql`
        SELECT slug, titulo, resumo, imagem_capa AS "imagemCapa", categoria, visualizacoes,
               to_char(data_publicacao, 'YYYY-MM-DD') AS "dataPublicacao",
               imagem_posicao AS "imagemPosicao", municipio
        FROM noticias
        WHERE publicada = true
        ORDER BY data_publicacao DESC
        LIMIT ${porPagina} OFFSET ${offset};
      `;

  const { rows: contagem } = categoria
    ? await sql`SELECT COUNT(*)::int AS total FROM noticias WHERE publicada = true AND categoria = ${categoria};`
    : await sql`SELECT COUNT(*)::int AS total FROM noticias WHERE publicada = true;`;

  return {
    noticias: rows,
    total: contagem[0].total,
    totalPaginas: Math.max(1, Math.ceil(contagem[0].total / porPagina)),
  };
}

// Lista as categorias distintas já usadas, para montar os filtros.
export async function listarCategorias() {
  const { rows } = await sql`
    SELECT DISTINCT categoria FROM noticias WHERE publicada = true ORDER BY categoria ASC;
  `;
  return rows.map((r) => r.categoria).filter(Boolean);
}

// Soma 1 na contagem de visualizações de uma notícia (chamado quando a
// página da notícia é aberta). Falha em silêncio, para nunca quebrar a
// exibição da notícia por causa disso.
export async function incrementarVisualizacao(slug) {
  try {
    await sql`UPDATE noticias SET visualizacoes = visualizacoes + 1 WHERE slug = ${slug};`;
  } catch (erro) {
    // Silencioso de propósito.
  }
}

// As notícias mais visualizadas, para a seção "Mais lidas".
export async function listarMaisLidas(limite = 5) {
  const { rows } = await sql`
    SELECT slug, titulo, categoria
    FROM noticias
    WHERE publicada = true
    ORDER BY visualizacoes DESC, data_publicacao DESC
    LIMIT ${limite};
  `;
  return rows;
}

// ---------- Propagandas ----------

export async function listarPropagandas() {
  const { rows } = await sql`
    SELECT id, nome, categoria, descricao, telefone, municipio, fotos, video, ativo,
           posicao, link, imagem, ordem,
           to_char(data_inicio, 'YYYY-MM-DD') AS "dataInicio",
           to_char(data_fim, 'YYYY-MM-DD') AS "dataFim"
    FROM propagandas ORDER BY ordem ASC, nome ASC;
  `;
  return rows;
}

export async function listarPropagandasRecentes(limite = 6) {
  const { rows } = await sql`
    SELECT id, nome, categoria, descricao, telefone, municipio, fotos, video, ativo,
           posicao, link, imagem, ordem
    FROM propagandas
    WHERE ativo = true
      AND (data_inicio IS NULL OR data_inicio <= CURRENT_DATE)
      AND (data_fim IS NULL OR data_fim >= CURRENT_DATE)
    ORDER BY ordem ASC, criado_em DESC
    LIMIT ${limite};
  `;
  return rows;
}

export async function criarPropaganda(id, dados) {
  const { rows } = await sql`
    INSERT INTO propagandas (id, nome, categoria, descricao, telefone, municipio, fotos, video, ativo, posicao, link, imagem, data_inicio, data_fim, ordem)
    VALUES (
      ${id}, ${dados.nome || ""}, ${dados.categoria || "Loja"}, ${dados.descricao || ""},
      ${dados.telefone || ""}, ${dados.municipio || ""}, ${JSON.stringify(dados.fotos || [])},
      ${dados.video || ""}, ${dados.ativo !== undefined ? dados.ativo : true},
      ${dados.posicao || "lista"}, ${dados.link || ""}, ${dados.imagem || ""},
      ${dados.dataInicio || null}, ${dados.dataFim || null}, ${dados.ordem || 0}
    )
    RETURNING id, nome, categoria, descricao, telefone, municipio, fotos, video, ativo,
              posicao, link, imagem, ordem;
  `;
  return rows[0];
}

export async function atualizarPropaganda(id, dados) {
  const { rows } = await sql`
    UPDATE propagandas SET
      nome = ${dados.nome},
      categoria = ${dados.categoria},
      descricao = ${dados.descricao},
      telefone = ${dados.telefone},
      municipio = ${dados.municipio},
      fotos = ${JSON.stringify(dados.fotos || [])},
      video = ${dados.video},
      ativo = ${dados.ativo},
      posicao = ${dados.posicao || "lista"},
      link = ${dados.link || ""},
      imagem = ${dados.imagem || ""},
      data_inicio = ${dados.dataInicio || null},
      data_fim = ${dados.dataFim || null},
      ordem = ${dados.ordem || 0}
    WHERE id = ${id}
    RETURNING id, nome, categoria, descricao, telefone, municipio, fotos, video, ativo,
              posicao, link, imagem, ordem;
  `;
  return rows[0] || null;
}

export async function excluirPropaganda(id) {
  await sql`DELETE FROM propagandas WHERE id = ${id};`;
}

// ---------- Configuração (linha única) ----------

export async function buscarConfig() {
  await garantirSchema();
  const { rows } = await sql`
    SELECT chave_pix AS "chavePix",
           mensagem_doacao AS "mensagemDoacao",
           sobre_texto AS "sobreTexto",
           responsavel,
           adsense_client_id AS "adsenseClientId",
           telefone_contato AS "telefoneContato",
           email_contato AS "emailContato",
           responsavel_foto AS "responsavelFoto",
           responsavel_bio AS "responsavelBio",
           administrador_nome AS "administradorNome",
           administrador_foto AS "administradorFoto",
           coordenador_nome AS "coordenadorNome",
           coordenador_foto AS "coordenadorFoto",
           instagram_url AS "instagramUrl",
           facebook_url AS "facebookUrl",
           twitter_url AS "twitterUrl"
    FROM config WHERE id = 1;
  `;
  return rows[0] || null;
}

export async function atualizarConfig(dados) {
  const { rows } = await sql`
    UPDATE config SET
      chave_pix = ${dados.chavePix},
      mensagem_doacao = ${dados.mensagemDoacao},
      sobre_texto = ${dados.sobreTexto},
      responsavel = ${dados.responsavel},
      adsense_client_id = ${dados.adsenseClientId || ""},
      telefone_contato = ${dados.telefoneContato || ""},
      email_contato = ${dados.emailContato || ""},
      responsavel_foto = ${dados.responsavelFoto || ""},
      responsavel_bio = ${dados.responsavelBio || ""},
      administrador_nome = ${dados.administradorNome || ""},
      administrador_foto = ${dados.administradorFoto || ""},
      coordenador_nome = ${dados.coordenadorNome || ""},
      coordenador_foto = ${dados.coordenadorFoto || ""},
      instagram_url = ${dados.instagramUrl || ""},
      facebook_url = ${dados.facebookUrl || ""},
      twitter_url = ${dados.twitterUrl || ""}
    WHERE id = 1
    RETURNING chave_pix AS "chavePix", mensagem_doacao AS "mensagemDoacao",
              sobre_texto AS "sobreTexto", responsavel, adsense_client_id AS "adsenseClientId",
              telefone_contato AS "telefoneContato", email_contato AS "emailContato",
              responsavel_foto AS "responsavelFoto", responsavel_bio AS "responsavelBio",
              administrador_nome AS "administradorNome", administrador_foto AS "administradorFoto",
              coordenador_nome AS "coordenadorNome", coordenador_foto AS "coordenadorFoto",
              instagram_url AS "instagramUrl", facebook_url AS "facebookUrl", twitter_url AS "twitterUrl";
  `;
  return rows[0] || null;
}

// ---------- Busca ----------

export async function buscar(termo) {
  const termoBusca = `%${termo}%`;

  const { rows: municipios } = await sql`
    SELECT slug, nome, descricao_curta AS "descricaoCurta"
    FROM municipios
    WHERE nome ILIKE ${termoBusca} OR descricao_curta ILIKE ${termoBusca}
    LIMIT 5;
  `;

  const { rows: noticias } = await sql`
    SELECT slug, titulo, resumo, categoria,
           to_char(data_publicacao, 'YYYY-MM-DD') AS "dataPublicacao"
    FROM noticias
    WHERE publicada = true
      AND (titulo ILIKE ${termoBusca} OR resumo ILIKE ${termoBusca} OR conteudo ILIKE ${termoBusca})
    ORDER BY data_publicacao DESC
    LIMIT 10;
  `;

  return { municipios, noticias };
}
