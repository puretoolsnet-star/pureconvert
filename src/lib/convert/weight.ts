import { formatConverted } from "@/lib/convert/format";
import type { LinearUnitDef } from "@/lib/convert/linear";
import { WEIGHT_UNITS } from "@/lib/convert/units-data";

export type WeightUnitId = (typeof WEIGHT_UNITS)[number]["id"];

export const WEIGHT_UNIT_IDS = WEIGHT_UNITS.map((u) => u.id) as WeightUnitId[];

export const WEIGHT_METRIC: WeightUnitId[] = ["mg", "g", "kg", "t"];
export const WEIGHT_IMPERIAL: WeightUnitId[] = ["oz", "lb", "st"];

export const WEIGHT_SCALE_OUTPUT: WeightUnitId[] = ["g", "kg", "lb"];

const byId = new Map(WEIGHT_UNITS.map((u) => [u.id, u]));

export function weightUnitDef(id: string): LinearUnitDef | undefined {
  return byId.get(id);
}

export function toKilograms(value: number, unitId: string): number | null {
  const unit = weightUnitDef(unitId);
  if (!unit) return null;
  return value * unit.toBase;
}

export function fromKilograms(kg: number, unitId: string): number | null {
  const unit = weightUnitDef(unitId);
  if (!unit) return null;
  return kg / unit.toBase;
}

export function convertWeight(value: number, fromId: string, toId: string): number | null {
  const kg = toKilograms(value, fromId);
  if (kg === null) return null;
  return fromKilograms(kg, toId);
}

export function allWeightFromKilograms(kg: number): Map<string, string> {
  const out = new Map<string, string>();
  for (const u of WEIGHT_UNITS) {
    out.set(u.id, formatConverted(kg / u.toBase));
  }
  return out;
}

export type WeightPresetId = "micro" | "ingredient" | "body" | "stone" | "freight";

export const WEIGHT_PRESETS: Record<WeightPresetId, { unit: WeightUnitId; value: string }> = {
  micro: { unit: "mg", value: "250" },
  ingredient: { unit: "g", value: "500" },
  body: { unit: "kg", value: "70" },
  stone: { unit: "st", value: "12" },
  freight: { unit: "t", value: "2.5" },
};

export function weightSumDifference(
  aVal: number,
  aUnit: string,
  bVal: number,
  bUnit: string,
  op: "sum" | "diff",
): number | null {
  const ka = toKilograms(aVal, aUnit);
  const kb = toKilograms(bVal, bUnit);
  if (ka === null || kb === null) return null;
  return op === "sum" ? ka + kb : ka - kb;
}