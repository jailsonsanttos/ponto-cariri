# Concurseiros — Ponto Cariri

## Implementação

A nova área `/concurseiros` será uma experiência de resolução de questões para assinantes, usando o caderno autorizado do IBGE Recenseador enviado pelo usuário. As questões serão armazenadas como dados estruturados com número, disciplina, enunciado, alternativas, gabarito, assunto e comentário. O cliente responderá uma questão por vez; ao confirmar, verá imediatamente o resultado e a explicação comentada. O estado do simulado será mantido no navegador e um painel final apresentará acertos, erros, percentual e desempenho por disciplina/assunto.

A área terá uma camada de acesso premium. O fluxo inicial usará Pix com aprovação manual: o visitante solicita acesso informando nome/e-mail, visualiza a chave Pix e envia comprovante; o administrador aprova ou recusa a solicitação no CMS. O acesso será por cookie/token assinado emitido após aprovação. O pagamento automático e a renovação recorrente ficam fora desta primeira entrega porque a chave Pix, sozinha, não confirma pagamentos.

A interface seguirá a paleta contemporânea do Ponto Cariri, com foco em leitura, cards de prova, marcadores de progresso, feedback visual e responsividade mobile/tablet. O botão de assinatura ocupará o espaço superior atualmente usado pelo texto institucional.

## Estrutura

- `app/concurseiros/`: página premium e cliente interativo.
- `data/concurseiros/ibge-recenseador.json`: banco estruturado do caderno autorizado.
- `app/api/concurseiros/`: solicitação, login e sessão premium.
- `lib/concurseiros.js`: schema, leitura, solicitação e assinatura.
- `app/admin/concurseiros/`: gestão de solicitações e assinantes.
- `components/Header.jsx`: CTA premium no topo.
- `lib/db.js`: tabelas de assinantes e solicitações.

## Design

### Estilo escolhido: sala de estudos editorial

Probabilidades alternativas: plataforma de cursinho modular (0,08); dashboard de desempenho esportivo (0,06); biblioteca técnica minimalista (0,05).

A interface combina verde mata, branco quente e terracota em uma experiência editorial de estudo. O conteúdo da questão é o foco, enquanto progresso e desempenho aparecem como sinais curtos e úteis. O feedback de resposta é direto, acessível e sem excesso de animação. Cards arredondados, tipografia de alta leitura e indicadores compactos dão identidade sem imitar literalmente nenhuma plataforma.

## Marca

Posicionamento: preparação regional acessível para quem estuda para concursos.
Personalidade: clara, prática e encorajadora.
Voz: “Responda com calma. Entenda o porquê.” e “Seu desempenho mostra onde revisar.”
