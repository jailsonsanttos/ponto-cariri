export const metadata = { title: "Política de Privacidade" };

export default function PrivacidadePage() {
  return (
    <div className="max-w-content mx-auto px-5 py-12">
      <div className="max-w-2xl prose-noticia">
        <h1 className="text-3xl font-bold text-cariri-preto mb-6">
          Política de Privacidade
        </h1>

        <p>
          Esta Política de Privacidade explica como o Ponto Cariri coleta,
          usa e protege as informações dos visitantes deste site.
        </p>

        <h2>Cookies</h2>
        <p>
          Usamos cookies para melhorar sua experiência, entender como o
          site é utilizado (por meio do Google Analytics) e exibir
          anúncios relevantes (por meio do Google AdSense). Você pode
          desativar os cookies nas configurações do seu navegador a
          qualquer momento, embora isso possa afetar algumas
          funcionalidades do site.
        </p>

        <h2>Publicidade (Google AdSense)</h2>
        <p>
          Este site exibe anúncios fornecidos pelo Google AdSense. O
          Google e seus parceiros podem usar cookies para exibir anúncios
          com base nas suas visitas anteriores a este e a outros sites.
          Você pode desativar a publicidade personalizada acessando as{" "}
          <a
            href="https://adssettings.google.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            configurações de anúncios do Google
          </a>
          .
        </p>

        <h2>Google Analytics</h2>
        <p>
          Utilizamos o Google Analytics para entender, de forma agregada
          e anônima, como as pessoas usam o site (páginas mais visitadas,
          tempo de permanência, região de acesso). Esses dados não
          identificam você pessoalmente.
        </p>

        <h2>Dados que você nos envia</h2>
        <p>
          Se você entrar em contato conosco (por telefone, e-mail ou
          WhatsApp), usamos essas informações apenas para responder à sua
          mensagem, nunca para outra finalidade sem seu consentimento.
        </p>

        <h2>Seus direitos (LGPD)</h2>
        <p>
          De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem
          direito a solicitar informações sobre os dados que temos sobre
          você, correção ou exclusão. Para isso, entre em contato pelos
          canais informados na página{" "}
          <a href="/sobre">Sobre o Ponto Cariri</a>.
        </p>

        <h2>Alterações nesta política</h2>
        <p>
          Esta política pode ser atualizada periodicamente. Recomendamos
          revisá-la de tempos em tempos.
        </p>

        <p className="text-sm text-cariri-cinza-texto mt-8">
          Última atualização: {new Date().toLocaleDateString("pt-BR", { year: "numeric", month: "long" })}
        </p>
      </div>
    </div>
  );
}
