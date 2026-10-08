function formatarPreco(valor) {
  if (valor == null) return "—";
  return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function TabelaPrecosCariri({ precos = [], limite }) {
  const itens = limite ? precos.slice(0, limite) : precos;

  if (!itens.length) {
    return <p className="text-cariri-cinza-texto">Nenhum preço cadastrado no momento.</p>;
  }

  return (
    <div className="overflow-x-auto border border-cariri-verde-claro rounded-xl">
      <table className="w-full text-sm">
        <thead className="bg-cariri-verde-claro text-left">
          <tr>
            <th className="px-3 py-2">Município</th>
            <th className="px-3 py-2">Produto</th>
            <th className="px-3 py-2">Preço</th>
            <th className="px-3 py-2">Data</th>
            <th className="px-3 py-2">Fonte</th>
          </tr>
        </thead>
        <tbody>
          {itens.map((p) => (
            <tr key={p.id} className="border-t border-cariri-verde-claro">
              <td className="px-3 py-2">{p.municipio || "—"}</td>
              <td className="px-3 py-2">
                {p.produto}
                {p.unidade ? ` (${p.unidade})` : ""}
              </td>
              <td className="px-3 py-2 font-semibold">{formatarPreco(p.preco)}</td>
              <td className="px-3 py-2">
                {p.data ? new Date(p.data + "T12:00:00").toLocaleDateString("pt-BR") : "—"}
              </td>
              <td className="px-3 py-2">{p.fonte || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
