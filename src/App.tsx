import { useCallback, useEffect, useRef, useState } from "react";
import { checkoutDestination, site, type CtaPosition } from "./config";

type Preview = { src: string; title: string; caption: string; page: number };

const previews: Preview[] = [
  {
    src: "/images/vcm.webp",
    title: "VCM: o tamanho médio",
    caption:
      "Enxergue o que o VCM mostra — e por que uma média pode esconder diferenças importantes.",
    page: 11,
  },
  {
    src: "/images/percentual-absoluto.webp",
    title: "Percentual pode enganar",
    caption:
      "Uma conta simples revela a armadilha: percentual maior não significa contagem maior.",
    page: 28,
  },
  {
    src: "/images/sintese.webp",
    title: "Do dado à síntese",
    caption:
      "Veja os dados de um caso fictício se encaixarem em uma síntese, passo a passo.",
    page: 41,
  },
];

const faqs = [
  [
    "Para quem é o material?",
    "Para estudantes de Biomedicina, Farmácia e cursos técnicos em Análises Clínicas, além de quem já tem base nessas áreas e quer revisar os fundamentos do hemograma de adultos.",
  ],
  [
    "Preciso estar começando um estágio?",
    "Não. Você pode usar o e-book para estudar ou revisar o tema no seu próprio ritmo.",
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
    "O modo de pagamento e a entrega digital serão informados no checkout assim que ele estiver configurado para este produto.",
  ],
  [
    "Existem materiais complementares?",
    "Sim. Hemograma em Casos e Hemograma de Bolso são PDFs opcionais, vendidos à parte por R$9,90 cada no checkout. O e-book principal pode ser estudado sozinho.",
  ],
];

