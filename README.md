# Hemograma Descomplicado

Landing page em React, TypeScript e Vite para o e-book **Hemograma Descomplicado**. A página está implementada e pode ser revisada localmente. A venda permanece desativada até ser configurado um checkout real deste produto.

## Executar

```bash
npm install
npm run dev
```

Abra `http://localhost:5173/`. `npm run build` gera a versão usada pela Vercel. Sem `VITE_CHECKOUT_URL` válida, a página é publicada com os botões de compra desativados e uma mensagem clara; nenhuma compra é simulada. `npm run build:review` gera a mesma prévia sem checkout.

Copie `.env.example` para `.env.local` e preencha somente dados confirmados. O checkout deve ser HTTPS. Todos os CTAs usam a mesma URL e recebem apenas os parâmetros `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` e `utm_term`, limitados a 120 caracteres alfanuméricos ou de pontuação simples. Ajuste a lista em `src/config.ts` após confirmar os parâmetros aceitos pela plataforma. Nunca inclua dados pessoais ou tokens em UTMs.

## Publicar na Vercel

Importe o repositório `Sophia220510/pdflab2` com o preset **Vite**. A Vercel pode usar o comando padrão `npm run build` e o diretório de saída `dist`. O build funciona sem variáveis de ambiente; nesse estado, o site é uma apresentação do material, sem compra ativa.

Quando o checkout exclusivo do **Hemograma Descomplicado** estiver pronto, configure `VITE_CHECKOUT_URL` com a URL HTTPS em **Project Settings → Environment Variables** para Production e faça um novo deploy. Confira o destino dos CTAs depois da publicação. Não use o checkout do Guia do Primeiro Estágio.

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
| `public/images/vcm.webp` | Página 11 do PDF principal; prévia sobre VCM. |
| `public/images/percentual-absoluto.webp` | Página 28 do PDF principal; prévia sobre percentual e absoluto. |
| `public/images/sintese.webp` | Página 41 do PDF principal; prévia do exemplo integrado. |
| `public/images/paulo-brandao.webp` | Recorte da imagem identificada `Dr. Paulo Brandão_ referência clínica.png`; sinal compacto de autoridade e retrato. Sem alteração de rosto. |
| `public/images/santa-helena-logo.svg` | Símbolo SVG extraído do cabeçalho do [site do Laboratório Santa Helena](https://laboratoriosantahelena.vercel.app/), também presente no projeto `pdflab`. Exibido com nome e proporções preservados. |
| `public/images/santa-helena-recepcao.webp` | Foto da recepção já usada no projeto `pdflab` e apresentada na primeira tela do [site do laboratório](https://laboratoriosantahelena.vercel.app/); bloco de autoridade. |

O ZIP `fotos_laboratorio_santa_helena.zip` foi examinado, mas as fotos com painel de marca exibem **Laboratório Brandão**. Não foram atribuídas ao Laboratório Santa Helena na página. A marca e a recepção foram identificadas no site do Santa Helena vinculado ao projeto anterior `pdflab`.

## Pendências comerciais

1. Fornecer a URL do checkout exclusivo do e-book principal, confirmar entrega, meios de pagamento e quais UTMs são aceitas.
2. Confirmar responsável comercial, contato de suporte e links reais de política/garantia, quando disponíveis.
3. Confirmar qualquer credencial adicional e participação técnica de Paulo Brandão antes de inserir afirmações além das imagens fornecidas.

Nenhum dos complementos está configurado em plataforma de pagamento. Eles aparecem uma vez no FAQ como opcionais e pagos à parte.

### Copy para configurar no checkout

**Hemograma em Casos — R$9,90 adicionais (opcional).** Pratique com 20 casos fictícios. Cada situação traz dados, perguntas de aplicação e uma resolução comentada para você conferir o raciocínio. PDF em português, 49 páginas. Não vem incluído no e-book principal.

**Hemograma de Bolso — R$9,90 adicionais (opcional).** Retome dúvidas com 14 fichas, painel de fórmulas e checklist de leitura. Teste sua memória com 30 cartões e confira as respostas. PDF em português, 35 páginas. Não vem incluído no e-book principal.

Deixe ambos **desmarcados por padrão** no checkout. O produto principal custa R$37,00 sozinho.

## Medição e verificação

O Meta Pixel `2202477087281618` envia `PageView` ao carregar a página, `ViewContent` ao apresentar a oferta e `InitiateCheckout` quando alguém clica em um CTA com checkout válido. O código continua emitindo eventos locais `hemograma:analytics` para `offer_view`, `cta_click` (com posição) e `preview_open` (com página e tema). Não há evento `Purchase` na landing page: a confirmação de compra pertence ao checkout. Os parâmetros configurados para `ViewContent` e `InitiateCheckout` contêm apenas o identificador do produto, preço e moeda.

Para testar com uma URL temporária de sua autoria, defina `VITE_CHECKOUT_URL` no processo de desenvolvimento e execute `npm run test:smoke` com o servidor em `http://localhost:4174/`. Esse teste verifica largura, imagens, primeira tela de 390 px, modal, foco, FAQ, barra fixa e UTMs em sete larguras. A URL de exemplo usada durante o desenvolvimento não está no código nem na configuração de produção.

Uma auditoria Lighthouse Mobile no build de revisão local obteve desempenho **95/100**, acessibilidade **100/100**, LCP de laboratório **2,9 s**, CLS **0** e TBT **0 ms**. O Chrome produziu o relatório JSON, mas a CLI retornou `EPERM` ao tentar remover seu diretório temporário após a medição. As metas LCP, CLS e INP são de campo; esta auditoria não mede INP real nem garante os resultados para visitantes.
