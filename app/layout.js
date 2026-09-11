import "./globals.css";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DoacaoBotao from "@/components/DoacaoBotao";
import { buscarConfig } from "@/lib/db";

// Força todas as páginas do site a serem geradas "na hora" (a cada visita),
// em vez de tentar pré-gerar durante o "build". Isso evita erros de build
// quando o banco de dados ainda não existe/não está conectado, e também
// garante que as edições feitas no painel /admin apareçam imediatamente.
export const dynamic = "force-dynamic";

const URL_SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://ponto-cariri.vercel.app";

export const viewport = {
  themeColor: "#1B7A43",
};

export const metadata = {
  metadataBase: new URL(URL_SITE),
  title: {
    default: "Ponto Cariri — Notícias e informações da região do Cariri cearense",
    template: "%s | Ponto Cariri",
  },
  description:
    "Portal de notícias, municípios, previsão do tempo e divulgação de comércios da região do Cariri cearense.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Ponto Cariri",
    title: "Ponto Cariri — Notícias e informações da região do Cariri cearense",
    description:
      "Portal de notícias, municípios, previsão do tempo e divulgação de comércios da região do Cariri cearense.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ponto Cariri",
    description:
      "Portal de notícias, municípios, previsão do tempo e divulgação de comércios da região do Cariri cearense.",
  },
};

export default async function RootLayout({ children }) {
  const config = await buscarConfig();

  return (
    <html lang="pt-BR">
      <head>
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
        <Header />
        <main className="flex-1 w-full">{children}</main>
        <Footer config={config} />
        <DoacaoBotao
          chavePix={config.chavePix}
          mensagem={config.mensagemDoacao}
        />
      </body>
    </html>
  );
}