function track(
  name: "offer_view" | "cta_click" | "preview_open",
  detail: Record<string, string | number> = {},
) {
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
  const label = compact ? "Quero destravar" : "Quero destravar o hemograma";
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
  const [stickyVisible, setStickyVisible] = useState(false);
  const opener = useRef<HTMLButtonElement | null>(null);
  const closePreview = useCallback(() => {
    setActivePreview(null);
    requestAnimationFrame(() => opener.current?.focus());
  }, []);

  useEffect(() => {
    track("offer_view");
    const visible = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          entry.isIntersecting
            ? visible.add(entry.target)
            : visible.delete(entry.target);
        const hero = document.querySelector(".hero .main-cta");
        const footer = document.querySelector("footer");
        setStickyVisible(
          Boolean(
            hero &&
            !visible.has(hero) &&
            window.scrollY > 300 &&
            !Array.from(visible).some(
              (el) => el.classList.contains("main-cta") || el === footer,
            ),
          ),
        );
      },
      { threshold: 0.05 },
    );
    document
      .querySelectorAll(".main-cta, footer")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
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
            <p className="eyebrow">Hemograma Descomplicado · e-book PDF</p>
            <h1 id="hero-title">
              Pare de decorar siglas. Enxergue a lógica do hemograma.
            </h1>
            <p className="hero-subtitle">
              Uma leitura visual e prática para conectar Hb, VCM, RDW,
              leucócitos e plaquetas — e construir uma síntese do hemograma de
              adultos.
            </p>
            <ul className="hero-benefits">
              <li>Entenda o papel de Hb, VCM e RDW.</li>
              <li>Conecte as três séries do exame.</li>
              <li>Treine com 12 desafios comentados.</li>
            </ul>
            <div className="hero-purchase">
              <p className="price">
                <strong>{site.price}</strong> <span>pagamento único</span>
              </p>
              <BuyButton position="hero" />
              <p className="microcopy">E-book PDF em português · 53 páginas</p>
              {!checkoutDestination(window.location.search) && (
                <p className="checkout-note" id="checkout-pending">
                  Compra indisponível até a configuração do checkout.
                </p>
              )}
              <div className="hero-authority">
                <img
                  src="/images/paulo-brandao.webp"
                  alt="Paulo Brandão, em foto identificada fornecida para a página"
                  width="52"
                  height="52"
                />
                <span>
                  <strong>Paulo Brandão</strong>
                  <small>Experiência em Análises Clínicas</small>
                </span>
              </div>
            </div>
          </div>
          <div
            className="hero-visual"
            aria-label="Capa real do e-book Hemograma Descomplicado"
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
              Amostra do material real
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
              Você reconhece as siglas. Mas, na hora de juntar tudo, trava?
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
          className="previews section-pad shell"
          aria-labelledby="previews-title"
        >
          <div className="section-heading">
            <div>
              <p className="section-kicker">Por dentro do PDF</p>
              <h2 id="previews-title">Veja as peças se encaixarem</h2>
            </div>
            <p>
              Amplie três páginas reais e veja diagramas, contas e uma síntese
              preenchida.
            </p>
          </div>
          <div className="preview-grid">
            {previews.map((preview) => (
              <article className="preview-card" key={preview.page}>
                <div className="preview-image">
                  <img
                    src={preview.src}
                    alt={`Amostra da página ${preview.page}: ${preview.title}`}
                    width="1044"
                    height="1500"
                    loading="lazy"
                  />
                </div>
                <div className="preview-content">
                  <span className="page-number">
                    PÁGINA {String(preview.page).padStart(2, "0")}
                  </span>
                  <h3>{preview.title}</h3>
                  <p>{preview.caption}</p>
                  <button
                    type="button"
                    onClick={(event) =>
                      openPreview(preview, event.currentTarget)
                    }
                  >
                    Ampliar página <span aria-hidden="true">↗</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          className="process-strip shell"
          aria-label="Sequência de estudo"
        >
          <span>
            01 <strong>Entenda a medida</strong>
          </span>
          <span>
            02 <strong>Conecte os achados</strong>
          </span>
          <span>
            03 <strong>Pratique a síntese</strong>
          </span>
        </section>

        <section className="proof section-pad" aria-labelledby="proof-title">
          <div className="shell proof-layout">
            <div>
              <p className="section-kicker">Estudo com método</p>
              <h2 id="proof-title">
                Um caminho claro para conectar as peças do exame.
              </h2>
              <p>
                Primeiro, cada medida responde a uma pergunta concreta. Depois,
                você confere as contas, percorre as três séries e acompanha
                exemplos fictícios até a síntese.
              </p>
              <p>
                Assim, fica mais fácil descrever o que os dados mostram e
                reconhecer o que ainda falta para entender um caso real.
              </p>
              <BuyButton position="after_proof" />
            </div>
            <div className="proof-photos">
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
                  <span>Experiência em Análises Clínicas.</span>
                </figcaption>
              </figure>
              <figure>
                <img
                  src="/images/santa-helena-recepcao.webp"
                  alt="Recepção real do Laboratório Santa Helena"
                  width="1080"
                  height="720"
                  loading="lazy"
                />
                <figcaption>
                  <strong>Laboratório Santa Helena</strong>
                  <span>Recepção apresentada no site oficial.</span>
                </figcaption>
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
                alt="Capa real do e-book Hemograma Descomplicado"
                width="1044"
                height="1500"
                loading="lazy"
              />
            </div>
            <div className="offer-content">
              <p className="section-kicker">O que você recebe</p>
              <h2 id="offer-title">Hemograma Descomplicado</h2>
              <p className="offer-intro">
                Abra, entenda, calcule, pratique e confira: um PDF que guia seu
                estudo do primeiro número à síntese.
              </p>
              <ul className="offer-list">
                <li>Diagramas que mostram o que cada medida representa.</li>
                <li>Exemplos resolvidos com o raciocínio à vista.</li>
                <li>
                  12 desafios comentados para testar e corrigir sua leitura.
                </li>
                <li>
                  Ficha de leitura e glossário para retomar sem se perder.
                </li>
                <li>
                  Índice clicável para encontrar sua dúvida em poucos toques.
                </li>
              </ul>
              <p className="offer-price">
                <strong>{site.price}</strong>
                <span>pagamento único</span>
              </p>
              <BuyButton position="offer" />
              <p className="microcopy">
                Somente o e-book principal. Materiais adicionais são opcionais e
                pagos à parte.
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
          <div>
            {site.sellerName && <p>Responsável comercial: {site.sellerName}</p>}
            {site.supportEmail && (
              <p>
                Suporte:{" "}
                <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>
              </p>
            )}
            {!site.sellerName && !site.supportEmail && (
              <p>
                Identificação comercial e contato de suporte pendentes de
                confirmação.
              </p>
            )}
          </div>
        </div>
      </footer>

      {stickyVisible && !activePreview && (
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
