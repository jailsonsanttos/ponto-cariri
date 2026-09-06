// components/AdSlot.jsx
// Espaço reutilizável para anúncios do Google AdSense.
// Basta configurar o NEXT_PUBLIC_ADSENSE_CLIENT_ID no arquivo .env.local
// e colar o script oficial do AdSense em app/layout.js (ver README.md).
// Enquanto o AdSense não estiver configurado, mostra um espaço reservado.

export default function AdSlot({ label = "Espaço publicitário" }) {
  const temAdsense = Boolean(process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID);

  if (!temAdsense) {
    return (
      <div className="w-full border border-dashed border-cariri-verde-claro rounded-md py-8 text-center text-xs text-cariri-cinza-texto">
        {label} — configure o Google AdSense em .env.local
      </div>
    );
  }

  return (
    <ins
      className="adsbygoogle block"
      style={{ display: "block" }}
      data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
