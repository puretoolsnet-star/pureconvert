import {
  ArrowLeftRight,
  Calculator,
  Cpu,
  Gauge,
  Ruler,
  type LucideIcon,
} from "lucide-react";

import type { CategoryId, ToolRouteId } from "@/lib/tools/routes";

const CATEGORY_ICONS: Record<CategoryId, LucideIcon> = {
  measurements: Ruler,
  physics: Gauge,
  digital: Cpu,
  calculators: Calculator,
};

const TOOL_ICONS: Partial<Record<ToolRouteId, LucideIcon>> = {};

export function getCategoryIcon(categoryId: CategoryId): LucideIcon {
  return CATEGORY_ICONS[categoryId];
}

export function getSubcategoryIcon(routeId: ToolRouteId): LucideIcon {
  return TOOL_ICONS[routeId] ?? ArrowLeftRight;
}