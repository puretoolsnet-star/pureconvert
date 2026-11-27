"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { useI18n } from "@/i18n/context";
import { SEO_UI } from "@/i18n/seo/labels";
import { getSubcategoryCopy } from "@/i18n/tools/get-copy";
import { useLocalizedPath } from "@/lib/i18n/use-localized-path";
import { getSubcategoryIcon } from "@/lib/tools/icons";
import type { CategoryId, ToolRouteId } from "@/lib/tools/routes";
import { SUBCATEGORIES_BY_CATEGORY, toolPath } from "@/lib/tools/routes";

export function RelatedConverters({
  categoryId,
  activeRouteId,
}: {
  categoryId: CategoryId;
  activeRouteId: ToolRouteId;
}) {
  const { lang } = useI18n();
  const ui = SEO_UI[lang];
  const href = useLocalizedPath();
  const siblings = SUBCATEGORIES_BY_CATEGORY[categoryId].filter(
    (sub) => `${categoryId}/${sub}` !== activeRouteId,
  );

  if (siblings.length === 0) return null;

  return (
    <nav
      aria-label={ui.relatedNavAria}
      className="mt-8 min-w-0 rounded-2xl border border-slate-800 bg-slate-950/50 p-4 sm:p-5"
    >
      <h2 className="text-sm font-semibold text-white">{ui.relatedTitle}</h2>
      <ul className="mt-3 flex flex-col gap-2">
        {siblings.map((sub) => {
          const routeId = `${categoryId}/${sub}` as ToolRouteId;
          const copy = getSubcategoryCopy(lang, routeId);
          const Icon = getSubcategoryIcon(routeId);
          return (
            <li key={sub}>
              <Link
                href={href(toolPath(routeId))}
                className="group flex min-w-0 items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-400 transition-colors hover:bg-slate-900/80 hover:text-sky-200"
              >
                <Icon className="h-4 w-4 shrink-0 text-sky-400/80" aria-hidden />
                <span className="min-w-0 flex-1 truncate [overflow-wrap:anywhere]">{copy.title}</span>
                <ChevronRight className="h-4 w-4 shrink-0 opacity-60 group-hover:opacity-100" aria-hidden />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}