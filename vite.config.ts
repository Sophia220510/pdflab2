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
      console.warn(
        "VITE_CHECKOUT_URL não configurada com um checkout HTTPS real. A página será publicada com os botões de compra desativados.",
      );
    }
  }
  return { plugins: [react()] };
});
