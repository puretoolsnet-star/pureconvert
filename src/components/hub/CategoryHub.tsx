"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { useI18n } from "@/i18n/context";
import { getCategoryCopy, getSubcategoryCopy } from "@/i18n/tools/get-copy";
import type { CategoryId, ToolRouteId } from "@/lib/tools/routes";
import { SUBCATEGORIES_BY_CATEGORY, toolPath } from "@/lib/tools/routes";
import { getCategoryIcon, getSubcategoryIcon } from "@/lib/tools/icons";
import { useLocalizedPath } from "@/lib/i18n/use-localized-path";
import { PageSeoSection } from "@/components/seo/PageSeoSection";
import { cn } from "@/lib/cn";
import { usePageSeoContent } from "@/lib/i18n/use-page-seo-content";

export function CategoryHub({ categoryId }: { categoryId: CategoryId }) {
  const { lang, t } = useI18n();
  const href = useLocalizedPath();
  const copy = getCategoryCopy(lang, categoryId);
  const CategoryIcon = getCategoryIcon(categoryId);
  const seoContent = usePageSeoContent(categoryId);

  return (
    <div className="pureconvert-page-shell flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-500/15 ring-1 ring-sky-400/35">
            <CategoryIcon className="h-6 w-6 text-sky-300" aria-hidden />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold text-white">{copy.hubTitle}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">{copy.pageIntro}</p>
          </div>
        </div>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {SUBCATEGORIES_BY_CATEGORY[categoryId].map((sub) => {
            const routeId = `${categoryId}/${sub}` as ToolRouteId;
            const subCopy = getSubcategoryCopy(lang, routeId);
            const SubIcon = getSubcategoryIcon(routeId);
            return (
              <li key={sub}>
                <Link
                  href={href(toolPath(routeId))}
                  className={cn(
                    "glass-card flex h-full flex-col rounded-2xl border border-slate-800 p-4 transition-colors",
                    "hover:border-sky-500/40",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <SubIcon className="mt-0.5 h-5 w-5 shrink-0 text-sky-400" aria-hidden />
                    <h2 className="text-sm font-semibold text-white">{subCopy.title}</h2>
                  </div>
                  <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-500">{subCopy.description}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs text-sky-300">
                    {t.home.openCategory}
                    <ChevronRight className="h-3 w-3" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <PageSeoSection content={seoContent} />
      </main>
      <SiteFooter />
    </div>
  );
}