import { formatConverted } from "@/lib/convert/format";

export function gcdInt(a: number, b: number): number {
  let x = Math.abs(Math.trunc(a));
  let y = Math.abs(Math.trunc(b));
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

/** Greatest common divisor for positive rationals (4 decimal places). */
export function gcdRational(a: number, b: number): number {
  const scale = 10_000;
  return gcdInt(Math.round(a * scale), Math.round(b * scale));
}

export function simplifyRatioParts(a: number, b: number): { a: number; b: number } | null {
  if (a <= 0 || b <= 0) return null;
  const g = gcdRational(a, b);
  const scale = 10_000;
  const sa = Math.round(a * scale);
  const sb = Math.round(b * scale);
  return { a: sa / g, b: sb / g };
}

export function ratioDecimal(a: number, b: number): number | null {
  if (a <= 0 || b <= 0) return null;
  return a / b;
}

export function heightFromWidth(width: number, ratioA: number, ratioB: number): number | null {
  if (ratioA <= 0 || ratioB <= 0) return null;
  return (width * ratioB) / ratioA;
}

export function widthFromHeight(height: number, ratioA: number, ratioB: number): number | null {
  if (ratioA <= 0 || ratioB <= 0) return null;
  return (height * ratioA) / ratioB;
}

export const RATIO_SCALE_FACTORS = [40, 80, 120, 160, 240] as const;

export function scaledResolutions(
  ratioA: number,
  ratioB: number,
  factors: readonly number[] = RATIO_SCALE_FACTORS,
): { width: number; height: number; label: string }[] {
  if (ratioA <= 0 || ratioB <= 0) return [];
  return factors.map((k) => {
    const w = ratioA * k;
    const h = ratioB * k;
    return {
      width: w,
      height: h,
      label: `${formatDimension(w)}×${formatDimension(h)}`,
    };
  });
}

function formatDimension(n: number): string {
  if (Number.isInteger(n)) return String(n);
  return formatConverted(n);
}

export type RatioPresetId = "widescreen" | "classic" | "square" | "tall";

export const RATIO_PRESETS: Record<RatioPresetId, { a: string; b: string }> = {
  widescreen: { a: "16", b: "9" },
  classic: { a: "4", b: "3" },
  square: { a: "1", b: "1" },
  tall: { a: "1", b: "100" },
};

export const SAMPLE_RATIO = { a: "16", b: "9", width: "1920" };