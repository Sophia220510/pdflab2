import { chromium } from "playwright";

const base = process.env.TEST_BASE_URL || "http://localhost:4174/";
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  await page.route("https://connect.facebook.net/en_US/fbevents.js", (route) =>
    route.fulfill({ status: 200, contentType: "application/javascript", body: "" }),
  );
  await page.goto(base, { waitUntil: "networkidle" });
  const events = await page.evaluate(() => window.fbq.queue.map((args) => [...args]));
  const count = (name) => events.filter((event) => event[1] === name).length;
  if (events[0]?.[0] !== "init" || events[0]?.[1] !== "2202477087281618")
    throw new Error(`Pixel ID incorreto: ${JSON.stringify(events)}`);
  if (count("PageView") !== 1 || count("ViewContent") !== 1)
    throw new Error(`Eventos de entrada incorretos: ${JSON.stringify(events)}`);
  if (count("Purchase") || count("InitiateCheckout"))
    throw new Error(`Conversão indevida no carregamento: ${JSON.stringify(events)}`);
  const cta = page.locator(".hero .buy-button");
  const hasCheckout = Boolean(await cta.getAttribute("href"));
  if (process.env.EXPECT_CHECKOUT === "1" && !hasCheckout)
    throw new Error("Checkout de teste não está ativo");
  if (hasCheckout) {
    await cta.evaluate((element) => element.addEventListener("click", (event) => event.preventDefault()));
    await cta.click();
    const afterClick = await page.evaluate(() => window.fbq.queue.map((args) => [...args]));
    if (afterClick.filter((event) => event[1] === "InitiateCheckout").length !== 1)
      throw new Error(`Clique sem InitiateCheckout: ${JSON.stringify(afterClick)}`);
    if (afterClick.some((event) => event[1] === "Purchase"))
      throw new Error(`Purchase indevido: ${JSON.stringify(afterClick)}`);
  } else if (!(await cta.isDisabled())) {
    throw new Error("CTA sem checkout deve estar desativado");
  }
  console.log("Meta Pixel: ID, PageView, ViewContent e CTA conferidos.");
} finally {
  await browser.close();
}
