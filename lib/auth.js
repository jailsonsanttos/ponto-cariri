// lib/auth.js
// Autenticação simples do painel de administração.
// O login é feito comparando usuário e senha com as variáveis de ambiente
// ADMIN_USER e ADMIN_PASSWORD (definidas no arquivo .env.local).
// Depois do login, um cookie de sessão é gravado no navegador do administrador.
//
// Observação técnica: usamos a Web Crypto API (globalThis.crypto.subtle)
// em vez do módulo "crypto" do Node.js, porque o middleware.js roda no
// "Edge Runtime" do Next.js, que não suporta o módulo "crypto" do Node.
// A Web Crypto API funciona tanto no Edge Runtime quanto no Node.js.

const NOME_COOKIE = "ponto_cariri_admin_sessao";

function getSegredo() {
  return process.env.ADMIN_SECRET || "troque-esta-frase-secreta";
}

async function sha256Hex(texto) {
  const codificador = new TextEncoder();
  const dados = codificador.encode(texto);
  const hashBuffer = await crypto.subtle.digest("SHA-256", dados);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Gera o valor esperado do cookie de sessão a partir da chave secreta.
export async function gerarTokenSessao() {
  return sha256Hex(getSegredo());
}

export function validarCredenciais(usuario, senha) {
  const usuarioEsperado = process.env.ADMIN_USER || "admin";
  const senhaEsperada = process.env.ADMIN_PASSWORD || "troque-esta-senha";
  return usuario === usuarioEsperado && senha === senhaEsperada;
}

export async function verificarSessao(request) {
  const cookie = request.cookies.get(NOME_COOKIE);
  if (!cookie) return false;
  const tokenEsperado = await gerarTokenSessao();
  return cookie.value === tokenEsperado;
}

export const NOME_COOKIE_SESSAO = NOME_COOKIE;

// Usado dentro das rotas de API para bloquear ações de escrita
// (criar/editar/excluir) se o administrador não estiver logado.
export async function exigirAdmin(request) {
  return verificarSessao(request);
}
