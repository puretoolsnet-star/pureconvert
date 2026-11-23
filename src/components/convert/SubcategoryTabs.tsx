"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useI18n } from "@/i18n/context";
import { getSubcategoryCopy } from "@/i18n/tools/get-copy";
import { stripLangPrefix } from "@/lib/i18n/routing";
import { useLocalizedPath } from "@/lib/i18n/use-localized-path";
import type { CategoryId, ToolRouteId } from "@/lib/tools/routes";
import { SUBCATEGORIES_BY_CATEGORY, toolPath } from "@/lib/tools/routes";
import { cn } from "@/lib/cn";

export function SubcategoryTabs({
  categoryId,
  activeRouteId,
}: {
  categoryId: CategoryId;
  activeRouteId: ToolRouteId;
}) {
  const { lang } = useI18n();
  const href = useLocalizedPath();
  const pathname = usePathname();

  return (
    <nav
      className="mt-6 flex max-w-full gap-1 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      aria-label={getSubcategoryCopy(lang, activeRouteId).title}
    >
      {SUBCATEGORIES_BY_CATEGORY[categoryId].map((sub) => {
        const routeId = `${categoryId}/${sub}` as ToolRouteId;
        const copy = getSubcategoryCopy(lang, routeId);
        const target = href(toolPath(routeId));
        const active =
          activeRouteId === routeId || stripLangPrefix(pathname ?? "") === toolPath(routeId);

        return (
          <Link
            key={sub}
            href={target}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex min-h-11 max-w-[14rem] shrink-0 items-center rounded-full border px-3 py-2 text-xs font-medium transition-colors sm:text-sm",
              active
                ? "border-sky-400/45 bg-sky-500/15 text-sky-100"
                : "border-slate-800 text-slate-400 hover:border-sky-500/30 hover:text-sky-200",
            )}
          >
            <span className="truncate">{copy.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}