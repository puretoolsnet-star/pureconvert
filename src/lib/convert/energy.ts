import { formatConverted } from "@/lib/convert/format";
import { ENERGY_UNITS } from "@/lib/convert/units-data";

export type EnergyUnitId = (typeof ENERGY_UNITS)[number]["id"];

export const ENERGY_UNIT_IDS = ENERGY_UNITS.map((u) => u.id) as EnergyUnitId[];

const byId = new Map(ENERGY_UNITS.map((u) => [u.id, u]));

export function toJoules(value: number, unitId: string): number | null {
  const unit = byId.get(unitId);
  if (!unit) return null;
  return value * unit.toBase;
}

export function fromJoules(j: number, unitId: string): number | null {
  const unit = byId.get(unitId);
  if (!unit) return null;
  return j / unit.toBase;
}

export function convertEnergy(value: number, fromId: string, toId: string): number | null {
  const j = toJoules(value, fromId);
  if (j === null) return null;
  return fromJoules(j, toId);
}

export function allEnergyFromJoules(j: number): Map<string, string> {
  const out = new Map<string, string>();
  for (const u of ENERGY_UNITS) {
    out.set(u.id, formatConverted(j / u.toBase));
  }
  return out;
}

export type EnergyPresetId = "kwh" | "whDevice" | "dailyKcal" | "kilojoule" | "megajoule";

export const ENERGY_PRESETS: Record<EnergyPresetId, { unit: EnergyUnitId; value: string }> = {
  kwh: { unit: "kWh", value: "1" },
  whDevice: { unit: "Wh", value: "50" },
  dailyKcal: { unit: "kcal", value: "2000" },
  kilojoule: { unit: "kJ", value: "1000" },
  megajoule: { unit: "MJ", value: "1" },
};