import { dictionaries, type Lang } from "@/i18n/locales";
import type { CategoryCopy, SubcategoryCopy } from "@/i18n/types";
import type { CategoryId, ToolRouteId } from "@/lib/tools/routes";

export function getCategoryCopy(lang: Lang, categoryId: CategoryId): CategoryCopy {
  return dictionaries[lang].categories[categoryId];
}

export function getSubcategoryCopy(lang: Lang, routeId: ToolRouteId): SubcategoryCopy {
  return dictionaries[lang].subcategories[routeId];
}

export function unitLabel(lang: Lang, unitId: string): string {
  return dictionaries[lang].units[unitId] ?? unitId;
}

export function unitSymbol(lang: Lang, unitId: string): string {
  return dictionaries[lang].unitSymbols[unitId] ?? unitId;
}