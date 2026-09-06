import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DoacaoBotao from "@/components/DoacaoBotao";
import { buscarConfig } from "@/lib/db";

// Força todas as páginas do site a serem geradas "na hora" (a cada visita),
// em vez de tentar pré-gerar durante o "build". Isso evita erros de build
// quando o banco de dados ainda não existe/não está conectado, e também
// garante que as edições feitas no painel /admin apareçam imediatamente.
export const dynamic = "force-dynamic";

export const metadata = {
  title: {
    default: "Ponto Cariri — Notícias e informações da região do Cariri cearense",
    template: "%s | Ponto Cariri",
  },
  description:
    "Portal de notícias, municípios, previsão do tempo e divulgação de comércios da região do Cariri cearense.",
};

export default async function RootLayout({ children }) {
  const config = await buscarConfig();

  return (
    <html lang="pt-BR">
      <body className="min-h-screen flex flex-col font-sans antialiased text-cariri-preto">
        <Header />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
        <DoacaoBotao
          chavePix={config.chavePix}
          mensagem={config.mensagemDoacao}
        />
      </body>
    </html>
  );
}
