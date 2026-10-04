import { chromium } from "playwright";

const base = process.env.TEST_BASE_URL || "http://localhost:4174/";
const browser = await chromium.launch({ headless: true });
try {
  for (const width of [320, 360, 375, 390, 430, 768, 1280]) {
    const page = await browser.newPage({ viewport: { width, height: 844 } });
    await page.goto(
      `${base}?utm_source=anuncio&utm_campaign=hemograma&email=privado`,
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
        url.searchParams.has("email")
      )
        throw new Error(`UTMs incorretas: ${href}`);
      await page.screenshot({ path: ".work/validated-mobile.png" });
      const opener = page
        .getByRole("button", { name: /ampliar página/i })
        .first();
      await opener.click();
      const dialog = page.getByRole("dialog");
      await dialog.waitFor();
      if (await page.locator(".sticky-purchase").count())
        throw new Error("Barra fixa visível sobre o modal");
      await page.keyboard.press("Escape");
      if (await dialog.count()) throw new Error("Modal não fechou com Escape");
      await page.waitForFunction(() =>
        document.activeElement?.textContent?.includes("Ampliar página"),
      );
      const focused = await opener.evaluate(
        (el) => el === document.activeElement,
      );
      if (!focused) throw new Error("Foco não voltou ao botão de prévia");
      await page.evaluate(() => window.scrollTo(0, 1000));
      await page.waitForTimeout(200);
      if (!(await page.locator(".sticky-purchase").isVisible()))
        throw new Error("Barra fixa não apareceu após o hero");
      await page.locator("footer").scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      if (await page.locator(".sticky-purchase").isVisible())
        throw new Error("Barra fixa cobre o rodapé");
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
