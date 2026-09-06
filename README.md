# Ponto Cariri — SaaS Web

Portal de notícias e informações da região do Cariri cearense, com painel de
administração próprio, botão de doação via Pix, banco de dados na nuvem e
espaços para Google AdSense.

## O que já vem pronto

- Página inicial, Municípios (hino, mapa, história, fotos), Tempo (previsão
  do tempo, sem precisar de chave de API), Notícias, Propaganda (lojas,
  mercados, farmácias) e Sobre.
- Botão flutuante de doação com QR Code Pix gerado automaticamente e chave
  Pix visível com botão "Copiar".
- Painel de administração em `/admin`, protegido por login e senha, onde é
  possível cadastrar, editar e excluir municípios, notícias e anúncios sem
  mexer em nenhum código.
- Todo o conteúdo é salvo em um **banco de dados de verdade** (Vercel
  Postgres) e as fotos/vídeos em um **armazenamento de arquivos na nuvem**
  (Vercel Blob) — nada se perde quando o site é atualizado.
- Layout em branco, verde e preto, responsivo para celular, tablet e notebook.
- Espaços prontos para o Google AdSense.

## Passo a passo completo para colocar o site no ar

### 1. Crie uma conta na Vercel

Acesse **https://vercel.com**, crie uma conta gratuita (pode entrar com o
GitHub) e mantenha esse login à mão — vamos usá-lo para tudo.

### 2. Suba este projeto para o GitHub

1. Crie uma conta em **https://github.com**, caso ainda não tenha.
2. Crie um repositório novo (pode ser privado) e envie todos os arquivos
   desta pasta para lá. Se nunca fez isso, o próprio GitHub tem um botão
   "Upload files" que permite arrastar a pasta direto pelo navegador,
   sem precisar usar comandos.

### 3. Importe o projeto na Vercel

1. No painel da Vercel, clique em **"Add New" → "Project"**.
2. Escolha o repositório que você acabou de criar no GitHub.
3. Clique em **"Deploy"** (pode ir com as opções padrão por enquanto — vamos
   configurar as variáveis de ambiente no próximo passo).

### 4. Crie o banco de dados (Vercel Postgres)

1. Dentro do seu projeto na Vercel, vá até a aba **"Storage"**.
2. Clique em **"Create Database"** e escolha **"Postgres"**.
3. Siga as instruções na tela (nome do banco, região — escolha uma região
   nos EUA ou América do Sul, o que estiver disponível) e clique em
   **"Connect"** para ligar o banco a este projeto.

   A Vercel cuida sozinha de criar a variável `POSTGRES_URL` — você não
   precisa copiar nem colar nada manualmente.

### 5. Crie o armazenamento de fotos (Vercel Blob)

1. Ainda na aba **"Storage"**, clique em **"Create Database"** de novo e
   escolha **"Blob"**.
2. Dê um nome e clique em **"Connect"** para ligar ao projeto, do mesmo
   jeito que fez com o Postgres.

### 6. Defina o usuário e senha do painel de administração

1. No seu projeto na Vercel, vá em **"Settings" → "Environment Variables"**.
2. Adicione estas três variáveis (você escolhe os valores):
   - `ADMIN_USER` → o usuário que você vai usar para entrar em `/admin`.
   - `ADMIN_PASSWORD` → a senha do administrador.
   - `ADMIN_SECRET` → qualquer frase longa e aleatória.
3. Se quiser já deixar o AdSense configurado, adicione também
   `NEXT_PUBLIC_ADSENSE_CLIENT_ID` (veja o passo 9).

### 7. Configure o projeto no seu computador (para rodar localmente e preparar o banco)

Pré-requisito: ter o **Node.js** instalado (versão 18 ou mais recente).
Baixe em: https://nodejs.org

No terminal, dentro da pasta do projeto:

```bash
npm install
npm install -g vercel
vercel login
vercel link
vercel env pull .env.local
```

O comando `vercel env pull .env.local` baixa automaticamente para o seu
computador todas as variáveis que você configurou na Vercel (banco de
dados, armazenamento de fotos, usuário/senha do admin) — você não precisa
digitar nada manualmente no `.env.local`.

