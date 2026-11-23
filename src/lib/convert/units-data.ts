import type { LinearUnitDef } from "@/lib/convert/linear";

export const LENGTH_UNITS: LinearUnitDef[] = [
  { id: "nm", toBase: 1e-9 },
  { id: "um", toBase: 1e-6 },
  { id: "mm", toBase: 0.001 },
  { id: "cm", toBase: 0.01 },
  { id: "m", toBase: 1 },
  { id: "km", toBase: 1000 },
  { id: "in", toBase: 0.0254 },
  { id: "ft", toBase: 0.3048 },
  { id: "yd", toBase: 0.9144 },
  { id: "mi", toBase: 1609.344 },
  { id: "nmi", toBase: 1852 },
];

export const AREA_UNITS: LinearUnitDef[] = [
  { id: "m2", toBase: 1 },
  { id: "a", toBase: 100 },
  { id: "ha", toBase: 10000 },
  { id: "ac", toBase: 4046.8564224 },
  { id: "km2", toBase: 1e6 },
  { id: "sq_ft", toBase: 0.09290304 },
  { id: "sq_yd", toBase: 0.83612736 },
];

export const VOLUME_UNITS: LinearUnitDef[] = [
  { id: "ml", toBase: 0.001 },
  { id: "l", toBase: 1 },
  { id: "cm3", toBase: 0.001 },
  { id: "m3", toBase: 1000 },
  { id: "tsp", toBase: 4.92892159375 },
  { id: "tbsp", toBase: 14.78676478125 },
  { id: "fl_oz", toBase: 29.5735295625 },
  { id: "cup", toBase: 236.5882365 },
  { id: "pt", toBase: 473.176473 },
  { id: "qt", toBase: 946.352946 },
  { id: "gal", toBase: 3785.411784 },
];

export const WEIGHT_UNITS: LinearUnitDef[] = [
  { id: "mg", toBase: 1e-6 },
  { id: "g", toBase: 0.001 },
  { id: "kg", toBase: 1 },
  { id: "t", toBase: 1000 },
  { id: "oz", toBase: 0.028349523125 },
  { id: "lb", toBase: 0.45359237 },
  { id: "st", toBase: 6.35029318 },
];

export const SPEED_UNITS: LinearUnitDef[] = [
  { id: "m_s", toBase: 1 },
  { id: "km_h", toBase: 1 / 3.6 },
  { id: "mph", toBase: 0.44704 },
  { id: "kn", toBase: 0.514444 },
  { id: "ft_s", toBase: 0.3048 },
];

export const PRESSURE_UNITS: LinearUnitDef[] = [
  { id: "Pa", toBase: 1 },
  { id: "kPa", toBase: 1000 },
  { id: "bar", toBase: 100000 },
  { id: "atm", toBase: 101325 },
  { id: "psi", toBase: 6894.757293168 },
];

export const ENERGY_UNITS: LinearUnitDef[] = [
  { id: "J", toBase: 1 },
  { id: "kJ", toBase: 1000 },
  { id: "MJ", toBase: 1e6 },
  { id: "Wh", toBase: 3600 },
  { id: "kWh", toBase: 3.6e6 },
  { id: "kcal", toBase: 4184 },
];

/** Binary prefixes for storage */
export const DATA_STORAGE_UNITS: LinearUnitDef[] = [
  { id: "B", toBase: 1 },
  { id: "KB", toBase: 1024 },
  { id: "MB", toBase: 1024 ** 2 },
  { id: "GB", toBase: 1024 ** 3 },
  { id: "TB", toBase: 1024 ** 4 },
  { id: "PB", toBase: 1024 ** 5 },
];

/** Decimal prefixes for transfer rates (bits per second) */
export const DATA_TRANSFER_UNITS: LinearUnitDef[] = [
  { id: "bps", toBase: 1 },
  { id: "Kbps", toBase: 1000 },
  { id: "Mbps", toBase: 1e6 },
  { id: "Gbps", toBase: 1e9 },
];

export type { TempUnitId } from "@/lib/convert/temperature";
import { convertTemperaturePoint, type TempUnitId } from "@/lib/convert/temperature";

/** Legacy helper — still converts mathematically; UI should use convertTemperaturePoint. */
export function convertTemperature(from: TempUnitId, value: number, to: TempUnitId): number {
  const out = convertTemperaturePoint(value, from, to);
  if (out !== null) return out;
  let c: number;
  if (from === "C") c = value;
  else if (from === "F") c = ((value - 32) * 5) / 9;
  else c = value - 273.15;
  if (to === "C") return c;
  if (to === "F") return (c * 9) / 5 + 32;
  return c + 273.15;
}