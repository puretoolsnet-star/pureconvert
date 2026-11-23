import { formatConverted } from "@/lib/convert/format";

export type PercentMode = "percentOf" | "whatPercent" | "change";

export function percentOfNumber(value: number, percent: number): number {
  return (value * percent) / 100;
}

export function shareAsPercent(part: number, whole: number): number | null {
  if (whole === 0) return null;
  return (part / whole) * 100;
}

export function percentChange(
  from: number,
  to: number,
): { percent: number; absoluteDiff: number } | "zeroBase" | null {
  if (from === 0) return "zeroBase";
  const percent = ((to - from) / from) * 100;
  return { percent, absoluteDiff: to - from };
}

export const PERCENT_SAMPLES: Record<PercentMode, Record<string, string>> = {
  percentOf: { base: "200", percent: "15" },
  whatPercent: { part: "45", whole: "180" },
  change: { from: "80", to: "100" },
};