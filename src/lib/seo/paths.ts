import type { SeoPageId } from "@/i18n/seo/copy";
import { CATEGORIES, type CategoryId, type ToolRouteId } from "@/lib/tools/routes";

export function seoPathAfterLang(page: SeoPageId): string {
  if (page === "home") return "";
  if ((CATEGORIES as readonly string[]).includes(page)) return `/${page}`;
  const routeId = page as ToolRouteId;
  const [category, sub] = routeId.split("/");
  return `/${category}/${sub}`;
}

export function isCategoryPageId(id: SeoPageId): id is CategoryId {
  return (CATEGORIES as readonly string[]).includes(id);
}

export function isToolPageId(id: SeoPageId): id is ToolRouteId {
  return !isCategoryPageId(id) && id !== "home";
}