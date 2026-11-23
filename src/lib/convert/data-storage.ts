import { formatConverted } from "@/lib/convert/format";
import { DATA_STORAGE_UNITS } from "@/lib/convert/units-data";

export type DataStorageUnitId = (typeof DATA_STORAGE_UNITS)[number]["id"];

export const DATA_STORAGE_UNIT_IDS = DATA_STORAGE_UNITS.map((u) => u.id) as DataStorageUnitId[];

export const BINARY_STEP = 1024;

const byId = new Map(DATA_STORAGE_UNITS.map((u) => [u.id, u]));

export function toBytes(value: number, unitId: string): number | null {
  const unit = byId.get(unitId);
  if (!unit) return null;
  return value * unit.toBase;
}

export function fromBytes(bytes: number, unitId: string): number | null {
  const unit = byId.get(unitId);
  if (!unit) return null;
  return bytes / unit.toBase;
}

export function convertDataStorage(value: number, fromId: string, toId: string): number | null {
  const bytes = toBytes(value, fromId);
  if (bytes === null) return null;
  return fromBytes(bytes, toId);
}

export function allDataStorageFromBytes(bytes: number): Map<string, string> {
  const out = new Map<string, string>();
  for (const u of DATA_STORAGE_UNITS) {
    out.set(u.id, formatConverted(bytes / u.toBase));
  }
  return out;
}

export type DataStoragePresetId = "document" | "image" | "video" | "drive" | "warehouse";

export const DATA_STORAGE_PRESETS: Record<DataStoragePresetId, { unit: DataStorageUnitId; value: string }> = {
  document: { unit: "KB", value: "850" },
  image: { unit: "MB", value: "12" },
  video: { unit: "GB", value: "4.7" },
  drive: { unit: "TB", value: "1" },
  warehouse: { unit: "PB", value: "2" },
};

export function dataStorageSum(aVal: number, aUnit: string, bVal: number, bUnit: string): number | null {
  const ba = toBytes(aVal, aUnit);
  const bb = toBytes(bVal, bUnit);
  if (ba === null || bb === null) return null;
  return ba + bb;
}