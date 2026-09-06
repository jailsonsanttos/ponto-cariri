// scripts/init-db.mjs
// Roda UMA VEZ para criar as tabelas do banco de dados e importar o
// conteúdo de exemplo (municípios, notícia e anúncio de exemplo,
// configurações). Depois disso, todo o conteúdo é editado pelo painel
// /admin, e este script não precisa ser rodado de novo.
//
// Como usar:
//   1. Crie o banco "Postgres" no painel da Vercel e conecte ao projeto.
//   2. Rode "vercel env pull .env.local" para trazer a variável POSTGRES_URL
//      para o seu computador.
//   3. Rode: npm run db:setup

import { sql } from "@vercel/postgres";
import fs from "fs";
import path from "path";
import { criarTabelas } from "../lib/db.js";

function lerSeed(nomeArquivo) {
  const caminho = path.join(process.cwd(), "data", nomeArquivo);
  return JSON.parse(fs.readFileSync(caminho, "utf-8"));
}

async function main() {
  console.log("Criando tabelas (se ainda não existirem)...");
  await criarTabelas();

  const { rows: municipiosExistentes } = await sql`SELECT COUNT(*)::int AS total FROM municipios;`;
  if (municipiosExistentes[0].total === 0) {
    console.log("Importando municípios de exemplo...");
    const municipios = lerSeed("municipios.json");
    for (const m of municipios) {
      await sql`
        INSERT INTO municipios (slug, nome, descricao_curta, historia, hino_url, latitude, longitude, fotos)
        VALUES (${m.slug}, ${m.nome}, ${m.descricaoCurta}, ${m.historia}, ${m.hinoUrl},
                ${m.latitude}, ${m.longitude}, ${JSON.stringify(m.fotos || [])})
        ON CONFLICT (slug) DO NOTHING;
      `;
    }
  }

  const { rows: noticiasExistentes } = await sql`SELECT COUNT(*)::int AS total FROM noticias;`;
  if (noticiasExistentes[0].total === 0) {
    console.log("Importando notícia de exemplo...");
    const noticias = lerSeed("noticias.json");
    for (const n of noticias) {
      await sql`
        INSERT INTO noticias (slug, titulo, resumo, conteudo, imagem_capa, categoria, municipio, data_publicacao, publicada)
        VALUES (${n.slug}, ${n.titulo}, ${n.resumo}, ${n.conteudo}, ${n.imagemCapa},
                ${n.categoria}, ${n.municipio}, ${n.dataPublicacao}, ${n.publicada})
        ON CONFLICT (slug) DO NOTHING;
      `;
    }
  }

  const { rows: propagandasExistentes } = await sql`SELECT COUNT(*)::int AS total FROM propagandas;`;
  if (propagandasExistentes[0].total === 0) {
    console.log("Importando anúncio de exemplo...");
    const propagandas = lerSeed("propagandas.json");
    for (const p of propagandas) {
      await sql`
        INSERT INTO propagandas (id, nome, categoria, descricao, telefone, municipio, fotos, video, ativo)
        VALUES (${p.id}, ${p.nome}, ${p.categoria}, ${p.descricao}, ${p.telefone},
                ${p.municipio}, ${JSON.stringify(p.fotos || [])}, ${p.video}, ${p.ativo})
        ON CONFLICT (id) DO NOTHING;
      `;
    }
  }

  const { rows: configExistente } = await sql`SELECT COUNT(*)::int AS total FROM config;`;
  if (configExistente[0].total === 0) {
    console.log("Importando configurações iniciais...");
    const config = lerSeed("config.json");
    await sql`
      INSERT INTO config (id, chave_pix, mensagem_doacao, sobre_texto, responsavel, adsense_client_id)
      VALUES (1, ${config.chavePix}, ${config.mensagemDoacao}, ${config.sobreTexto},
              ${config.responsavel}, ${config.adsenseClientId || ""})
      ON CONFLICT (id) DO NOTHING;
    `;
  }

  console.log("Banco de dados pronto! ✅");
  process.exit(0);
}

main().catch((erro) => {
  console.error("Erro ao configurar o banco de dados:", erro);
  process.exit(1);
});
