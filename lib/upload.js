const EXTENSOES = {
  imagem: ["jpg", "jpeg", "png", "webp"],
  video: ["mp4", "webm", "mov", "m4v"],
  audio: ["mp3", "wav", "ogg", "oga", "m4a", "aac"],
  documento: ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "csv"],
};

const MIMES = {
  imagem: ["image/jpeg", "image/png", "image/webp"],
  video: ["video/mp4", "video/webm", "video/quicktime", "video/x-m4v"],
  audio: ["audio/mpeg", "audio/wav", "audio/x-wav", "audio/wave", "audio/ogg", "application/ogg", "audio/mp4", "audio/x-m4a", "audio/aac"],
  documento: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
    "text/csv",
  ],
};

const TAMANHO_MAX = {
  imagem: 8 * 1024 * 1024,
  video: 32 * 1024 * 1024,
  audio: 15 * 1024 * 1024,
  documento: 12 * 1024 * 1024,
};

export function extensaoDe(nome) {
  return (nome || "").split(".").pop()?.toLowerCase() || "";
}

export function tipoDeUpload(arquivo) {
  const ext = extensaoDe(arquivo.name);
  for (const [tipo, lista] of Object.entries(EXTENSOES)) {
    if (lista.includes(ext)) return tipo;
  }
  return null;
}

export function validarArquivo(arquivo) {
  const tipo = tipoDeUpload(arquivo);
  if (!tipo) {
    return { ok: false, erro: "Tipo de arquivo não permitido." };
  }
  if (arquivo.size > TAMANHO_MAX[tipo]) {
    return { ok: false, erro: `Arquivo grande demais para ${tipo}.` };
  }
  const mime = (arquivo.type || "").toLowerCase();
  if (mime && !MIMES[tipo].includes(mime) && mime !== "application/octet-stream") {
    return { ok: false, erro: "O tipo do arquivo não confere com a extensão." };
  }
  return { ok: true, tipo };
}

export function nomeSeguro(nomeOriginal) {
  const ext = extensaoDe(nomeOriginal);
  const base = nomeOriginal
    .replace(/\.[^.]+$/, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  return `${Date.now()}-${base || "arquivo"}.${ext}`;
}
