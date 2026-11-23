export function solveProportionX(a: number, b: number, c: number): number | "zeroA" {
  if (a === 0) return "zeroA";
  return (b * c) / a;
}

export const PROPORTION_SAMPLE = { a: "3", b: "4", c: "15" } as const;