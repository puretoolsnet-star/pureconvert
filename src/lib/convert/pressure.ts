import { formatConverted } from "@/lib/convert/format";
import { PRESSURE_UNITS } from "@/lib/convert/units-data";

export type PressureUnitId = (typeof PRESSURE_UNITS)[number]["id"];

export const PRESSURE_UNIT_IDS = PRESSURE_UNITS.map((u) => u.id) as PressureUnitId[];

const byId = new Map(PRESSURE_UNITS.map((u) => [u.id, u]));

export function toPascals(value: number, unitId: string): number | null {
  const unit = byId.get(unitId);
  if (!unit) return null;
  return value * unit.toBase;
}

export function fromPascals(pa: number, unitId: string): number | null {
  const unit = byId.get(unitId);
  if (!unit) return null;
  return pa / unit.toBase;
}

export function convertPressure(value: number, fromId: string, toId: string): number | null {
  const pa = toPascals(value, fromId);
  if (pa === null) return null;
  return fromPascals(pa, toId);
}

export function allPressureFromPascals(pa: number): Map<string, string> {
  const out = new Map<string, string>();
  for (const u of PRESSURE_UNITS) {
    out.set(u.id, formatConverted(pa / u.toBase));
  }
  return out;
}

export type PressurePresetId = "tireBar" | "tirePsi" | "atmosphere" | "hydraulic";

export const PRESSURE_PRESETS: Record<PressurePresetId, { unit: PressureUnitId; value: string }> = {
  tireBar: { unit: "bar", value: "2.2" },
  tirePsi: { unit: "psi", value: "32" },
  atmosphere: { unit: "atm", value: "1" },
  hydraulic: { unit: "bar", value: "6" },
};