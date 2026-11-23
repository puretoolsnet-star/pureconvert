import { convertLinear, linearFromInput, type LinearUnitDef } from "@/lib/convert/linear";
import { formatConverted } from "@/lib/convert/format";
import { LENGTH_UNITS } from "@/lib/convert/units-data";

export type LengthUnitId = (typeof LENGTH_UNITS)[number]["id"];

export const LENGTH_UNIT_IDS = LENGTH_UNITS.map((u) => u.id) as LengthUnitId[];

const byId = new Map(LENGTH_UNITS.map((u) => [u.id, u]));

export function lengthUnitDef(id: string): LinearUnitDef | undefined {
  return byId.get(id);
}

export function toMeters(value: number, unitId: string): number | null {
  const unit = lengthUnitDef(unitId);
  if (!unit) return null;
  return value * unit.toBase;
}

export function fromMeters(meters: number, unitId: string): number | null {
  const unit = lengthUnitDef(unitId);
  if (!unit) return null;
  return meters / unit.toBase;
}

export function convertLength(value: number, fromId: string, toId: string): number | null {
  const m = toMeters(value, fromId);
  if (m === null) return null;
  return fromMeters(m, toId);
}

export function allLengthFormatted(fromId: string, raw: string): Map<string, string> {
  return linearFromInput(LENGTH_UNITS, fromId, raw);
}

export function allLengthFromMeters(meters: number): Map<string, string> {
  const out = new Map<string, string>();
  for (const u of LENGTH_UNITS) {
    out.set(u.id, formatConverted(meters / u.toBase));
  }
  return out;
}

export function lengthValuesNumeric(fromId: string, value: number): Map<string, number> {
  return convertLinear(LENGTH_UNITS, fromId, value);
}

export type LengthPresetId = "height" | "run" | "sea" | "micro";

export const LENGTH_PRESETS: Record<LengthPresetId, { unit: LengthUnitId; value: string }> = {
  height: { unit: "cm", value: "178" },
  run: { unit: "km", value: "10.5" },
  sea: { unit: "nmi", value: "120" },
  micro: { unit: "um", value: "50" },
};