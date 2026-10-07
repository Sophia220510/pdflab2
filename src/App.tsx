import { useCallback, useEffect, useRef, useState } from "react";
import { checkoutDestination, site, type CtaPosition } from "./config";

type Preview = { src: string; title: string; page: number };

const comparisonPreview: Preview = {
  src: "/images/percentual-absoluto.webp",
  title: "Percentual pode enganar",
  page: 28,
};
const challengePreview: Preview = {
  src: "/images/pagina-45.webp",
  title: "Desafio 05: resolva o diferencial",
  page: 45,
};
const solutionPreview: Preview = {
  src: "/images/pagina-48.webp",
  title: "Resolução 05: confira o raciocínio",
  page: 48,
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
          <button type="button" onClick={onClose} aria-label="Fechar prévia">
            Fechar <span aria-hidden="true">×</span>
          </button>
        </div>
        <img
          src={preview.src}
          alt={`Página ${preview.page} do e-book: ${preview.title}`}
          width="1044"
          height="1500"
        />
      </div>
    </div>
  );
}

export function App() {
  const [activePreview, setActivePreview] = useState<Preview | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const closePreview = useCallback(() => {
    setActivePreview(null);
    requestAnimationFrame(() => opener.current?.focus());
  }, []);

  useEffect(() => {
    track("offer_view");
  }, []);

  const openPreview = (preview: Preview, button: HTMLButtonElement) => {
    opener.current = button;
    track("preview_open", { page: preview.page, topic: preview.title });
    setActivePreview(preview);
  };

  return (
    <>
      <header className="site-header shell">
        <div className="brand-lockup">
          <img
            className="brand-logo"
            src={site.brandLogo}
            alt={`Símbolo do ${site.brandName}`}
            width="44"
            height="44"
          />
          <span>
            <strong>{site.brandName}</strong>
            <small>Análises Clínicas</small>
          </span>
        </div>
        <span className="header-label">
          Material de estudo em Análises Clínicas
        </span>
      </header>

      <main>
        <section className="hero shell" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">
              Para estudantes de Biomedicina, Farmácia e Análises Clínicas
            </p>
            <h1 id="hero-title">Chega de travar no hemograma.</h1>
            <p className="hero-subtitle">
              Aprenda uma sequência clara para estudar o hemograma de adultos:
              explicações visuais, exemplos resolvidos e exercícios comentados.
            </p>
            <ul className="hero-benefits">
              <li>Entenda como Hb, VCM e RDW se relacionam.</li>
              <li>Organize seu estudo de hemácias, leucócitos e plaquetas.</li>
              <li>Pratique com 12 desafios e confira o raciocínio de cada resposta.</li>
            </ul>
            <p className="hero-callout">
              Compre agora e aprenda a evitar erros na leitura do hemograma.
            </p>
            <div className="hero-purchase">
              <div className="purchase-summary">
                <img
                  className="hero-mobile-cover"
                  src="/images/capa.webp"
                  alt="Capa do e-book Hemograma Descomplicado"
                  width="1044"
                  height="1500"
                />
                <p className="price">
                  <strong>{site.price}</strong> <span>pagamento único</span>
                </p>
              </div>
              <BuyButton position="hero" />
              <a className="preview-jump" href="#previews">
                Ver páginas do e-book
              </a>
              <p className="microcopy">
                PDF em português · 53 páginas · acesso após a aprovação do pagamento · garantia de 7 dias
              </p>
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
                  <small>Mais de 30 anos em Análises Clínicas · criou este e-book para ajudar estudantes</small>
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
              53 páginas ilustradas · 12 desafios comentados
            </div>
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
          className="comparison-demo section-pad shell"
          id="previews"
          aria-labelledby="comparison-title"
        >
          <div className="demo-heading">
            <p className="section-kicker">Página 28 do e-book</p>
            <h2 id="comparison-title">Entenda a relação entre os números</h2>
            <p>
              Uma porcentagem maior nem sempre representa uma contagem maior.
              Nesta página do e-book, você acompanha a comparação e entende
              como fazer a conta.
            </p>
          </div>
          <div className="comparison-grid">
            <img
              src="/images/percentual-60.webp"
              alt="3.000 leucócitos por microlitro: 60% de linfócitos são 1.800 linfócitos por microlitro"
              width="555"
              height="360"
              loading="lazy"
            />
            <img
              src="/images/percentual-30.webp"
              alt="12.000 leucócitos por microlitro: 30% de linfócitos são 3.600 linfócitos por microlitro"
              width="555"
              height="360"
              loading="lazy"
            />
          </div>
          <div className="sample-explainer">
            <strong>O que esta página ensina</strong>
            <p>
              Compare 60% de 3.000 com 30% de 12.000 leucócitos/µL. Ao fazer a
              conta, você vê por que a porcentagem isolada pode levar a uma
              conclusão errada.
            </p>
          </div>
          <p className="demo-prompt">Abra a amostra e veja como o material explica.</p>
          <button
            className="sample-button"
            type="button"
            onClick={(event) => openPreview(comparisonPreview, event.currentTarget)}
          >
            Abrir página real do e-book <span aria-hidden="true">↗</span>
          </button>
        </section>

        <section
          className="exercise-demo section-pad"
          aria-labelledby="exercise-title"
        >
          <div className="shell">
            <div className="demo-heading">
              <p className="section-kicker">Desafio 05 · páginas 45 e 48</p>
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
                  src="/images/desafio-05.webp"
                  alt="Desafio 05: leucócitos 3.000 por microlitro, linfócitos 60% e neutrófilos 30%. Calcule os absolutos."
                  width="1152"
                  height="198"
                  loading="lazy"
                />
                <div className="exercise-transcript">
                  <strong>05 | Resolva o diferencial</strong>
                  <p>
                    Leucócitos 3.000/µL; linfócitos 60%; neutrófilos 30%.
                    Calcule os absolutos.
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
                  src="/images/resolucao-05.webp"
                  alt="Resolução 05: 1.800 linfócitos e 900 neutrófilos por microlitro, com explicação sobre contagem absoluta."
                  width="1152"
                  height="273"
                  loading="lazy"
                />
                <div className="exercise-transcript">
                  <strong>05 | Resolva o diferencial</strong>
                  <p>
                    Linfócitos = 1.800/µL; neutrófilos = 900/µL. A porcentagem
                    alta de linfócitos pode decorrer da redução de outra população.
                    Compare cada absoluto ao seu intervalo.
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
              Como usar no estudo: faça a conta antes de abrir a resposta;
              depois, compare cada etapa com a resolução comentada.
            </p>
          </div>
        </section>

        <section className="proof section-pad" aria-labelledby="proof-title">
          <div className="shell proof-layout">
            <div>
              <p className="section-kicker">Quem está por trás do material</p>
              <h2 id="proof-title">Experiência de laboratório a serviço do seu estudo</h2>
              <p>
                Paulo Brandão tem mais de 30 anos de experiência em Análises
                Clínicas.
              </p>
              <p>
                No Hemograma Descomplicado, o estudo segue uma sequência:
                entender cada medida, relacionar as informações e acompanhar
                exemplos até uma síntese organizada.
              </p>
              <p>
                Depois, você pratica com 12 desafios comentados e compara seu
                raciocínio com as explicações do material.
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
            <p className="section-kicker">Opiniões de leitores convidados</p>
            <h2 id="reviews-title">Relatos de quem leu e testou o material</h2>
            <div className="reviews-grid">
              <figure className="review-card">
                <blockquote>
                  Amei o guia! É muito prático e fácil de entender. Facilitou
                  minha vida!
                </blockquote>
                <figcaption>Pessoa convidada a testar o e-book</figcaption>
              </figure>
              <figure className="review-card">
                <blockquote>
                  O professor me recomendou, e eu achei muito bom. É só um PDF,
                  mas acho que é o PDF mais útil que já usei. Nunca vi um conteúdo
                  parecido na internet.
                </blockquote>
                <figcaption>Pessoa convidada a testar o e-book</figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section
          className="offer section-pad shell"
          aria-labelledby="offer-title"
        >
          <div className="offer-card">
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
                Você recebe acesso ao PDF após a aprovação do pagamento e tem
                garantia de 7 dias.
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
            </div>
            <p className="education-note">
              Material educacional para estudo. A avaliação de um exame real
              depende do contexto e de profissional habilitado.
            </p>
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
        <div className="sticky-purchase">
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
