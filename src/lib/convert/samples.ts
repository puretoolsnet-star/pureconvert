import type { ToolRouteId } from "@/lib/tools/routes";

export const SAMPLE_VALUES: Record<ToolRouteId, Record<string, string>> = {
  "measurements/length": { m: "1.75", cm: "178", um: "50" },
  "measurements/area": { a: "12", m2: "850" },
  "measurements/volume": { cup: "2", l: "2.5" },
  "physics/weight": { kg: "70", g: "500", st: "12" },
  "physics/temperature": { C: "20" },
  "physics/speed": { km_h: "100" },
  "physics/pressure-energy": { kPa: "101.325" },
  "digital/data-storage": { MB: "512" },
  "digital/data-transfer": { Mbps: "100" },
  "digital/ratios-aspect": {},
  "calculators/percentages": { value: "200", percent: "15" },
  "calculators/discounts": { price: "89.99", percent: "20" },
  "calculators/proportions": { a: "3", b: "4", c: "15" },
};