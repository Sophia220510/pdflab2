import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  if (command === "build" && mode !== "review") {
    let checkout: URL | undefined;
    try {
      checkout = new URL(env.VITE_CHECKOUT_URL);
    } catch {
      /* treated below */
    }
    if (
      !checkout ||
      checkout.protocol !== "https:" ||
      ["example.com", "localhost"].includes(checkout.hostname)
    ) {
      throw new Error(
        "Defina VITE_CHECKOUT_URL com a URL HTTPS real do Hemograma Descomplicado antes do build de produção. Use build:review para uma prévia sem compras.",
      );
    }
    if (!env.VITE_BRAND_LOGO || !env.VITE_BRAND_NAME) {
      throw new Error(
        "Confirme a instituição e configure VITE_BRAND_NAME e VITE_BRAND_LOGO com a marca oficial antes do build de produção.",
      );
    }
  }
  return { plugins: [react()] };
});
