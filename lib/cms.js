// Camada CMS: menu, páginas, home modular, mídia, aparência, categorias,
// preços e eventos. Tabelas novas com IF NOT EXISTS — não apaga dados.

import { sql } from "@vercel/postgres";

export const CATEGORIAS_PADRAO = [
  { slug: "agro", nome: "Agro" },
  { slug: "cultura", nome: "Cultura" },
  { slug: "turismo", nome: "Turismo" },
  { slug: "educacao", nome: "Educação" },
  { slug: "tecnologia", nome: "Tecnologia" },
  { slug: "economia-precos", nome: "Economia e preços" },
  { slug: "saude", nome: "Saúde" },
  { slug: "empregos", nome: "Empregos e oportunidades" },
  { slug: "gestao-publica", nome: "Gestão pública" },
  { slug: "meio-ambiente", nome: "Meio ambiente" },
  { slug: "dados-do-cariri", nome: "Dados do Cariri" },
  { slug: "eventos", nome: "Eventos" },
  { slug: "curiosidades", nome: "Curiosidades" },
];

export const APARENCIA_PADRAO = {
  corPrincipal: "#1B7A43",
  corSecundaria: "#124F2C",
  corFundoSuave: "#E7F4EC",
  corTexto: "#12130F",
  corTextoSecundario: "#4A4E48",
  corFundo: "#FFFFFF",
  corLink: "#1B7A43",
  raioBorda: "12",
  slogan: "Informação, cultura e riquezas do Cariri",
  logoUrl: "/logo.png",
  logoBrancoUrl: "/logo-branco.png",
  faviconUrl: "",
  fonte: "sistema",
};

export async function criarTabelasCms() {
  await sql`
    CREATE TABLE IF NOT EXISTS categorias (
      slug TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      descricao TEXT DEFAULT '',
      ordem INTEGER DEFAULT 0,
      ativo BOOLEAN DEFAULT true
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS menu_itens (
      id TEXT PRIMARY KEY,
      parent_id TEXT,
      label TEXT NOT NULL,
      href TEXT DEFAULT '',
      tipo TEXT DEFAULT 'link',
      alvo TEXT DEFAULT '',
      icone TEXT DEFAULT '',
      ordem INTEGER DEFAULT 0,
      visivel BOOLEAN DEFAULT true
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS home_secoes (
      id TEXT PRIMARY KEY,
      tipo TEXT NOT NULL,
      titulo TEXT DEFAULT '',
      dados JSONB DEFAULT '{}',
      ordem INTEGER DEFAULT 0,
      ativo BOOLEAN DEFAULT true
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS paginas (
      slug TEXT PRIMARY KEY,
      titulo TEXT NOT NULL,
      publicada BOOLEAN DEFAULT true,
      seo_titulo TEXT DEFAULT '',
      seo_descricao TEXT DEFAULT ''
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS pagina_blocos (
      id TEXT PRIMARY KEY,
      pagina_slug TEXT NOT NULL,
      tipo TEXT NOT NULL,
      dados JSONB DEFAULT '{}',
      ordem INTEGER DEFAULT 0
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS aparencia (
      id INTEGER PRIMARY KEY DEFAULT 1,
      dados JSONB DEFAULT '{}'
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS midia (
      id TEXT PRIMARY KEY,
      tipo TEXT NOT NULL,
      url TEXT NOT NULL,
      nome TEXT DEFAULT '',
      alt TEXT DEFAULT '',
      legenda TEXT DEFAULT '',
      credito TEXT DEFAULT '',
      municipio_slug TEXT DEFAULT '',
      tags TEXT DEFAULT '',
      criado_em TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS eventos (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE,
      titulo TEXT NOT NULL,
      resumo TEXT DEFAULT '',
      conteudo TEXT DEFAULT '',
      municipio TEXT DEFAULT '',
      local TEXT DEFAULT '',
      data_inicio DATE,
      data_fim DATE,
      imagem TEXT DEFAULT '',
      publicado BOOLEAN DEFAULT true
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS precos (
      id TEXT PRIMARY KEY,
      municipio TEXT DEFAULT '',
      produto TEXT NOT NULL,
      categoria TEXT DEFAULT 'agricola',
      preco NUMERIC(12,2),
      unidade TEXT DEFAULT '',
      data DATE DEFAULT CURRENT_DATE,
      fonte TEXT DEFAULT ''
    );
  `;

  await sql`ALTER TABLE noticias ADD COLUMN IF NOT EXISTS autor TEXT DEFAULT '';`;
  await sql`ALTER TABLE noticias ADD COLUMN IF NOT EXISTS fonte TEXT DEFAULT '';`;
  await sql`ALTER TABLE noticias ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]';`;
  await sql`ALTER TABLE noticias ADD COLUMN IF NOT EXISTS seo_titulo TEXT DEFAULT '';`;
  await sql`ALTER TABLE noticias ADD COLUMN IF NOT EXISTS seo_descricao TEXT DEFAULT '';`;
  await sql`ALTER TABLE noticias ADD COLUMN IF NOT EXISTS galeria JSONB DEFAULT '[]';`;
  await sql`ALTER TABLE noticias ADD COLUMN IF NOT EXISTS video_url TEXT DEFAULT '';`;
  await sql`ALTER TABLE noticias ADD COLUMN IF NOT EXISTS audio_url TEXT DEFAULT '';`;
  await sql`ALTER TABLE noticias ADD COLUMN IF NOT EXISTS arquivos JSONB DEFAULT '[]';`;
  await sql`ALTER TABLE noticias ADD COLUMN IF NOT EXISTS imagem_posicao TEXT DEFAULT 'center center';`;
  await sql`ALTER TABLE noticias ADD COLUMN IF NOT EXISTS tipo TEXT DEFAULT 'informacao';`;

  await sql`ALTER TABLE municipios ADD COLUMN IF NOT EXISTS populacao TEXT DEFAULT '';`;
  await sql`ALTER TABLE municipios ADD COLUMN IF NOT EXISTS secoes JSONB DEFAULT '{}';`;

  await sql`ALTER TABLE propagandas ADD COLUMN IF NOT EXISTS posicao TEXT DEFAULT 'lista';`;
  await sql`ALTER TABLE propagandas ADD COLUMN IF NOT EXISTS link TEXT DEFAULT '';`;
  await sql`ALTER TABLE propagandas ADD COLUMN IF NOT EXISTS imagem TEXT DEFAULT '';`;
  await sql`ALTER TABLE propagandas ADD COLUMN IF NOT EXISTS data_inicio DATE;`;
  await sql`ALTER TABLE propagandas ADD COLUMN IF NOT EXISTS data_fim DATE;`;
  await sql`ALTER TABLE propagandas ADD COLUMN IF NOT EXISTS ordem INTEGER DEFAULT 0;`;
}

