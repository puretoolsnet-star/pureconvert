import { formatConverted, parseInputNumber } from "@/lib/convert/format";

export type LinearUnitId = string;

export type LinearUnitDef = {
  id: LinearUnitId;
  toBase: number;
};

export function convertLinear(units: LinearUnitDef[], fromId: LinearUnitId, value: number): Map<LinearUnitId, number> {
  const from = units.find((u) => u.id === fromId);
  if (!from) return new Map();
  const base = value * from.toBase;
  const out = new Map<LinearUnitId, number>();
  for (const u of units) {
    out.set(u.id, base / u.toBase);
  }
  return out;
}

export function linearFromInput(
  units: LinearUnitDef[],
  activeUnit: LinearUnitId,
  raw: string,
): Map<LinearUnitId, string> {
  const parsed = parseInputNumber(raw);
  const result = new Map<LinearUnitId, string>();
  if (parsed === null) {
    for (const u of units) result.set(u.id, "");
    return result;
  }
  const values = convertLinear(units, activeUnit, parsed);
  for (const u of units) {
    result.set(u.id, formatConverted(values.get(u.id) ?? 0));
  }
  return result;
}