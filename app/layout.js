import "./globals.css";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DoacaoBotao from "@/components/DoacaoBotao";
import AvisoCookies from "@/components/AvisoCookies";
import { buscarConfig } from "@/lib/db";
import { listarMenuPublico, buscarAparencia, APARENCIA_PADRAO } from "@/lib/cms";

export const dynamic = "force-dynamic";

const URL_SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.pontocariri.com.br";

export const viewport = {
  themeColor: "#1B7A43",
};

export const metadata = {
  metadataBase: new URL(URL_SITE),
  title: {
    default: "Ponto Cariri — informação, cultura e riquezas do Cariri",
    template: "%s | Ponto Cariri",
  },
  description:
    "Portal regional do Cariri cearense: cultura, turismo, agro, municípios, preços, eventos e informações úteis.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Ponto Cariri",
    title: "Ponto Cariri — informação, cultura e riquezas do Cariri",
    description:
      "Portal regional do Cariri cearense: cultura, turismo, agro, municípios, preços, eventos e informações úteis.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ponto Cariri",
    description: "Informação, cultura e riquezas do Cariri cearense.",
  },
  alternates: { canonical: URL_SITE },
};

function TemaCss({ aparencia }) {
  const a = { ...APARENCIA_PADRAO, ...aparencia };
  const css = `
    :root {
      --cariri-verde: ${a.corPrincipal};
      --cariri-verde-escuro: ${a.corSecundaria};
      --cariri-verde-claro: ${a.corFundoSuave};
      --cariri-preto: ${a.corTexto};
      --cariri-texto-secundario: ${a.corTextoSecundario || "#4A4E48"};
      --cariri-link: ${a.corLink || a.corPrincipal};
      --cariri-raio: ${a.raioBorda || 12}px;
    }
    body { background-color: ${a.corFundo || "#fff"}; color: ${a.corTexto}; }
  `;
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}

export default async function RootLayout({ children }) {
  const config = (await buscarConfig()) || {};
  let menu = [];
  let aparencia = APARENCIA_PADRAO;
  try {
    [menu, aparencia] = await Promise.all([listarMenuPublico(), buscarAparencia()]);
  } catch {
    menu = [];
  }

  const schemaOrganizacao = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: "Ponto Cariri",
    url: URL_SITE,
    logo: `${URL_SITE}/icon-512`,
    description:
      aparencia.slogan ||
      "Portal regional do Cariri cearense: informação, cultura, turismo e riquezas da região.",
  };

  return (
    <html lang="pt-BR">
      <head>
        {aparencia.faviconUrl && <link rel="icon" href={aparencia.faviconUrl} />}
        <link rel="alternate" type="application/rss+xml" title="Ponto Cariri" href="/feed.xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrganizacao) }}
        />
        <TemaCss aparencia={aparencia} />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
            strategy="beforeInteractive"
          />
        )}
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased text-cariri-preto">
        <Header config={config} menu={menu} aparencia={aparencia} />
        <main className="flex-1 w-full">{children}</main>
        <Footer config={config} />
        <DoacaoBotao chavePix={config?.chavePix} mensagem={config?.mensagemDoacao} />
        <AvisoCookies />
      </body>
    </html>
  );
}
