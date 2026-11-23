import type { LinearUnitDef } from "@/lib/convert/linear";
import { formatConverted } from "@/lib/convert/format";
import { toMeters } from "@/lib/convert/length";
import { AREA_UNITS } from "@/lib/convert/units-data";

export type AreaUnitId = (typeof AREA_UNITS)[number]["id"];

export const AREA_UNIT_IDS = AREA_UNITS.map((u) => u.id) as AreaUnitId[];

export const AREA_PRIORITY: AreaUnitId[] = ["m2", "a", "ha", "ac"];
export const AREA_EXTRA: AreaUnitId[] = ["km2", "sq_ft", "sq_yd"];

export const AREA_RECT_OUTPUT: AreaUnitId[] = ["m2", "a", "ha", "ac"];

const byId = new Map(AREA_UNITS.map((u) => [u.id, u]));

export function areaUnitDef(id: string): LinearUnitDef | undefined {
  return byId.get(id);
}

export function toSquareMeters(value: number, unitId: string): number | null {
  const unit = areaUnitDef(unitId);
  if (!unit) return null;
  return value * unit.toBase;
}

export function fromSquareMeters(sqM: number, unitId: string): number | null {
  const unit = areaUnitDef(unitId);
  if (!unit) return null;
  return sqM / unit.toBase;
}

export function convertArea(value: number, fromId: string, toId: string): number | null {
  const m2 = toSquareMeters(value, fromId);
  if (m2 === null) return null;
  return fromSquareMeters(m2, toId);
}

export function allAreaFromSquareMeters(sqM: number): Map<string, string> {
  const out = new Map<string, string>();
  for (const u of AREA_UNITS) {
    out.set(u.id, formatConverted(sqM / u.toBase));
  }
  return out;
}

export function rectangleAreaSquareMeters(
  lengthVal: number,
  lengthUnit: string,
  widthVal: number,
  widthUnit: string,
): number | null {
  const lm = toMeters(lengthVal, lengthUnit);
  const wm = toMeters(widthVal, widthUnit);
  if (lm === null || wm === null) return null;
  return lm * wm;
}

export type AreaPresetId = "garden" | "plan" | "field" | "acreLand";

export const AREA_PRESETS: Record<AreaPresetId, { unit: AreaUnitId; value: string }> = {
  garden: { unit: "a", value: "12" },
  plan: { unit: "m2", value: "850" },
  field: { unit: "ha", value: "45" },
  acreLand: { unit: "ac", value: "25" },
};

export function areaSumDifference(
  aVal: number,
  aUnit: string,
  bVal: number,
  bUnit: string,
  op: "sum" | "diff",
): number | null {
  const ma = toSquareMeters(aVal, aUnit);
  const mb = toSquareMeters(bVal, bUnit);
  if (ma === null || mb === null) return null;
  return op === "sum" ? ma + mb : ma - mb;
}
