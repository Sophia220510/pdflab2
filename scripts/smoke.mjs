import { chromium } from "playwright";

const base = process.env.TEST_BASE_URL || "http://localhost:4174/";
const browser = await chromium.launch({ headless: true });
try {
  for (const width of [320, 360, 375, 390, 430, 768, 1280]) {
    const page = await browser.newPage({ viewport: { width, height: 844 } });
    await page.goto(
      `${base}?utm_source=anuncio&utm_campaign=hemograma&utm_content=video%2Fpagina-28%7Cfeed&email=privado`,
      { waitUntil: "networkidle" },
    );
    const dimensions = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      viewport: innerWidth,
    }));
    if (dimensions.scroll > dimensions.viewport + 1)
      throw new Error(
        `Rolagem horizontal em ${width}px: ${JSON.stringify(dimensions)}`,
      );
    const purchaseLinks = page.locator(".buy-button");
    if ((await purchaseLinks.count()) !== 5)
      throw new Error(`Número inesperado de botões de compra em ${width}px`);
    for (const href of await purchaseLinks.evaluateAll((links) =>
      links.map((link) => link.getAttribute("href")),
    )) {
      if (!href || new URL(href).origin !== "https://pay.kiwify.com.br" ||
          new URL(href).pathname !== "/ynrSMcQ")
        throw new Error(`Destino de compra incorreto em ${width}px: ${href}`);
    }
    const sticky = page.locator(".sticky-purchase .buy-button");
    for (const offset of [0, 350, 1000, 2500]) {
      await page.evaluate((y) => window.scrollTo(0, y), offset);
      await page.waitForTimeout(50);
      const visibleMainCta = await page.locator("main .buy-button").evaluateAll((links) =>
        links.some((link) => {
          const rect = link.getBoundingClientRect();
          return rect.top >= 0 && rect.bottom <= innerHeight;
        }),
      );
      const stickyVisible = await sticky.isVisible();
      if (!visibleMainCta && !stickyVisible)
        throw new Error(`Nenhum botão de compra visível em ${width}px, scroll ${offset}`);
      if (visibleMainCta && stickyVisible)
        throw new Error(`Compra fixa duplicada em ${width}px, scroll ${offset}`);
      if (stickyVisible) {
        const box = await sticky.boundingBox();
        if (!box || box.y < 0 || box.y + box.height > 844)
          throw new Error(`Compra fixa fora da tela em ${width}px, scroll ${offset}`);
      }
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    const brokenImages = await page
      .locator("img")
      .evaluateAll(async (images) => {
        const results = await Promise.all(
          images.map(async (image) => ({
            src: image.src,
            ok: (await fetch(image.src)).ok,
          })),
        );
        return results
          .filter((result) => !result.ok)
          .map((result) => result.src);
      });
    if (brokenImages.length)
      throw new Error(
        `Imagens quebradas em ${width}px: ${brokenImages.join(", ")}`,
      );
    if (width === 390) {
      const sectionOrder = await page.locator("main > section").evaluateAll((sections) =>
        sections.map((section) => section.classList[0]),
      );
      if (sectionOrder.join(",") !== "hero,comparison-demo,difficulty,exercise-demo,study-flow,proof,reviews,offer,faq,final-cta")
        throw new Error(`Ordem das seções incorreta: ${sectionOrder.join(",")}`);
      if ((await page.locator(".sample-card").count()) !== 3)
        throw new Error("As três amostras distintas estão ausentes");
      if (!(await page.locator(".brand-lockup strong").isVisible()))
        throw new Error("Nome do laboratório oculto no celular");
      if ((await page.locator(".review-card").count()) !== 2)
        throw new Error("Depoimentos de leitores convidados ausentes");
      if ((await page.locator('a[href="mailto:laboratoriosantahelena81@gmail.com"]').count()) !== 2)
        throw new Error("E-mail de suporte ausente do FAQ ou rodapé");
      const cta = page.locator(".hero .buy-button");
      const box = await cta.boundingBox();
      if (!box || box.y + box.height > 844)
        throw new Error("CTA do hero fora da primeira tela em 390px");
      const href = await cta.getAttribute("href");
      if (!href) throw new Error("Checkout de teste ausente");
      const url = new URL(href);
      if (
        url.searchParams.get("utm_source") !== "anuncio" ||
        url.searchParams.get("utm_campaign") !== "hemograma" ||
        url.searchParams.get("utm_content") !== "video/pagina-28|feed" ||
        url.searchParams.has("email")
      )
        throw new Error(`UTMs incorretas: ${href}`);
      await page.screenshot({ path: ".work/validated-mobile.png" });
      await page.getByRole("link", { name: "Ver páginas do e-book" }).click();
      await page.waitForFunction(() =>
        location.hash === "#previews" && document.querySelector("#previews").getBoundingClientRect().top < innerHeight / 2,
      );
      await page.locator("#previews").screenshot({ path: ".work/validated-comparison-mobile.png" });
      await page.locator(".exercise-demo").screenshot({ path: ".work/validated-exercise-mobile.png" });
      const opener = page
        .getByRole("button", { name: /abrir página de leucócitos/i });
      await opener.click();
      const dialog = page.getByRole("dialog");
      await dialog.waitFor();
      if (!(await dialog.locator("img").getAttribute("src"))?.endsWith("percentual-absoluto.webp"))
        throw new Error("Amostra não abriu a página 28 inteira");
      await dialog.getByRole("button", { name: "Ampliar página" }).click();
      if (!(await dialog.getByRole("button", { name: "Ajustar à tela" }).getAttribute("aria-pressed"))?.includes("true"))
        throw new Error("Zoom da amostra não ativou");
      if (await page.locator(".sticky-purchase").count())
        throw new Error("Barra fixa visível sobre o modal");
      await page.keyboard.press("Escape");
      if (await dialog.count()) throw new Error("Modal não fechou com Escape");
      await page.waitForFunction(
        () => document.activeElement === document.querySelector(".sample-card:nth-child(2) button"),
      );
      for (const [label, filename] of [
        ["Abrir página de hemácias", "pagina-18.webp"],
        ["Abrir ficha de leitura", "pagina-42.webp"],
        ["Abrir página do desafio", "pagina-46.webp"],
        ["Abrir página da resolução", "pagina-49.webp"],
        ["Ver glossário", "pagina-43.webp"],
        ["Ver índice", "pagina-03.webp"],
      ]) {
        await page.getByRole("button", { name: new RegExp(label, "i") }).click();
        await dialog.waitFor();
        if (!(await dialog.locator("img").getAttribute("src"))?.endsWith(filename))
          throw new Error(`Página errada no botão ${label}`);
        await page.keyboard.press("Escape");
        await dialog.waitFor({ state: "detached" });
      }
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      const footerAndBar = await page.evaluate(() => ({
        footerBottom: document.querySelector("footer").getBoundingClientRect().bottom,
        barTop: document.querySelector(".sticky-purchase").getBoundingClientRect().top,
      }));
      if (footerAndBar.footerBottom > footerAndBar.barTop)
        throw new Error("Barra fixa cobre o rodapé no fim da página");
      const firstFaq = page.locator(".faq summary").first();
      await firstFaq.focus();
      await page.keyboard.press("Enter");
      if (
        !(await page
          .locator(".faq details")
          .first()
          .evaluate((el) => el.open))
      )
        throw new Error("FAQ não abre por teclado");
    }
    if (width === 1280)
      await page.screenshot({
        path: ".work/validated-desktop.png",
        fullPage: true,
      });
    console.log(`${width}px: sem rolagem horizontal; imagens carregadas`);
    await page.close();
  }
  console.log("Modal, foco, FAQ, barra fixa e UTMs: OK");
} finally {
  await browser.close();
}
