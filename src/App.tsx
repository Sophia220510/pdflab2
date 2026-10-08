import { useCallback, useEffect, useRef, useState } from "react";
import { checkoutDestination, site, type CtaPosition } from "./config";

type Preview = { src: string; title: string; page: number };

const comparisonPreview: Preview = {
  src: "/images/percentual-absoluto.webp",
  title: "Percentual pode enganar",
  page: 28,
};
const indicesPreview: Preview = {
  src: "/images/pagina-18.webp",
  title: "Índices das hemácias",
  page: 18,
};
const worksheetPreview: Preview = {
  src: "/images/pagina-42.webp",
  title: "Ficha de leitura",
  page: 42,
};
const glossaryPreview: Preview = {
  src: "/images/pagina-43.webp",
  title: "Glossário para revisão",
  page: 43,
};
const indexPreview: Preview = {
  src: "/images/pagina-03.webp",
  title: "Índice do e-book",
  page: 3,
};
const challengePreview: Preview = {
  src: "/images/pagina-46.webp",
  title: "Desafio 09: leia a observação",
  page: 46,
};
const solutionPreview: Preview = {
  src: "/images/pagina-49.webp",
  title: "Resolução 09: confira o raciocínio",
  page: 49,
};

const faqs = [
  [
    "Para quem é o material?",
    "Para estudantes de Biomedicina, Farmácia e cursos técnicos em Análises Clínicas, além de quem já tem base nessas áreas e quer revisar os fundamentos do hemograma de adultos.",
  ],
  [
    "Consigo estudar pelo celular?",
    "Sim. O material é um PDF e pode ser aberto no celular, tablet ou computador. No celular, você pode ampliar as páginas para ler os textos e observar os diagramas.",
  ],
  [
    "É um curso em vídeo ou um PDF?",
    "É um e-book em PDF, em português. Não inclui aulas em vídeo ou acompanhamento individual.",
  ],
  [
    "O que está incluído nos R$37?",
    "Somente o Hemograma Descomplicado: explicações, diagramas, exemplos resolvidos, 12 desafios comentados, ficha de leitura, glossário e índice clicável.",
  ],
  [
    "Como recebo e acesso?",
    "Assim que o pagamento for aprovado, a Kiwify envia ao e-mail usado na compra uma mensagem de confirmação com o botão de acesso ao produto. Abra o Hemograma Descomplicado por esse botão para acessar o PDF. Se não encontrar a mensagem, confira a caixa de spam e use o mesmo e-mail informado na compra.",
  ],
  [
    "Existem materiais complementares?",
    "Sim. Hemograma em Casos traz mais situações para praticar; Hemograma de Bolso facilita a consulta e a revisão. Cada PDF custa R$9,90 no checkout, é opcional e não é necessário para estudar o e-book principal.",
  ],
];

function track(
  name: "offer_view" | "cta_click" | "preview_open",
  detail: Record<string, string | number> = {},
) {
  const fbq = (window as Window & {
    fbq?: (...args: unknown[]) => void;
  }).fbq;
  if (name === "offer_view") {
    fbq?.("track", "ViewContent", {
      content_ids: ["hemograma-descomplicado"],
      content_type: "product",
      value: 37,
      currency: "BRL",
    });
  } else if (name === "cta_click") {
    fbq?.("track", "InitiateCheckout", {
      content_ids: ["hemograma-descomplicado"],
      content_type: "product",
      value: 37,
      currency: "BRL",
    });
  }
  window.dispatchEvent(
    new CustomEvent("hemograma:analytics", {
      detail: { event: name, ...detail },
    }),
  );
}

