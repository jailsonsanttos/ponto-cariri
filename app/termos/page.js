export const metadata = { title: "Termos de Uso" };

export default function TermosPage() {
  return (
    <div className="max-w-content mx-auto px-5 py-12">
      <div className="max-w-2xl prose-noticia">
        <h1 className="text-3xl font-bold text-cariri-preto mb-6">Termos de Uso</h1>

        <p>
          Ao acessar e usar o site Ponto Cariri, você concorda com os
          termos descritos abaixo.
        </p>

        <h2>Uso do conteúdo</h2>
        <p>
          O conteúdo publicado (notícias, fotos, textos) é de
          responsabilidade do Ponto Cariri e não pode ser copiado ou
          redistribuído sem autorização, exceto para compartilhamento
          pessoal através dos botões disponibilizados no site.
        </p>

        <h2>Anúncios e propaganda</h2>
        <p>
          Os anúncios publicados na seção "Propaganda" são de
          responsabilidade dos próprios anunciantes. O Ponto Cariri não
          se responsabiliza por produtos, serviços ou informações
          divulgadas por terceiros.
        </p>

        <h2>Precisão das informações</h2>
        <p>
          Fazemos o possível para manter as informações atualizadas e
          corretas (incluindo previsão do tempo e notícias), mas não
          garantimos exatidão absoluta. Em caso de erro, entre em
          contato para correção.
        </p>

        <h2>Doações</h2>
        <p>
          As doações feitas via Pix são voluntárias e destinadas à
          manutenção do projeto. Não emitimos recibo fiscal, já que o
          Ponto Cariri é um projeto autônomo.
        </p>

        <h2>Alterações</h2>
        <p>
          Estes termos podem ser atualizados a qualquer momento, sem
          aviso prévio.
        </p>

        <p className="text-sm text-cariri-cinza-texto mt-8">
          Última atualização: {new Date().toLocaleDateString("pt-BR", { year: "numeric", month: "long" })}
        </p>
      </div>
    </div>
  );
}