export async function seedCms() {
  const { rows: cat } = await sql`SELECT COUNT(*)::int AS total FROM categorias;`;
  if (cat[0].total === 0) {
    let ordem = 1;
    for (const c of CATEGORIAS_PADRAO) {
      await sql`
        INSERT INTO categorias (slug, nome, ordem, ativo)
        VALUES (${c.slug}, ${c.nome}, ${ordem}, true)
        ON CONFLICT (slug) DO NOTHING;
      `;
      ordem += 1;
    }
  }

  const { rows: menu } = await sql`SELECT COUNT(*)::int AS total FROM menu_itens;`;
  if (menu[0].total === 0) {
    const itens = [
      { id: "inicio", parent: null, label: "Início", href: "/", ordem: 1 },
      { id: "informacoes", parent: null, label: "Informações", href: "/informacoes", ordem: 2 },
      { id: "municipios", parent: null, label: "Municípios", href: "/municipios", ordem: 3 },
      { id: "publicidade", parent: null, label: "Publicidade", href: "/publicidade", ordem: 4 },
      { id: "tempo", parent: null, label: "Tempo", href: "/tempo", ordem: 5 },
      { id: "sobre", parent: null, label: "Sobre", href: "/sobre", ordem: 6 },
    ];
    for (const i of itens) {
      await sql`
        INSERT INTO menu_itens (id, parent_id, label, href, tipo, ordem, visivel)
        VALUES (${i.id}, ${i.parent}, ${i.label}, ${i.href}, 'link', ${i.ordem}, true)
        ON CONFLICT (id) DO NOTHING;
      `;
    }
    let sub = 1;
    for (const c of CATEGORIAS_PADRAO) {
      await sql`
        INSERT INTO menu_itens (id, parent_id, label, href, tipo, alvo, ordem, visivel)
        VALUES (
          ${"cat-" + c.slug},
          'informacoes',
          ${c.nome},
          ${"/informacoes?categoria=" + encodeURIComponent(c.nome)},
          'categoria',
          ${c.nome},
          ${sub},
          true
        )
        ON CONFLICT (id) DO NOTHING;
      `;
      sub += 1;
    }
  }

  const { rows: home } = await sql`SELECT COUNT(*)::int AS total FROM home_secoes;`;
  if (home[0].total === 0) {
    const secoes = [
      { id: "tempo", tipo: "tempo", titulo: "", ordem: 1, dados: {} },
      { id: "destaque", tipo: "destaque", titulo: "Destaques", ordem: 2, dados: {} },
      {
        id: "recentes",
        tipo: "publicacoes",
        titulo: "Informações recentes",
        ordem: 3,
        dados: { limite: 10 },
      },
      { id: "mais-lidas", tipo: "mais_lidas", titulo: "Mais lidas", ordem: 4, dados: { limite: 5 } },
      {
        id: "publicidade",
        tipo: "publicidade",
        titulo: "Publicidade local",
        ordem: 5,
        dados: { limite: 3 },
      },
      { id: "precos", tipo: "precos", titulo: "Preços do Cariri", ordem: 6, dados: { limite: 8 } },
      { id: "eventos", tipo: "eventos", titulo: "Eventos", ordem: 7, dados: { limite: 4 } },
    ];
    for (const s of secoes) {
      await sql`
        INSERT INTO home_secoes (id, tipo, titulo, dados, ordem, ativo)
        VALUES (${s.id}, ${s.tipo}, ${s.titulo}, ${JSON.stringify(s.dados)}, ${s.ordem}, ${s.id !== "precos" && s.id !== "eventos"})
        ON CONFLICT (id) DO NOTHING;
      `;
    }
  }

  const { rows: apa } = await sql`SELECT COUNT(*)::int AS total FROM aparencia;`;
  if (apa[0].total === 0) {
    await sql`
      INSERT INTO aparencia (id, dados)
      VALUES (1, ${JSON.stringify(APARENCIA_PADRAO)})
      ON CONFLICT (id) DO NOTHING;
    `;
  }

  const { rows: pag } = await sql`SELECT COUNT(*)::int AS total FROM paginas WHERE slug = 'sobre';`;
  if (pag[0].total === 0) {
    const { rows: cfg } = await sql`SELECT sobre_texto AS texto FROM config WHERE id = 1;`;
    const texto = cfg[0]?.texto || "";
    await sql`
      INSERT INTO paginas (slug, titulo, publicada, seo_titulo, seo_descricao)
      VALUES ('sobre', 'Sobre o Ponto Cariri', true, 'Sobre o Ponto Cariri', 'Conheça o Ponto Cariri, portal regional do Cariri cearense.')
      ON CONFLICT (slug) DO NOTHING;
    `;
    if (texto) {
      await sql`
        INSERT INTO pagina_blocos (id, pagina_slug, tipo, dados, ordem)
        VALUES ('sobre-texto', 'sobre', 'texto', ${JSON.stringify({ html: "" , texto })}, 1)
        ON CONFLICT (id) DO NOTHING;
      `;
    }
  }
}