function BuyButton({
  position,
  compact = false,
}: {
  position: CtaPosition;
  compact?: boolean;
}) {
  const href = checkoutDestination(window.location.search);
  const label = compact ? "Comprar por R$37" : "Quero meu e-book por R$37";
  if (!href) {
    return (
      <button
        className={`buy-button main-cta ${compact ? "compact" : ""}`}
        type="button"
        disabled
        aria-describedby="checkout-pending"
      >
        {label}
      </button>
    );
  }
  return (
    <a
      className={`buy-button main-cta ${compact ? "compact" : ""}`}
      href={href}
      onClick={() => track("cta_click", { position })}
    >
      {label}
      <span aria-hidden="true"> ↗</span>
    </a>
  );
}

function PreviewModal({
  preview,
  onClose,
}: {
  preview: Preview;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [zoomed, setZoomed] = useState(false);
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector("button")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, a[href], [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;
      const first = focusable[0],
        last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="preview-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${preview.title}, página ${preview.page}`}
        ref={dialogRef}
        tabIndex={-1}
      >
        <div className="modal-toolbar">
          <span>Página {preview.page} de 53 · amostra real do PDF</span>
          <button type="button" aria-pressed={zoomed} onClick={() => setZoomed(!zoomed)}>
            {zoomed ? "Ajustar à tela" : "Ampliar página"}
          </button>
          <button type="button" onClick={onClose} aria-label="Fechar prévia">
            Fechar <span aria-hidden="true">×</span>
          </button>
        </div>
        <div className={`modal-page ${zoomed ? "is-zoomed" : ""}`}>
          <img
            src={preview.src}
            alt={`Página ${preview.page} do e-book: ${preview.title}`}
            width="1044"
            height="1500"
          />
        </div>
      </div>
    </div>
  );
}

export function App() {
  const [activePreview, setActivePreview] = useState<Preview | null>(null);
  const [showStickyPurchase, setShowStickyPurchase] = useState(false);
  const opener = useRef<HTMLButtonElement | null>(null);
  const closePreview = useCallback(() => {
    setActivePreview(null);
    requestAnimationFrame(() => opener.current?.focus());
  }, []);

  useEffect(() => {
    track("offer_view");
  }, []);

  useEffect(() => {
    const updateStickyPurchase = () => {
      const visibleMainCta = Array.from(
        document.querySelectorAll<HTMLElement>("main .buy-button"),
      ).some((button) => {
        const rect = button.getBoundingClientRect();
        return rect.top >= 0 && rect.bottom <= window.innerHeight;
      });
      setShowStickyPurchase(!visibleMainCta);
    };
    updateStickyPurchase();
    window.addEventListener("scroll", updateStickyPurchase, { passive: true });
    window.addEventListener("resize", updateStickyPurchase);
    return () => {
      window.removeEventListener("scroll", updateStickyPurchase);
      window.removeEventListener("resize", updateStickyPurchase);
    };
  }, []);

  const openPreview = (preview: Preview, button: HTMLButtonElement) => {
    opener.current = button;
    track("preview_open", { page: preview.page, topic: preview.title });
    setActivePreview(preview);
  };

  return (
    <>
      <header className="site-header">
        <div className="shell header-inner">
          <div className="brand-lockup">
            <img
              className="brand-logo"
              src={site.brandLogo}
              alt={`Símbolo do ${site.brandName}`}
              width="44"
              height="44"
            />
            <span>
              <small>Laboratório</small>
              <strong>Santa Helena</strong>
            </span>
          </div>
          <div className="header-actions">
            <span className="header-label">Mais de 30 anos em Análises Clínicas</span>
            <a className="header-link" href="#previews">Ver conteúdo</a>
          </div>
        </div>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="shell hero-grid">
            <div className="hero-copy">
            <p className="eyebrow">
              Para estudantes de Biomedicina, Farmácia e Análises Clínicas
            </p>
            <h1 id="hero-title">Chega de travar no hemograma.</h1>
            <p className="hero-product">Hemograma Descomplicado</p>
            <p className="hero-subtitle">
              Aprenda a relacionar os dados do hemograma de adultos e organizar
              seu raciocínio nos exercícios. Estude com explicações ilustradas,
              acompanhe exemplos resolvidos e confira cada etapa nas respostas comentadas.
            </p>
            <div className="hero-badges">
              <span>PDF digital · 53 páginas</span>
              <span>Explicações ilustradas · exemplos resolvidos</span>
            </div>
            <div className="hero-purchase">
              <p className="price">
                <strong>{site.price}</strong> <span>pagamento único</span>
              </p>
              <BuyButton position="hero" />
              <p className="hero-callout">
                Compre agora e aprenda a evitar erros na leitura do hemograma.
              </p>
              <ul className="hero-benefits">
                <li>Relacione os índices das hemácias, como Hb, VCM e RDW.</li>
                <li>Distinga porcentagens de contagens absolutas de leucócitos.</li>
                <li>Organize uma síntese de estudo com a ficha de leitura.</li>
              </ul>
              <p className="microcopy">
                Acesso após a aprovação do pagamento · garantia de 7 dias
              </p>
              <a className="preview-jump" href="#previews">
                Ver páginas do e-book
              </a>
              {!checkoutDestination(window.location.search) && (
                <p className="checkout-note" id="checkout-pending">
                  Compra indisponível até a configuração do checkout.
                </p>
              )}
              <div className="hero-authority">
                <img
                  src="/images/paulo-brandao.webp"
                  alt="Paulo Brandão"
                  width="52"
                  height="52"
                />
                <span>
                  <strong>Paulo Brandão</strong>
                  <small>Farmacêutico-Bioquímico · Especialista TEAC/SBAC · mais de 30 anos em Análises Clínicas</small>
                </span>
              </div>
            </div>
            </div>
            <div
              className="hero-visual"
              aria-label="Capa do e-book Hemograma Descomplicado"
            >
              <div className="book-backdrop" />
              <img
                src="/images/capa.webp"
                alt="Capa do PDF Hemograma Descomplicado"
                width="1044"
                height="1500"
                fetchPriority="high"
              />
              <div className="visual-caption">
                <span className="caption-bar" />
                Exemplos, ficha de leitura e glossário
              </div>
            </div>
          </div>
        </section>

        <section
          className="comparison-demo section-pad shell"
          id="previews"
          aria-labelledby="comparison-title"
        >
          <div className="demo-heading">
            <p className="section-kicker">Páginas reais do e-book</p>
            <h2 id="comparison-title">Veja como o material explica</h2>
            <p>
              Três amostras para você conhecer as explicações, acompanhar uma
              conta e ver como organizar sua própria leitura.
            </p>
          </div>
          <div className="sample-grid">
            <article className="sample-card">
              <span className="page-number">01 · HEMÁCIAS</span>
              <img src="/images/indices-hemacias.webp" alt="Trecho da página 18 com as fórmulas de VCM, HCM e CHCM e um exemplo numérico" width="1170" height="681" loading="lazy" />
              <h3>Relacione os índices</h3>
              <p>Veja as fórmulas de VCM, HCM e CHCM aplicadas aos dados de um exemplo resolvido.</p>
              <button className="sample-button" type="button" onClick={(event) => openPreview(indicesPreview, event.currentTarget)}>Abrir página de hemácias <span aria-hidden="true">↗</span></button>
            </article>
            <article className="sample-card">
              <span className="page-number">02 · LEUCÓCITOS</span>
              <div className="comparison-pair">
                <img src="/images/percentual-60.webp" alt="3.000 leucócitos por microlitro: 60% de linfócitos são 1.800 por microlitro" width="555" height="360" loading="lazy" />
                <img src="/images/percentual-30.webp" alt="12.000 leucócitos por microlitro: 30% de linfócitos são 3.600 por microlitro" width="555" height="360" loading="lazy" />
              </div>
              <h3>Percentual pode enganar</h3>
              <p>Compare 60% de 3.000 com 30% de 12.000 leucócitos/µL. A porcentagem maior representa menos células neste exemplo.</p>
              <button className="sample-button" type="button" onClick={(event) => openPreview(comparisonPreview, event.currentTarget)}>Abrir página de leucócitos <span aria-hidden="true">↗</span></button>
            </article>
            <article className="sample-card">
              <span className="page-number">03 · SUA SÍNTESE</span>
              <img src="/images/ficha-leitura.webp" alt="Trecho da ficha de leitura com campos para hemácias, leucócitos, plaquetas e síntese" width="1170" height="1020" loading="lazy" />
              <h3>Organize sua leitura</h3>
              <p>Use a ficha para anotar as três séries, destacar um achado e escrever o que ainda precisa revisar.</p>
              <button className="sample-button" type="button" onClick={(event) => openPreview(worksheetPreview, event.currentTarget)}>Abrir ficha de leitura <span aria-hidden="true">↗</span></button>
            </article>
          </div>
        </section>

        <section
          className="difficulty section-pad"
          aria-labelledby="difficulty-title"
        >
          <div className="shell narrow">
            <p className="section-kicker">Do número à leitura</p>
            <h2 id="difficulty-title">
              Você reconhece as siglas, mas na hora de juntar tudo trava?
            </h2>
            <div className="difficulty-grid">
              <div>
                <span>01</span>
                <p>
                  VCM e RDW estão ali. O que essa combinação acrescenta à
                  leitura das hemácias?
                </p>
              </div>
              <div>
                <span>02</span>
                <p>
                  Os linfócitos aparecem em 60%. Isso é aumento real ou só
                  proporção?
                </p>
              </div>
              <div>
                <span>03</span>
                <p>
                  Surge uma alteração. Como escrever uma síntese sem adivinhar a
                  causa?
                </p>
              </div>
            </div>
            <p className="section-summary">
              O e-book transforma essas dúvidas em uma sequência concreta:
              entender a medida, fazer a conta, conectar as três séries e
              praticar a síntese.
            </p>
          </div>
        </section>

        <section
          className="exercise-demo section-pad"
          aria-labelledby="exercise-title"
        >
          <div className="shell">
            <div className="demo-heading">
              <p className="section-kicker">Desafio 09 · páginas 46 e 49</p>
              <h2 id="exercise-title">Leia, tente resolver e confira o raciocínio</h2>
              <p>
                Os 12 desafios do e-book têm respostas comentadas para você
                comparar sua solução e identificar o que precisa revisar.
              </p>
            </div>
            <div className="exercise-grid">
              <article className="exercise-card">
                <span className="page-number">01 · TENTE RESOLVER</span>
                <img
                  src="/images/desafio-09.webp"
                  alt="Desafio 09: contagem de plaquetas de 62 mil por microlitro e observação de agregados na lâmina"
                  width="1170"
                  height="189"
                  loading="lazy"
                />
                <div className="exercise-transcript">
                  <strong>09 | Leia a observação</strong>
                  <p>
                    Plaquetas 62.000/µL e agregados na lâmina. O que essa observação muda na interpretação da contagem?
                  </p>
                </div>
                <button
                  className="sample-button"
                  type="button"
                  onClick={(event) => openPreview(challengePreview, event.currentTarget)}
                >
                  Abrir página do desafio <span aria-hidden="true">↗</span>
                </button>
              </article>
              <article className="exercise-card">
                <span className="page-number">02 · CONFIRA A RESPOSTA</span>
                <img
                  src="/images/resolucao-09.webp"
                  alt="Resolução 09: agregados podem comprometer a contagem automatizada de plaquetas; é preciso avaliação técnica"
                  width="1170"
                  height="267"
                  loading="lazy"
                />
                <div className="exercise-transcript">
                  <strong>09 | Leia a observação</strong>
                  <p>
                    Os agregados podem comprometer a contagem automatizada.
                    A resolução explica por que o número pede avaliação técnica antes da conclusão.
                  </p>
                </div>
                <button
                  className="sample-button"
                  type="button"
                  onClick={(event) => openPreview(solutionPreview, event.currentTarget)}
                >
                  Abrir página da resolução <span aria-hidden="true">↗</span>
                </button>
              </article>
            </div>
            <p className="exercise-how-to">
              Como usar no estudo: responda antes de abrir a resolução; depois,
              compare sua justificativa com o raciocínio comentado.
            </p>
          </div>
        </section>

        <section className="study-flow section-pad" aria-labelledby="study-flow-title">
          <div className="shell">
            <p className="section-kicker">Uma rotina possível de estudo</p>
            <h2 id="study-flow-title">Da explicação à sua resposta</h2>
            <ol className="study-steps">
              <li><strong>Leia a explicação</strong><span>Entenda o que cada medida mostra.</span></li>
              <li><strong>Acompanhe um exemplo</strong><span>Veja como os números são relacionados.</span></li>
              <li><strong>Tente resolver</strong><span>Use o desafio antes de olhar o gabarito.</span></li>
              <li><strong>Confira e revise</strong><span>Compare sua resposta e anote o ponto a retomar.</span></li>
            </ol>
            <div className="study-tools">
              <p>A ficha de leitura ajuda a organizar a síntese. Para voltar a um conceito, consulte o glossário ou encontre o assunto no índice clicável do PDF.</p>
              <div>
                <button type="button" onClick={(event) => openPreview(glossaryPreview, event.currentTarget)}>Ver glossário ↗</button>
                <button type="button" onClick={(event) => openPreview(indexPreview, event.currentTarget)}>Ver índice ↗</button>
              </div>
            </div>
          </div>
        </section>

        <section className="proof section-pad" aria-labelledby="proof-title">
          <div className="shell proof-layout">
            <div>
              <p className="section-kicker">Quem está por trás do material</p>
              <h2 id="proof-title">Paulo Brandão: experiência aplicada ao ensino</h2>
              <p>
                Paulo é Farmacêutico-Bioquímico, formado pela Universidade São Francisco, e tem título de Especialista em Análises Clínicas (TEAC/SBAC).
              </p>
              <p>
                Com mais de 30 anos de experiência na área, atua como responsável técnico no Laboratório Santa Helena e leciona em cursos de capacitação e pós-graduação.
              </p>
              <p>
                Criou este e-book para ajudar estudantes a acompanhar uma sequência de leitura e a conferir o próprio raciocínio nos exemplos e exercícios.
              </p>
              <div className="proof-links">
                <a href="https://laboratoriosantahelena.vercel.app/paulo-brandao" target="_blank" rel="noopener noreferrer">
                  Conheça a trajetória de Paulo ↗
                </a>
                <a href="https://laboratoriosantahelena.vercel.app/" target="_blank" rel="noopener noreferrer">
                  Conheça o Laboratório Santa Helena ↗
                </a>
              </div>
              <BuyButton position="after_proof" />
            </div>
            <div className="proof-portrait">
              <figure>
                <img
                  src="/images/paulo-brandao.webp"
                  alt="Retrato de Paulo Brandão"
                  width="735"
                  height="724"
                  loading="lazy"
                />
                <figcaption>
                  <strong>Paulo Brandão</strong>
                  <span>Mais de 30 anos em Análises Clínicas. Criou este material para ajudar estudantes.</span>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section className="reviews section-pad" aria-labelledby="reviews-title">
          <div className="shell">
            <p className="section-kicker">Opiniões de leitores</p>
            <h2 id="reviews-title">Relatos de quem leu e testou o material</h2>
            <div className="reviews-grid">
              <figure className="review-card">
                <blockquote>
                  Amei o guia! É muito prático e fácil de entender. Facilitou
                  minha vida!
                </blockquote>
                <figcaption>Comprador</figcaption>
              </figure>
              <figure className="review-card">
                <blockquote>
                  O professor me recomendou, e eu achei muito bom. É só um PDF,
                  mas acho que é o PDF mais útil que já usei. Nunca vi um conteúdo
                  parecido na internet.
                </blockquote>
                <figcaption>Comprador</figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section
          className="offer section-pad"
          aria-labelledby="offer-title"
        >
          <div className="shell offer-card">
            <div className="offer-cover">
              <img
                src="/images/capa.webp"
                alt="Capa do e-book Hemograma Descomplicado"
                width="1044"
                height="1500"
                loading="lazy"
              />
            </div>
            <div className="offer-content">
              <p className="section-kicker">O que você recebe</p>
              <h2 id="offer-title">O que está incluído nos R$37</h2>
              <p className="offer-intro">
                Hemograma Descomplicado — e-book em PDF com 53 páginas.
              </p>
              <ul className="offer-list">
                <li>Explicações ilustradas sobre hemácias, leucócitos e plaquetas.</li>
                <li>Exemplos resolvidos com o raciocínio explicado.</li>
                <li>12 desafios com respostas comentadas.</li>
                <li>Ficha de leitura e glossário para revisão.</li>
                <li>Índice clicável para encontrar os assuntos.</li>
              </ul>
              <p className="offer-price">
                <strong>{site.price}</strong>
                <span>pagamento único</span>
              </p>
              <BuyButton position="offer" />
              <p className="guarantee-note">
                Após a aprovação do pagamento, a Kiwify envia ao e-mail da compra
                o botão de acesso ao PDF. Sua compra tem garantia de 7 dias.
              </p>
              <p className="microcopy">
                Os materiais complementares oferecidos no checkout são opcionais
                e pagos à parte.
              </p>
            </div>
          </div>
        </section>

        <section className="faq section-pad" aria-labelledby="faq-title">
          <div className="shell narrow">
            <p className="section-kicker">Dúvidas frequentes</p>
            <h2 id="faq-title">Antes de começar</h2>
            <div className="faq-list">
              {faqs.map(([question, answer]) => (
                <details key={question}>
                  <summary>
                    {question}
                    <span aria-hidden="true">+</span>
                  </summary>
                  <p>{answer}</p>
                </details>
              ))}
              <details>
                <summary>
                  Como falar com o suporte?
                  <span aria-hidden="true">+</span>
                </summary>
                <p>
                  Para dúvidas sobre o e-book ou o acesso, escreva para{" "}
                  <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>.
                </p>
              </details>
            </div>
            <p className="education-note">
              Material educacional para estudo. A avaliação de um exame real
              depende do contexto e de profissional habilitado.
            </p>
          </div>
        </section>

        <section className="final-cta section-pad" aria-labelledby="final-title">
          <div className="shell final-inner">
            <div>
              <p className="section-kicker">Seu próximo passo</p>
              <h2 id="final-title">Estude o hemograma com uma sequência clara.</h2>
              <p>PDF em português · 53 páginas · R$37,00 · garantia de 7 dias</p>
            </div>
            <BuyButton position="final" />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="shell footer-inner">
          <div>
            <strong>Hemograma Descomplicado</strong>
            <p>E-book de estudo em Análises Clínicas.</p>
          </div>
          <div className="footer-support">
            {site.sellerName && <p>Responsável comercial: {site.sellerName}</p>}
            {site.supportEmail && (
              <p>
                Suporte:{" "}
                <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>
              </p>
            )}
            <p>Garantia de 7 dias após a compra.</p>
          </div>
        </div>
      </footer>

      {!activePreview && (
        <div
          className={`sticky-purchase ${showStickyPurchase ? "is-visible" : ""}`}
          aria-hidden={!showStickyPurchase}
          inert={!showStickyPurchase}
        >
          <div className="shell sticky-inner">
            <span>
              <strong>R$37</strong>
              <small>pagamento único</small>
            </span>
            <BuyButton position="sticky" compact />
          </div>
        </div>
      )}
      {activePreview && (
        <PreviewModal preview={activePreview} onClose={closePreview} />
      )}
    </>
  );
}
