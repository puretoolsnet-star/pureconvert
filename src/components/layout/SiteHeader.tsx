"use client";

import { ArrowLeftRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { EcosystemMenu } from "@/components/layout/EcosystemMenu";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { MobileHeaderMenu } from "@/components/layout/MobileHeaderMenu";
import { useI18n } from "@/i18n/context";
import { CATEGORIES, categoryPath, type CategoryId } from "@/lib/tools/routes";
import { getCategoryIcon } from "@/lib/tools/icons";
import { useLocalizedPath } from "@/lib/i18n/use-localized-path";
import { stripLangPrefix } from "@/lib/i18n/routing";
import { cn } from "@/lib/cn";
import { Z } from "@/lib/layer-stack";

export function SiteHeader() {
  const { t } = useI18n();
  const href = useLocalizedPath();
  const pathname = usePathname();
  const rest = stripLangPrefix(pathname ?? "/");

  return (
    <header
      className="sticky top-0 border-b border-slate-800/90 bg-slate-950 md:bg-slate-950/90 md:backdrop-blur-md"
      style={{ zIndex: Z.siteHeader }}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 px-4 py-3 sm:px-6">
        <Link
          href={href("/")}
          className="group flex min-w-0 items-center gap-2.5 text-white"
          aria-label={`${t.brand.name} — ${t.brand.tagline}`}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500/25 to-blue-600/20 ring-1 ring-sky-400/35">
            <ArrowLeftRight className="h-5 w-5 text-sky-300" aria-hidden />
          </span>
          <span className="min-w-0 truncate">
            <span className="block text-sm font-semibold tracking-tight sm:text-base">{t.brand.name}</span>
            <span className="hidden truncate text-[11px] text-slate-500 md:block">{t.brand.tagline}</span>
          </span>
        </Link>

        <div className="flex shrink-0 items-center justify-end gap-1.5 sm:gap-2">
          <span className="glass-card hidden items-center gap-1.5 rounded-full border border-sky-500/25 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-200 lg:inline-flex">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" aria-hidden />
            {t.security.badge}
          </span>
          <nav className="hidden items-center gap-0.5 xl:flex" aria-label={t.nav.convert}>
            {CATEGORIES.map((cat) => {
              const active = rest === categoryPath(cat) || rest.startsWith(`${categoryPath(cat)}/`);
              const CatIcon = getCategoryIcon(cat);
              return (
                <Link
                  key={cat}
                  href={href(categoryPath(cat))}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors",
                    active
                      ? "bg-sky-500/15 font-medium text-sky-200"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-sky-200",
                  )}
                >
                  <CatIcon className="h-4 w-4 shrink-0" aria-hidden />
                  {t.nav[cat as CategoryId]}
                </Link>
              );
            })}
          </nav>
          <EcosystemMenu />
          <LanguageSwitcher />
          <MobileHeaderMenu />
        </div>
      </div>
    </header>
  );
}