function novoId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function listarCategoriasCms() {
  const { rows } = await sql`
    SELECT slug, nome, descricao, ordem, ativo FROM categorias ORDER BY ordem ASC, nome ASC;
  `;
  return rows;
}

export async function salvarCategoria(dados) {
  const slug = dados.slug;
  await sql`
    INSERT INTO categorias (slug, nome, descricao, ordem, ativo)
    VALUES (${slug}, ${dados.nome || slug}, ${dados.descricao || ""}, ${dados.ordem || 0}, ${dados.ativo !== false})
    ON CONFLICT (slug) DO UPDATE SET
      nome = EXCLUDED.nome,
      descricao = EXCLUDED.descricao,
      ordem = EXCLUDED.ordem,
      ativo = EXCLUDED.ativo;
  `;
  return buscarCategoria(slug);
}

export async function buscarCategoria(slug) {
  const { rows } = await sql`SELECT slug, nome, descricao, ordem, ativo FROM categorias WHERE slug = ${slug};`;
  return rows[0] || null;
}

export async function excluirCategoria(slug) {
  await sql`DELETE FROM categorias WHERE slug = ${slug};`;
}

export async function listarMenuItens() {
  const { rows } = await sql`
    SELECT id, parent_id AS "parentId", label, href, tipo, alvo, icone, ordem, visivel
    FROM menu_itens ORDER BY ordem ASC, label ASC;
  `;
  return rows;
}

