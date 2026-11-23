export function parseInputNumber(raw: string): number | null {
  const trimmed = raw.trim().replace(/\s/g, "").replace(",", ".");
  if (trimmed === "" || trimmed === "-" || trimmed === "." || trimmed === "-.") return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

export function isInvalidInputRaw(raw: string): boolean {
  const trimmed = raw.trim();
  if (trimmed === "") return false;
  return parseInputNumber(raw) === null;
}

/** Valid finite number and not negative (empty allowed). */
export function parseNonNegativeNumber(raw: string): number | null {
  const n = parseInputNumber(raw);
  if (n === null) return null;
  if (n < 0) return null;
  return n;
}

export function isNegativeOrInvalidInput(raw: string): boolean {
  const trimmed = raw.trim();
  if (trimmed === "") return false;
  const n = parseInputNumber(raw);
  if (n === null) return true;
  return n < 0;
}

/** For rectangle sides: must be finite and > 0 (empty allowed). */
export function parsePositiveNumber(raw: string): number | null {
  const n = parseInputNumber(raw);
  if (n === null || n <= 0) return null;
  return n;
}

export function isNonPositiveOrInvalidInput(raw: string): boolean {
  const trimmed = raw.trim();
  if (trimmed === "") return false;
  const n = parseInputNumber(raw);
  if (n === null) return true;
  return n <= 0;
}

function trimTrailingZeros(formatted: string): string {
  if (!formatted.includes(".")) return formatted;
  return formatted.replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "");
}

export function formatConverted(value: number): string {
  if (!Number.isFinite(value)) return "—";
  const abs = Math.abs(value);
  if (abs === 0) return "0";
  if (abs >= 1e15 || (abs > 0 && abs < 1e-12)) {
    const sci = value.toExponential(6);
    return sci.replace(/\.?0+e/, "e");
  }
  let formatted: string;
  if (abs >= 1_000_000) formatted = value.toLocaleString(undefined, { maximumFractionDigits: 4 });
  else if (abs >= 1) formatted = value.toLocaleString(undefined, { maximumFractionDigits: 8 });
  else if (abs >= 0.0001) formatted = value.toLocaleString(undefined, { maximumFractionDigits: 10 });
  else formatted = value.toLocaleString(undefined, { maximumSignificantDigits: 10 });
  return trimTrailingZeros(formatted);
}