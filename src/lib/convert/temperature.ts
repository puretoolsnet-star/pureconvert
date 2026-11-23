import { formatConverted } from "@/lib/convert/format";

export type TempUnitId = "C" | "F" | "K";

export const TEMP_UNIT_IDS: TempUnitId[] = ["C", "F", "K"];

export const ABSOLUTE_ZERO_C = -273.15;
export const ABSOLUTE_ZERO_F = -459.67;
export const ABSOLUTE_ZERO_K = 0;

export function toKelvin(value: number, unit: TempUnitId): number {
  if (unit === "C") return value + 273.15;
  if (unit === "F") return ((value - 32) * 5) / 9 + 273.15;
  return value;
}

export function fromKelvin(kelvin: number, unit: TempUnitId): number {
  if (unit === "C") return kelvin - 273.15;
  if (unit === "F") return ((kelvin - 273.15) * 9) / 5 + 32;
  return kelvin;
}

export function isBelowAbsoluteZero(value: number, unit: TempUnitId): boolean {
  return toKelvin(value, unit) < 0;
}

/** Absolute temperature (point on scale). Returns null below 0 K. */
export function convertTemperaturePoint(value: number, from: TempUnitId, to: TempUnitId): number | null {
  const k = toKelvin(value, from);
  if (k < 0) return null;
  return fromKelvin(k, to);
}

export function allTempsFromKelvin(kelvin: number): Map<string, string> | null {
  if (kelvin < 0) return null;
  const out = new Map<string, string>();
  for (const id of TEMP_UNIT_IDS) {
    out.set(id, formatConverted(fromKelvin(kelvin, id)));
  }
  return out;
}

/** Map physical temperature change to Celsius/K delta (no +273.15 / +32). */
export function deltaToCelsius(delta: number, unit: TempUnitId): number {
  if (unit === "F") return (delta * 5) / 9;
  return delta;
}

export function deltaFromCelsius(deltaC: number, unit: TempUnitId): number {
  if (unit === "F") return (deltaC * 9) / 5;
  return deltaC;
}

export function convertTemperatureDelta(delta: number, from: TempUnitId, to: TempUnitId): number {
  const dc = deltaToCelsius(delta, from);
  return deltaFromCelsius(dc, to);
}

export function allDeltasFromUnit(delta: number, unit: TempUnitId): Map<string, string> {
  const dc = deltaToCelsius(delta, unit);
  const out = new Map<string, string>();
  for (const id of TEMP_UNIT_IDS) {
    out.set(id, formatConverted(deltaFromCelsius(dc, id)));
  }
  return out;
}

export function temperaturePointDifferenceC(aVal: number, aUnit: TempUnitId, bVal: number, bUnit: TempUnitId): number | null {
  const ka = toKelvin(aVal, aUnit);
  const kb = toKelvin(bVal, bUnit);
  if (ka < 0 || kb < 0) return null;
  return kb - ka;
}

export function combineTemperatureDeltas(
  d1: number,
  u1: TempUnitId,
  d2: number,
  u2: TempUnitId,
  op: "sum" | "diff",
): number {
  const c1 = deltaToCelsius(d1, u1);
  const c2 = deltaToCelsius(d2, u2);
  return op === "sum" ? c1 + c2 : c1 - c2;
}

export type TempPresetId = "absoluteZero" | "freezing" | "room" | "body" | "boiling";

export const TEMP_PRESETS: Record<TempPresetId, { unit: TempUnitId; value: string }> = {
  absoluteZero: { unit: "K", value: "0" },
  freezing: { unit: "C", value: "0" },
  room: { unit: "C", value: "20" },
  body: { unit: "C", value: "36.6" },
  boiling: { unit: "C", value: "100" },
};