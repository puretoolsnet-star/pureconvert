export const CATEGORIES = ["measurements", "physics", "digital", "calculators"] as const;
export type CategoryId = (typeof CATEGORIES)[number];

export const SUBCATEGORIES_BY_CATEGORY = {
  measurements: ["length", "area", "volume"] as const,
  physics: ["weight", "temperature", "speed", "pressure-energy"] as const,
  digital: ["data-storage", "data-transfer", "ratios-aspect"] as const,
  calculators: ["percentages", "discounts", "proportions"] as const,
} as const;

export type MeasurementsSub = (typeof SUBCATEGORIES_BY_CATEGORY.measurements)[number];
export type PhysicsSub = (typeof SUBCATEGORIES_BY_CATEGORY.physics)[number];
export type DigitalSub = (typeof SUBCATEGORIES_BY_CATEGORY.digital)[number];
export type CalculatorsSub = (typeof SUBCATEGORIES_BY_CATEGORY.calculators)[number];

export type SubcategoryId<C extends CategoryId = CategoryId> =
  (typeof SUBCATEGORIES_BY_CATEGORY)[C][number];

export type ToolRouteId =
  | `measurements/${MeasurementsSub}`
  | `physics/${PhysicsSub}`
  | `digital/${DigitalSub}`
  | `calculators/${CalculatorsSub}`;

export const TOOL_ROUTE_IDS = CATEGORIES.flatMap((category) =>
  SUBCATEGORIES_BY_CATEGORY[category].map((sub) => `${category}/${sub}` as ToolRouteId),
);

export function toolPath(routeId: ToolRouteId): string {
  return `/${routeId}`;
}

export function categoryPath(category: CategoryId): string {
  return `/${category}`;
}

export function parseToolRoute(routeId: string): ToolRouteId | null {
  if ((TOOL_ROUTE_IDS as string[]).includes(routeId)) return routeId as ToolRouteId;
  return null;
}

export function routeFromSegments(category: string, subcategory: string): ToolRouteId | null {
  if (!(CATEGORIES as readonly string[]).includes(category)) return null;
  const list = SUBCATEGORIES_BY_CATEGORY[category as CategoryId];
  if (!(list as readonly string[]).includes(subcategory)) return null;
  return parseToolRoute(`${category}/${subcategory}`);
}