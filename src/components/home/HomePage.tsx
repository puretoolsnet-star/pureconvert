"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { useI18n } from "@/i18n/context";
import { getCategoryCopy } from "@/i18n/tools/get-copy";
import { CATEGORIES, categoryPath, type CategoryId } from "@/lib/tools/routes";
import { getCategoryIcon } from "@/lib/tools/icons";
import { useLocalizedPath } from "@/lib/i18n/use-localized-path";
import { cn } from "@/lib/cn";

export function HomePage() {
  const { lang, t } = useI18n();
  const href = useLocalizedPath();

  return (
    <div className="pureconvert-page-shell flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <section className="max-w-3xl">
          <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{t.home.heroTitle}</h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-400 sm:text-base">{t.home.heroIntro}</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-500">
            {t.security.points.map((point) => (
              <li key={point} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" aria-hidden />
                {point}
              </li>
            ))}
          </ul>
        </section>
        <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-slate-500">
          {t.home.categoriesHeading}
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {CATEGORIES.map((cat) => {
            const copy = getCategoryCopy(lang, cat);
            const Icon = getCategoryIcon(cat);
            return (
              <li key={cat}>
                <Link
                  href={href(categoryPath(cat))}
                  className={cn(
                    "glass-card group flex h-full flex-col rounded-2xl border border-slate-800 p-5 transition-colors",
                    "hover:border-sky-500/40",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/15 ring-1 ring-sky-400/30">
                      <Icon className="h-5 w-5 text-sky-300" aria-hidden />
                    </div>
                    <h3 className="text-base font-semibold text-white">{t.nav[cat as CategoryId]}</h3>
                  </div>
                  <p className="mt-3 flex-1 text-sm text-slate-500">{copy.pageIntro}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm text-sky-300 group-hover:gap-2">
                    {t.home.openCategory}
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <div
          id="pureconvert-ad-home-mid"
          className="mt-10 min-h-0 w-full"
          data-ad-slot="home-mid"
          data-adsense-unit=""
          aria-hidden
        />
      </main>
      <SiteFooter />
    </div>
  );
}