export function montarArvoreMenu(itens) {
  const visiveis = itens.filter((i) => i.visivel !== false);
  const filhos = visiveis.filter((i) => i.parentId);
  const raizes = visiveis.filter((i) => !i.parentId);
  return raizes.map((r) => ({
    ...r,
    filhos: filhos.filter((f) => f.parentId === r.id).sort((a, b) => a.ordem - b.ordem),
  }));
}

export async function listarMenuPublico() {
  const itens = await listarMenuItens();
  return montarArvoreMenu(itens);
}

export async function salvarMenuItem(dados) {
  const id = dados.id || novoId();
  await sql`
    INSERT INTO menu_itens (id, parent_id, label, href, tipo, alvo, icone, ordem, visivel)
    VALUES (
      ${id}, ${dados.parentId || null}, ${dados.label || ""}, ${dados.href || ""},
      ${dados.tipo || "link"}, ${dados.alvo || ""}, ${dados.icone || ""},
      ${dados.ordem || 0}, ${dados.visivel !== false}
    )
    ON CONFLICT (id) DO UPDATE SET
      parent_id = EXCLUDED.parent_id,
      label = EXCLUDED.label,
      href = EXCLUDED.href,
      tipo = EXCLUDED.tipo,
      alvo = EXCLUDED.alvo,
      icone = EXCLUDED.icone,
      ordem = EXCLUDED.ordem,
      visivel = EXCLUDED.visivel;
  `;
  return id;
}

export async function excluirMenuItem(id) {
  await sql`DELETE FROM menu_itens WHERE parent_id = ${id};`;
  await sql`DELETE FROM menu_itens WHERE id = ${id};`;
}

export async function listarHomeSecoes(somenteAtivas = false) {
  const { rows } = somenteAtivas
    ? await sql`
        SELECT id, tipo, titulo, dados, ordem, ativo FROM home_secoes
        WHERE ativo = true ORDER BY ordem ASC;
      `
    : await sql`SELECT id, tipo, titulo, dados, ordem, ativo FROM home_secoes ORDER BY ordem ASC;`;
  return rows;
}

export async function salvarHomeSecao(dados) {
  const id = dados.id || novoId();
  await sql`
    INSERT INTO home_secoes (id, tipo, titulo, dados, ordem, ativo)
    VALUES (
      ${id}, ${dados.tipo || "publicacoes"}, ${dados.titulo || ""},
      ${JSON.stringify(dados.dados || {})}, ${dados.ordem || 0}, ${dados.ativo !== false}
    )
    ON CONFLICT (id) DO UPDATE SET
      tipo = EXCLUDED.tipo,
      titulo = EXCLUDED.titulo,
      dados = EXCLUDED.dados,
      ordem = EXCLUDED.ordem,
      ativo = EXCLUDED.ativo;
  `;
  return id;
}

export async function excluirHomeSecao(id) {
  await sql`DELETE FROM home_secoes WHERE id = ${id};`;
}

export async function buscarAparencia() {
  const { rows } = await sql`SELECT dados FROM aparencia WHERE id = 1;`;
  return { ...APARENCIA_PADRAO, ...(rows[0]?.dados || {}) };
}

export async function atualizarAparencia(dados) {
  const atual = await buscarAparencia();
  const mesclado = { ...atual, ...dados };
  await sql`
    INSERT INTO aparencia (id, dados) VALUES (1, ${JSON.stringify(mesclado)})
    ON CONFLICT (id) DO UPDATE SET dados = EXCLUDED.dados;
  `;
  return mesclado;
}

export async function listarPaginas() {
  const { rows } = await sql`
    SELECT slug, titulo, publicada, seo_titulo AS "seoTitulo", seo_descricao AS "seoDescricao"
    FROM paginas ORDER BY titulo ASC;
  `;
  return rows;
}

