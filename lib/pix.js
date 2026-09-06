// lib/pix.js
// Gera o "payload" (código Pix Copia e Cola) no padrão EMV do Banco Central,
// para criar o QR Code de doação a partir da chave Pix cadastrada.
// Não depende de nenhuma biblioteca externa.

function tlv(id, valor) {
  const tamanho = String(valor.length).padStart(2, "0");
  return `${id}${tamanho}${valor}`;
}

function crc16(payload) {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc <<= 1;
      }
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

export function gerarPayloadPix({
  chave,
  nomeRecebedor = "PONTO CARIRI",
  cidade = "JUAZEIRO DO NORTE",
  valor = null,
  descricao = "Doacao Ponto Cariri",
}) {
  const merchantAccountInfo = tlv(
    "26",
    tlv("00", "br.gov.bcb.pix") + tlv("01", chave) + tlv("02", descricao.substring(0, 40))
  );

  let payload =
    tlv("00", "01") +
    merchantAccountInfo +
    tlv("52", "0000") +
    tlv("53", "986");

  if (valor) {
    payload += tlv("54", Number(valor).toFixed(2));
  }

  payload +=
    tlv("58", "BR") +
    tlv("59", nomeRecebedor.substring(0, 25).toUpperCase()) +
    tlv("60", cidade.substring(0, 15).toUpperCase()) +
    tlv("62", tlv("05", "***"));

  payload += "6304";
  const crc = crc16(payload);
  return payload + crc;
}
