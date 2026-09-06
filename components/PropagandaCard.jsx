export default function PropagandaCard({ propaganda }) {
  return (
    <div className="rounded-lg border border-cariri-verde-claro overflow-hidden bg-white flex flex-col">
      {propaganda.fotos && propaganda.fotos[0] ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={propaganda.fotos[0]}
          alt=""
          className="w-full h-40 object-cover"
        />
      ) : (
        <div className="w-full h-40 bg-cariri-verde-claro" />
      )}
      <div className="p-5 flex-1 flex flex-col">
        <p className="text-xs font-medium text-cariri-verde uppercase tracking-wide">
          {propaganda.categoria}
        </p>
        <p className="mt-1 font-semibold text-cariri-preto">{propaganda.nome}</p>
        <p className="mt-2 text-sm text-cariri-cinza-texto leading-relaxed flex-1">
          {propaganda.descricao}
        </p>
        {propaganda.telefone && (
          <a
            href={`https://wa.me/55${propaganda.telefone.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm font-semibold text-white bg-cariri-verde px-4 py-2 rounded-md text-center hover:bg-cariri-verde-escuro transition-colors"
          >
            Chamar no WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}
