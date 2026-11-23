import { formatConverted } from "@/lib/convert/format";
import { SPEED_UNITS } from "@/lib/convert/units-data";

export type SpeedUnitId = (typeof SPEED_UNITS)[number]["id"];

export const SPEED_UNIT_IDS = SPEED_UNITS.map((u) => u.id) as SpeedUnitId[];

const byId = new Map(SPEED_UNITS.map((u) => [u.id, u]));

const KM_PER_MI = 1.609344;

export function toMetersPerSecond(value: number, unitId: string): number | null {
  const unit = byId.get(unitId);
  if (!unit) return null;
  return value * unit.toBase;
}

export function fromMetersPerSecond(mps: number, unitId: string): number | null {
  const unit = byId.get(unitId);
  if (!unit) return null;
  return mps / unit.toBase;
}

export function convertSpeed(value: number, fromId: string, toId: string): number | null {
  const mps = toMetersPerSecond(value, fromId);
  if (mps === null) return null;
  return fromMetersPerSecond(mps, toId);
}

export function allSpeedFromMps(mps: number): Map<string, string> {
  const out = new Map<string, string>();
  for (const u of SPEED_UNITS) {
    out.set(u.id, formatConverted(mps / u.toBase));
  }
  return out;
}

export type SpeedPresetId = "urban" | "highway" | "usHighway" | "vessel" | "sprint" | "skydive";

/** 1 kn = 1.852 km/h (via 1852 m per nautical mile). */
export const SPEED_PRESETS: Record<SpeedPresetId, { unit: SpeedUnitId; value: string }> = {
  urban: { unit: "km_h", value: "50" },
  highway: { unit: "km_h", value: "100" },
  usHighway: { unit: "mph", value: "65" },
  vessel: { unit: "kn", value: "18" },
  sprint: { unit: "m_s", value: "10" },
  skydive: { unit: "ft_s", value: "53" },
};

export function distanceToKm(value: number, unit: "km" | "mi"): number {
  return unit === "mi" ? value * KM_PER_MI : value;
}

export function distanceFromKm(km: number, unit: "km" | "mi"): number {
  return unit === "mi" ? km / KM_PER_MI : km;
}

/** Time in hours from distance (km) and speed (m/s). */
export function travelTimeHours(distanceKm: number, speedMps: number): number | null {
  if (speedMps <= 0 || distanceKm < 0) return null;
  const kmh = speedMps * 3.6;
  if (kmh <= 0) return null;
  return distanceKm / kmh;
}

/** Distance in km from time (hours) and speed (m/s). */
export function travelDistanceKm(timeHours: number, speedMps: number): number | null {
  if (speedMps <= 0 || timeHours < 0) return null;
  return (speedMps * 3.6) * timeHours;
}

/** Speed in m/s from distance (km) and time (hours). */
export function travelSpeedMps(distanceKm: number, timeHours: number): number | null {
  if (timeHours <= 0 || distanceKm < 0) return null;
  const kmh = distanceKm / timeHours;
  return kmh / 3.6;
}

export function formatDurationHours(
  hours: number,
  labels: { hoursShort: string; minutesShort: string },
): string {
  if (!Number.isFinite(hours) || hours < 0) return "";
  const totalMin = Math.round(hours * 60);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0) return `${m} ${labels.minutesShort}`;
  if (m === 0) return `${h} ${labels.hoursShort}`;
  return `${h} ${labels.hoursShort} ${m} ${labels.minutesShort}`;
}