### 8. Crie as tabelas do banco e importe o conteúdo de exemplo

Ainda no terminal, rode (só precisa fazer isso **uma vez**):

```bash
npm run db:setup
```

Isso cria as tabelas do banco de dados e importa os municípios, a notícia
e o anúncio de exemplo que já vêm com o projeto.

### 9. Publique o site

Basta enviar (`git push`) qualquer alteração para o GitHub, e a Vercel
publica automaticamente. Ou, se preferir, rode `vercel --prod` no terminal.

O site estará em uma URL parecida com `https://ponto-cariri.vercel.app`
(você pode ligar um domínio próprio depois, em "Settings" → "Domains").

O painel de administração fica em: `https://SEU-SITE.vercel.app/admin`

### 10. Rodando o site no seu computador (modo de teste)

```bash
npm run dev
```

Depois acesse **http://localhost:3000** no navegador (ele usa o mesmo
banco de dados da nuvem, então o que você editar localmente aparece no
site publicado, e vice-versa).

## Como editar o conteúdo do site (sem programar)

Depois de fazer login em `/admin`, você pode:

- **Municípios**: adicionar nome, história, link do hino, latitude/longitude
  (para o mapa) e fotos.
- **Notícias**: criar, editar, publicar ou esconder notícias.
- **Propaganda**: cadastrar lojas, mercados, farmácias etc., com fotos,
  vídeo, telefone/WhatsApp e descrição.
- **Configurações**: trocar a chave Pix, a mensagem de doação, o texto da
  página "Sobre" e o ID do Google AdSense.

Tudo isso é salvo direto no banco de dados na nuvem — sem precisar mexer em
nenhum arquivo.

## Ativando o Google AdSense

1. Crie uma conta em https://www.google.com/adsense
2. Depois de aprovado, copie o seu ID (algo como `ca-pub-1234567890123456`).
3. Cole esse ID em duas configurações:
   - Na Vercel, em "Settings" → "Environment Variables", na variável
     `NEXT_PUBLIC_ADSENSE_CLIENT_ID` (e também no `.env.local`, se for testar
     localmente).
   - No painel `/admin/config`, no campo "ID do Google AdSense".
4. Adicione o script oficial do AdSense em `app/layout.js`, dentro da tag
   `<head>`, seguindo as instruções que o próprio Google AdSense fornece
   após a aprovação da sua conta.

## Onde encontrar cada coisa no código (para manutenção futura)

- `app/` → todas as páginas do site (uma pasta para cada seção do menu).
- `app/admin/` → páginas do painel de administração.
- `app/api/` → as rotas que salvam e leem os dados (o "motor" do site).
- `components/` → pedaços de tela reutilizados (menu, rodapé, botão de
  doação, cartões de município/notícia/anúncio).
- `lib/db.js` → todas as funções que conversam com o banco de dados.
- `lib/auth.js` → login do painel de administração.
- `data/*.json` → **apenas dados de exemplo**, usados uma única vez pelo
  comando `npm run db:setup` para popular o banco. Depois disso, o conteúdo
  real fica só no banco de dados, editável pelo `/admin`.
- `scripts/init-db.mjs` → script que cria as tabelas e importa os dados de
  exemplo (rodado uma única vez, no passo 8).

## Resumo do que cada serviço faz

| Serviço          | Para que serve                                              | Custo para começar |
|------------------|--------------------------------------------------------------|---------------------|
| Vercel           | Hospeda o site (deploy automático a cada atualização)        | Gratuito            |
| Vercel Postgres  | Guarda municípios, notícias, anúncios e configurações        | Gratuito para começar |
| Vercel Blob      | Guarda as fotos e vídeos enviados pelo painel de administração| Gratuito para começar |

Se o site crescer bastante (muitas visitas, muitos anúncios com fotos), a
Vercel avisa quando algum desses planos gratuitos estiver perto do limite,
e você pode fazer upgrade diretamente pelo painel, sem precisar mudar nada
no código.
