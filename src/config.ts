export const site = {
  product: "Hemograma Descomplicado",
  price: "R$37,00",
  checkoutUrl: import.meta.env.VITE_CHECKOUT_URL?.trim() || "",
  supportEmail: import.meta.env.VITE_SUPPORT_EMAIL?.trim() || "",
  sellerName: import.meta.env.VITE_SELLER_NAME?.trim() || "",
  brandLogo: import.meta.env.VITE_BRAND_LOGO?.trim() || "",
  brandName: import.meta.env.VITE_BRAND_NAME?.trim() || "",
  // Ajuste apenas aos parâmetros aceitos pelo checkout contratado.
  allowedTrackingParams: [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
  ] as const,
};

export type CtaPosition = "hero" | "after_proof" | "offer" | "sticky";

export function checkoutDestination(search: string): string | null {
  if (!site.checkoutUrl) return null;
  try {
    const destination = new URL(site.checkoutUrl);
    if (destination.protocol !== "https:") return null;
    const incoming = new URLSearchParams(search);
    for (const key of site.allowedTrackingParams) {
      const value = incoming.get(key);
      if (value && value.length <= 120 && /^[\p{L}\p{N}_. -]+$/u.test(value)) {
        destination.searchParams.set(key, value);
      }
    }
    return destination.toString();
  } catch {
    return null;
  }
}
