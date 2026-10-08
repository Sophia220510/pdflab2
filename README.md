# Hemograma Descomplicado

Landing page em React, TypeScript e Vite para o e-book **Hemograma Descomplicado**. Todos os botões de compra levam ao [checkout do produto na Kiwify](https://pay.kiwify.com.br/ynrSMcQ).

A apresentação adapta ao hemograma o sistema visual da página [Primeiro Estágio](https://primeiroestagio.vercel.app/): **Fraunces** nos títulos, **DM Sans** nos textos, branco `#fff`, bege `#f7f4f0`, vinho `#2c151a` e vermelho `#b32639`. As amostras reais mostram três tarefas distintas: calcular índices das hemácias, comparar percentual e contagem absoluta de leucócitos e organizar uma ficha de leitura. O desafio 09 demonstra a leitura das plaquetas. O checkout do hemograma e o Meta Pixel `2202477087281618` foram preservados.

No celular, a primeira tela retoma o gancho sobre decorar siglas e mostra a conta da página 28 antes do preço e do CTA. O botão da demonstração abre a página original do PDF; a grade completa de amostras continua logo depois da apresentação.

Os dois depoimentos exibidos foram fornecidos pelo responsável como relatos de pessoas convidadas a testar o e-book. A pontuação, a ortografia e a concordância foram corrigidas sem acrescentar resultados, nomes ou credenciais. As identificações permanecem anônimas até que cada pessoa autorize uma forma de apresentação.

## Executar

```bash
npm install
npm run dev
```

Abra `http://localhost:5173/`. `npm run build` gera a versão usada pela Vercel. `npm run build:review` gera a mesma prévia. O checkout padrão já está configurado no código.

Copie `.env.example` para `.env.local` apenas se precisar configurar dados comerciais. O checkout está fixado em `src/config.ts` para garantir o mesmo destino em todos os CTAs. Eles recebem apenas os parâmetros `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` e `utm_term`, limitados a 120 caracteres e com pontuação usual de campanha (`_ . ~ - + / | :`); parâmetros pessoais como `email` não são repassados. Ajuste a lista em `src/config.ts` após confirmar os parâmetros aceitos pela plataforma. Nunca inclua dados pessoais ou tokens em UTMs.

## Publicar na Vercel

Importe o repositório `Sophia220510/pdflab2` com o preset **Vite**. A Vercel pode usar o comando padrão `npm run build` e o diretório de saída `dist`. O build funciona sem variáveis de ambiente e já publica o checkout da Kiwify.

O checkout está fixado no código, portanto uma variável `VITE_CHECKOUT_URL` antiga na Vercel não altera o destino. Confira os CTAs depois da publicação.

## Conteúdo conferido nos PDFs

| PDF | Inventário |
| --- | --- |
| Hemograma Descomplicado | 53 páginas; conceitos e diagramas das três séries, cálculos, exemplos resolvidos, 12 desafios com resoluções nas páginas 44 a 49, ficha de leitura na página 42, glossário na página 43 e índice clicável na página 3. |
| Hemograma em Casos | 49 páginas; 20 casos fictícios com desafio e resolução, dados adicionais e perguntas para aplicar o raciocínio. |
| Hemograma de Bolso | 35 páginas; 14 fichas, painel de fórmulas, checklist e 30 cartões com gabaritos. |

Os PDFs originais permanecem fora do repositório e do diretório público.

## Imagens publicadas

| Arquivo | Origem e uso |
| --- | --- |
| `public/images/capa.webp` | Página 1 do PDF principal; capa na página e imagem de compartilhamento. |
| `public/images/indices-hemacias.webp`, `pagina-18.webp` | Trecho legível e página completa do exemplo de índices das hemácias. |
| `public/images/percentual-absoluto.webp`, `percentual-60.webp`, `percentual-30.webp` | Página 28 inteira e recortes dos dois exemplos, empilhados no celular. |
| `public/images/ficha-leitura.webp`, `pagina-42.webp` | Trecho e página completa da ficha de leitura e síntese. |
| `public/images/desafio-09.webp`, `resolucao-09.webp`, `pagina-46.webp`, `pagina-49.webp` | Desafio sobre plaquetas, resposta comentada e páginas completas. |
| `public/images/pagina-03.webp`, `pagina-43.webp` | Páginas completas do índice e glossário, abertas na seção de estudo. |
| `public/images/desafio-05.webp`, `resolucao-05.webp`, `pagina-45.webp`, `pagina-48.webp` | Amostras do anúncio anterior, mantidas para a reprodução do vídeo. |
| `public/images/paulo-brandao.webp` | Recorte da imagem identificada `Dr. Paulo Brandão_ referência clínica.png`; sinal compacto de autoridade e retrato. Sem alteração de rosto. |
| `public/images/santa-helena-logo.svg` | Símbolo SVG extraído do cabeçalho do [site do Laboratório Santa Helena](https://laboratoriosantahelena.vercel.app/), também presente no projeto `pdflab`. Exibido com nome e proporções preservados. |

O ZIP `fotos_laboratorio_santa_helena.zip` foi examinado, mas as fotos com painel de marca exibem **Laboratório Brandão**. Não foram atribuídas ao Laboratório Santa Helena na página. A marca foi identificada no site do Santa Helena vinculado ao projeto anterior `pdflab`.

## Anúncio de demonstração

O vídeo vertical [ads/hemograma-demonstracao-vertical.mp4](ads/hemograma-demonstracao-vertical.mp4) mostra o exemplo da página 28, o desafio 05 e sua resolução antes da capa e do preço. A narração segue o texto fornecido. A sequência, as fontes e a proposta de teste estão em [ads/README.md](ads/README.md).

## Pendências comerciais

1. Confirmar no painel da Kiwify se o PDF está publicado no produto e se o botão de acesso do e-mail leva diretamente ao conteúdo. A resposta da página usa o fluxo padrão de e-mail após pagamento aprovado descrito pela Kiwify.
2. Confirmar meios de pagamento e quais UTMs são aceitas pela Kiwify.
3. Confirmar responsável comercial e eventual política adicional, quando disponíveis. O contato de suporte informado pelo responsável é `laboratoriosantahelena81@gmail.com` e aparece no FAQ e no rodapé.
4. As credenciais de Paulo exibidas na página foram conferidas na [trajetória pública do Laboratório Santa Helena](https://laboratoriosantahelena.vercel.app/paulo-brandao).

Os dois complementos aparecem no FAQ como opcionais e pagos à parte. Confirme no painel da Kiwify se os order bumps estão ativos e desmarcados por padrão; o texto abaixo está pronto para configurar no checkout.

### Copy para configurar no checkout

**Hemograma em Casos — R$9,90. Quero praticar com mais casos.** Acrescente 20 casos fictícios com perguntas e resoluções comentadas. Responda antes de consultar e compare seu raciocínio com as explicações.

**Hemograma de Bolso — R$9,90. Quero facilitar minha revisão.** Acrescente 14 fichas de consulta e 30 perguntas com respostas para localizar fórmulas, revisar conceitos e testar sua memória.

Casos = prática. Bolso = consulta e revisão. Deixe ambos **desmarcados por padrão** no checkout. O produto principal custa R$37,00 sozinho e não depende dos complementos.

## Medição e verificação

O Meta Pixel `2202477087281618` envia `PageView` ao carregar a página, `ViewContent` ao apresentar a oferta e `InitiateCheckout` quando alguém clica em um CTA com checkout válido. O código continua emitindo eventos locais `hemograma:analytics` para `offer_view`, `cta_click` (com posição) e `preview_open` (com página e tema). Não há evento `Purchase` na landing page: a confirmação de compra pertence ao checkout. Os parâmetros configurados para `ViewContent` e `InitiateCheckout` contêm apenas o identificador do produto, preço e moeda.

Execute `npm run test:smoke` com o servidor em `http://localhost:4174/`. Esse teste verifica a ordem das seções, as três amostras, os cinco destinos da Kiwify, largura, imagens, primeira tela de 390 px, modal com ampliação, foco, FAQ, botão flutuante contextual e UTMs em sete larguras. Execute `npm run test:pixel` para verificar os eventos do Meta Pixel.

