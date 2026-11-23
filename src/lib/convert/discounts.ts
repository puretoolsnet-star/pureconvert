export type DiscountMode = "discount" | "markup" | "findBase";
export type FindBaseVariant = "afterDiscount" | "afterMarkup";

export const DISCOUNT_PERCENT_PRESETS = [10, 15, 20, 25, 50] as const;

export function applyDiscount(
  price: number,
  percent: number,
): { discountAmount: number; finalPrice: number } {
  const discountAmount = (price * percent) / 100;
  return { discountAmount, finalPrice: price - discountAmount };
}

export function applyMarkup(
  basePrice: number,
  percent: number,
): { markupAmount: number; finalPrice: number } {
  const markupAmount = (basePrice * percent) / 100;
  return { markupAmount, finalPrice: basePrice + markupAmount };
}

export function recoverPriceBeforePercent(
  currentPrice: number,
  percent: number,
  variant: FindBaseVariant,
): number | "invalid" {
  if (variant === "afterDiscount") {
    if (percent >= 100) return "invalid";
    const factor = 1 - percent / 100;
    if (factor === 0) return "invalid";
    return currentPrice / factor;
  }
  if (percent <= -100) return "invalid";
  const factor = 1 + percent / 100;
  if (factor === 0) return "invalid";
  return currentPrice / factor;
}

export const DISCOUNT_SAMPLES: Record<DiscountMode, Record<string, string>> = {
  discount: { price: "129.99", percent: "20" },
  markup: { price: "45", percent: "35" },
  findBase: { price: "80", percent: "20" },
};