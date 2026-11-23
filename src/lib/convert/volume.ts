import { formatConverted } from "@/lib/convert/format";
import type { LinearUnitDef } from "@/lib/convert/linear";
import { VOLUME_UNITS } from "@/lib/convert/units-data";

export type VolumeUnitId = (typeof VOLUME_UNITS)[number]["id"];

export const VOLUME_UNIT_IDS = VOLUME_UNITS.map((u) => u.id) as VolumeUnitId[];

/** Key units for quick glance (metric + US kitchen). */
export const VOLUME_PRIORITY: VolumeUnitId[] = ["ml", "l", "m3", "cup", "pt", "qt", "gal"];

/** Smaller metric + US spoon / fluid measures. */
export const VOLUME_EXTRA: VolumeUnitId[] = ["cm3", "tsp", "tbsp", "fl_oz"];

const byId = new Map(VOLUME_UNITS.map((u) => [u.id, u]));

export function volumeUnitDef(id: string): LinearUnitDef | undefined {
  return byId.get(id);
}

export function toLiters(value: number, unitId: string): number | null {
  const unit = volumeUnitDef(unitId);
  if (!unit) return null;
  return value * unit.toBase;
}

export function fromLiters(liters: number, unitId: string): number | null {
  const unit = volumeUnitDef(unitId);
  if (!unit) return null;
  return liters / unit.toBase;
}

export function convertVolume(value: number, fromId: string, toId: string): number | null {
  const l = toLiters(value, fromId);
  if (l === null) return null;
  return fromLiters(l, toId);
}

export function allVolumeFromLiters(liters: number): Map<string, string> {
  const out = new Map<string, string>();
  for (const u of VOLUME_UNITS) {
    out.set(u.id, formatConverted(liters / u.toBase));
  }
  return out;
}

export type VolumePresetId = "recipe" | "pint" | "quart" | "gallon" | "cubic";

export const VOLUME_PRESETS: Record<VolumePresetId, { unit: VolumeUnitId; value: string }> = {
  recipe: { unit: "cup", value: "2" },
  pint: { unit: "pt", value: "1" },
  quart: { unit: "qt", value: "0.75" },
  gallon: { unit: "gal", value: "1" },
  cubic: { unit: "m3", value: "2.5" },
};

export function volumeSumDifference(
  aVal: number,
  aUnit: string,
  bVal: number,
  bUnit: string,
  op: "sum" | "diff",
): number | null {
  const la = toLiters(aVal, aUnit);
  const lb = toLiters(bVal, bUnit);
  if (la === null || lb === null) return null;
  return op === "sum" ? la + lb : la - lb;
}