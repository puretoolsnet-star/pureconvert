import { formatConverted } from "@/lib/convert/format";
import { DATA_TRANSFER_UNITS } from "@/lib/convert/units-data";

export type DataTransferUnitId = (typeof DATA_TRANSFER_UNITS)[number]["id"];

export const DATA_TRANSFER_UNIT_IDS = DATA_TRANSFER_UNITS.map((u) => u.id) as DataTransferUnitId[];

export const DECIMAL_STEP = 1000;

const BITS_PER_BYTE = 8;

const byId = new Map(DATA_TRANSFER_UNITS.map((u) => [u.id, u]));

export function toBitsPerSecond(value: number, unitId: string): number | null {
  const unit = byId.get(unitId);
  if (!unit) return null;
  return value * unit.toBase;
}

export function fromBitsPerSecond(bps: number, unitId: string): number | null {
  const unit = byId.get(unitId);
  if (!unit) return null;
  return bps / unit.toBase;
}

export function convertDataTransfer(value: number, fromId: string, toId: string): number | null {
  const bps = toBitsPerSecond(value, fromId);
  if (bps === null) return null;
  return fromBitsPerSecond(bps, toId);
}

export function allDataTransferFromBps(bps: number): Map<string, string> {
  const out = new Map<string, string>();
  for (const u of DATA_TRANSFER_UNITS) {
    out.set(u.id, formatConverted(bps / u.toBase));
  }
  return out;
}

export type ByteRateKey = "B_s" | "KB_s" | "MB_s" | "GB_s";

export const BYTE_RATE_KEYS: ByteRateKey[] = ["B_s", "KB_s", "MB_s", "GB_s"];

/** Decimal byte rates from bit rate (8 bits = 1 byte; KB = 1000 bytes). */
export function byteRatesFromBps(bps: number): Map<ByteRateKey, string> {
  const bytesPerSec = bps / BITS_PER_BYTE;
  const out = new Map<ByteRateKey, string>();
  out.set("B_s", formatConverted(bytesPerSec));
  out.set("KB_s", formatConverted(bytesPerSec / 1_000));
  out.set("MB_s", formatConverted(bytesPerSec / 1_000_000));
  out.set("GB_s", formatConverted(bytesPerSec / 1_000_000_000));
  return out;
}

export type FileSizeUnit = "MB" | "GB";

const BYTES_PER_MB_DECIMAL = 1_000_000;
const BYTES_PER_GB_DECIMAL = 1_000_000_000;

export function fileSizeToBytes(value: number, unit: FileSizeUnit): number {
  return unit === "GB" ? value * BYTES_PER_GB_DECIMAL : value * BYTES_PER_MB_DECIMAL;
}

/** Seconds to transfer file at given bit rate; null if speed ≤ 0. */
export function transferTimeSeconds(fileBytes: number, bps: number): number | null {
  if (bps <= 0 || fileBytes < 0) return null;
  const bytesPerSec = bps / BITS_PER_BYTE;
  if (bytesPerSec <= 0) return null;
  return fileBytes / bytesPerSec;
}

export function formatTransferDuration(
  seconds: number,
  labels: { hoursShort: string; minutesShort: string; secondsShort: string },
): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "";
  const totalSec = Math.round(seconds);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const parts: string[] = [];
  if (h > 0) parts.push(`${h} ${labels.hoursShort}`);
  if (m > 0) parts.push(`${m} ${labels.minutesShort}`);
  if (s > 0 || parts.length === 0) parts.push(`${s} ${labels.secondsShort}`);
  return parts.join(" ");
}

export type DataTransferPresetId = "streaming" | "voice" | "home" | "gigabit";

export const DATA_TRANSFER_PRESETS: Record<DataTransferPresetId, { unit: DataTransferUnitId; value: string }> = {
  streaming: { unit: "Kbps", value: "512" },
  voice: { unit: "Kbps", value: "128" },
  home: { unit: "Mbps", value: "100" },
  gigabit: { unit: "Gbps", value: "1" },
};