export async function buscarPaginaCompleta(slug) {
  const { rows } = await sql`
    SELECT slug, titulo, publicada, seo_titulo AS "seoTitulo", seo_descricao AS "seoDescricao"
    FROM paginas WHERE slug = ${slug};
  `;
  if (!rows[0]) return null;
  const { rows: blocos } = await sql`
    SELECT id, tipo, dados, ordem FROM pagina_blocos
    WHERE pagina_slug = ${slug} ORDER BY ordem ASC;
  `;
  return { ...rows[0], blocos };
}

export async function salvarPagina(dados) {
  const slug = dados.slug;
  await sql`
    INSERT INTO paginas (slug, titulo, publicada, seo_titulo, seo_descricao)
    VALUES (${slug}, ${dados.titulo || slug}, ${dados.publicada !== false}, ${dados.seoTitulo || ""}, ${dados.seoDescricao || ""})
    ON CONFLICT (slug) DO UPDATE SET
      titulo = EXCLUDED.titulo,
      publicada = EXCLUDED.publicada,
      seo_titulo = EXCLUDED.seo_titulo,
      seo_descricao = EXCLUDED.seo_descricao;
  `;
  if (Array.isArray(dados.blocos)) {
    await sql`DELETE FROM pagina_blocos WHERE pagina_slug = ${slug};`;
    let ordem = 1;
    for (const b of dados.blocos) {
      await sql`
        INSERT INTO pagina_blocos (id, pagina_slug, tipo, dados, ordem)
        VALUES (${b.id || novoId()}, ${slug}, ${b.tipo || "texto"}, ${JSON.stringify(b.dados || {})}, ${ordem});
      `;
      ordem += 1;
    }
  }
  return buscarPaginaCompleta(slug);
}

export async function excluirPagina(slug) {
  await sql`DELETE FROM pagina_blocos WHERE pagina_slug = ${slug};`;
  await sql`DELETE FROM paginas WHERE slug = ${slug};`;
}

export async function duplicarPagina(slug) {
  const pagina = await buscarPaginaCompleta(slug);
  if (!pagina) return null;
  const novoSlug = `${slug}-copia-${Date.now().toString(36)}`;
  return salvarPagina({
    ...pagina,
    slug: novoSlug,
    titulo: `${pagina.titulo} (cópia)`,
    publicada: false,
    blocos: pagina.blocos,
  });
}

export async function listarMidia({ tipo = "", busca = "" } = {}) {
  const termo = `%${busca}%`;
  if (tipo && busca) {
    const { rows } = await sql`
      SELECT id, tipo, url, nome, alt, legenda, credito,
             municipio_slug AS "municipioSlug", tags, criado_em AS "criadoEm"
      FROM midia
      WHERE tipo = ${tipo}
        AND (nome ILIKE ${termo} OR alt ILIKE ${termo} OR tags ILIKE ${termo} OR municipio_slug ILIKE ${termo})
      ORDER BY criado_em DESC;
    `;
    return rows;
  }
  if (tipo) {
    const { rows } = await sql`
      SELECT id, tipo, url, nome, alt, legenda, credito,
             municipio_slug AS "municipioSlug", tags, criado_em AS "criadoEm"
      FROM midia WHERE tipo = ${tipo} ORDER BY criado_em DESC;
    `;
    return rows;
  }
  if (busca) {
    const { rows } = await sql`
      SELECT id, tipo, url, nome, alt, legenda, credito,
             municipio_slug AS "municipioSlug", tags, criado_em AS "criadoEm"
      FROM midia
      WHERE nome ILIKE ${termo} OR alt ILIKE ${termo} OR tags ILIKE ${termo} OR municipio_slug ILIKE ${termo}
      ORDER BY criado_em DESC;
    `;
    return rows;
  }
  const { rows } = await sql`
    SELECT id, tipo, url, nome, alt, legenda, credito,
           municipio_slug AS "municipioSlug", tags, criado_em AS "criadoEm"
    FROM midia ORDER BY criado_em DESC LIMIT 200;
  `;
  return rows;
}

export async function criarMidia(dados) {
  const id = dados.id || novoId();
  const { rows } = await sql`
    INSERT INTO midia (id, tipo, url, nome, alt, legenda, credito, municipio_slug, tags)
    VALUES (
      ${id}, ${dados.tipo || "imagem"}, ${dados.url}, ${dados.nome || ""},
      ${dados.alt || ""}, ${dados.legenda || ""}, ${dados.credito || ""},
      ${dados.municipioSlug || ""}, ${dados.tags || ""}
    )
    RETURNING id, tipo, url, nome, alt, legenda, credito,
              municipio_slug AS "municipioSlug", tags, criado_em AS "criadoEm";
  `;
  return rows[0];
}

