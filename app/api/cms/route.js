import { NextResponse } from "next/server";
import { exigirAdmin } from "@/lib/auth";
import { garantirSchema } from "@/lib/db";
import {
  listarMenuItens,
  salvarMenuItem,
  excluirMenuItem,
  listarHomeSecoes,
  salvarHomeSecao,
  excluirHomeSecao,
  buscarAparencia,
  atualizarAparencia,
  listarPaginas,
  buscarPaginaCompleta,
  salvarPagina,
  excluirPagina,
  duplicarPagina,
  listarMidia,
  atualizarMidia,
  excluirMidia,
  listarCategoriasCms,
  salvarCategoria,
  excluirCategoria,
  listarPrecos,
  salvarPreco,
  excluirPreco,
  listarEventos,
  salvarEvento,
  excluirEvento,
} from "@/lib/cms";

export const dynamic = "force-dynamic";

async function soAdmin(request) {
  if (!(await exigirAdmin(request))) {
    return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  }
  return null;
}

export async function GET(request) {
  await garantirSchema();
  const recurso = new URL(request.url).searchParams.get("recurso");
  const slug = new URL(request.url).searchParams.get("slug");
  const tipo = new URL(request.url).searchParams.get("tipo") || "";
  const busca = new URL(request.url).searchParams.get("q") || "";

  if (recurso === "menu") return NextResponse.json(await listarMenuItens());
  if (recurso === "home") return NextResponse.json(await listarHomeSecoes());
  if (recurso === "aparencia") return NextResponse.json(await buscarAparencia());
  if (recurso === "paginas") {
    if (slug) return NextResponse.json(await buscarPaginaCompleta(slug));
    return NextResponse.json(await listarPaginas());
  }
  if (recurso === "midia") return NextResponse.json(await listarMidia({ tipo, busca }));
  if (recurso === "categorias") return NextResponse.json(await listarCategoriasCms());
  if (recurso === "precos") return NextResponse.json(await listarPrecos());
  if (recurso === "eventos") return NextResponse.json(await listarEventos());

  return NextResponse.json({ erro: "Recurso inválido." }, { status: 400 });
}

export async function POST(request) {
  const bloqueio = await soAdmin(request);
  if (bloqueio) return bloqueio;

  const corpo = await request.json();
  const { recurso, acao, dados, id, slug } = corpo;

  if (recurso === "menu") {
    if (acao === "excluir") {
      await excluirMenuItem(id);
      return NextResponse.json({ ok: true });
    }
    const salvo = await salvarMenuItem(dados);
    return NextResponse.json({ id: salvo });
  }
  if (recurso === "home") {
    if (acao === "excluir") {
      await excluirHomeSecao(id);
      return NextResponse.json({ ok: true });
    }
    const salvo = await salvarHomeSecao(dados);
    return NextResponse.json({ id: salvo });
  }
  if (recurso === "aparencia") {
    return NextResponse.json(await atualizarAparencia(dados));
  }
  if (recurso === "paginas") {
    if (acao === "excluir") {
      await excluirPagina(slug);
      return NextResponse.json({ ok: true });
    }
    if (acao === "duplicar") {
      return NextResponse.json(await duplicarPagina(slug));
    }
    return NextResponse.json(await salvarPagina(dados));
  }
  if (recurso === "midia") {
    if (acao === "excluir") {
      await excluirMidia(id);
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json(await atualizarMidia(id, dados));
  }
  if (recurso === "categorias") {
    if (acao === "excluir") {
      await excluirCategoria(id);
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json(await salvarCategoria(dados));
  }
  if (recurso === "precos") {
    if (acao === "excluir") {
      await excluirPreco(id);
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ id: await salvarPreco(dados) });
  }
  if (recurso === "eventos") {
    if (acao === "excluir") {
      await excluirEvento(id);
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ id: await salvarEvento(dados) });
  }

  return NextResponse.json({ erro: "Recurso inválido." }, { status: 400 });
}