export async function atualizarMidia(id, dados) {
  const { rows } = await sql`
    UPDATE midia SET
      nome = ${dados.nome || ""},
      alt = ${dados.alt || ""},
      legenda = ${dados.legenda || ""},
      credito = ${dados.credito || ""},
      municipio_slug = ${dados.municipioSlug || ""},
      tags = ${dados.tags || ""},
      url = ${dados.url || ""}
    WHERE id = ${id}
    RETURNING id, tipo, url, nome, alt, legenda, credito,
              municipio_slug AS "municipioSlug", tags, criado_em AS "criadoEm";
  `;
  return rows[0] || null;
}

export async function excluirMidia(id) {
  await sql`DELETE FROM midia WHERE id = ${id};`;
}

export async function listarEventos({ publicados = false } = {}) {
  const { rows } = publicados
    ? await sql`
        SELECT id, slug, titulo, resumo, conteudo, municipio, local,
               to_char(data_inicio, 'YYYY-MM-DD') AS "dataInicio",
               to_char(data_fim, 'YYYY-MM-DD') AS "dataFim",
               imagem, publicado
        FROM eventos WHERE publicado = true
        ORDER BY data_inicio DESC NULLS LAST;
      `
    : await sql`
        SELECT id, slug, titulo, resumo, conteudo, municipio, local,
               to_char(data_inicio, 'YYYY-MM-DD') AS "dataInicio",
               to_char(data_fim, 'YYYY-MM-DD') AS "dataFim",
               imagem, publicado
        FROM eventos ORDER BY data_inicio DESC NULLS LAST;
      `;
  return rows;
}

export async function salvarEvento(dados) {
  const id = dados.id || novoId();
  const slug = dados.slug || id;
  await sql`
    INSERT INTO eventos (id, slug, titulo, resumo, conteudo, municipio, local, data_inicio, data_fim, imagem, publicado)
    VALUES (
      ${id}, ${slug}, ${dados.titulo || ""}, ${dados.resumo || ""}, ${dados.conteudo || ""},
      ${dados.municipio || ""}, ${dados.local || ""}, ${dados.dataInicio || null},
      ${dados.dataFim || null}, ${dados.imagem || ""}, ${dados.publicado !== false}
    )
    ON CONFLICT (id) DO UPDATE SET
      slug = EXCLUDED.slug,
      titulo = EXCLUDED.titulo,
      resumo = EXCLUDED.resumo,
      conteudo = EXCLUDED.conteudo,
      municipio = EXCLUDED.municipio,
      local = EXCLUDED.local,
      data_inicio = EXCLUDED.data_inicio,
      data_fim = EXCLUDED.data_fim,
      imagem = EXCLUDED.imagem,
      publicado = EXCLUDED.publicado;
  `;
  return id;
}

export async function excluirEvento(id) {
  await sql`DELETE FROM eventos WHERE id = ${id};`;
}

export async function listarPrecos() {
  const { rows } = await sql`
    SELECT id, municipio, produto, categoria, preco, unidade,
           to_char(data, 'YYYY-MM-DD') AS data, fonte
    FROM precos ORDER BY data DESC, municipio ASC;
  `;
  return rows.map((r) => ({ ...r, preco: r.preco != null ? Number(r.preco) : null }));
}

export async function salvarPreco(dados) {
  const id = dados.id || novoId();
  await sql`
    INSERT INTO precos (id, municipio, produto, categoria, preco, unidade, data, fonte)
    VALUES (
      ${id}, ${dados.municipio || ""}, ${dados.produto || ""}, ${dados.categoria || "agricola"},
      ${dados.preco || null}, ${dados.unidade || ""}, ${dados.data || null}, ${dados.fonte || ""}
    )
    ON CONFLICT (id) DO UPDATE SET
      municipio = EXCLUDED.municipio,
      produto = EXCLUDED.produto,
      categoria = EXCLUDED.categoria,
      preco = EXCLUDED.preco,
      unidade = EXCLUDED.unidade,
      data = EXCLUDED.data,
      fonte = EXCLUDED.fonte;
  `;
  return id;
}

export async function excluirPreco(id) {
  await sql`DELETE FROM precos WHERE id = ${id};`;
}
