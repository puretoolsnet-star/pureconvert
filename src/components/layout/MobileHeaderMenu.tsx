"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { BodyPortal } from "@/components/layout/BodyPortal";
import { EcosystemProjectList } from "@/components/layout/EcosystemProjectList";
import { useI18n } from "@/i18n/context";
import { LANG_LABELS, LANGS, type Lang } from "@/i18n/locales";
import { useLocalizedPath } from "@/lib/i18n/use-localized-path";
import { CATEGORIES, categoryPath } from "@/lib/tools/routes";
import type { CategoryId } from "@/lib/tools/routes";
import { getCategoryIcon } from "@/lib/tools/icons";
import { Z } from "@/lib/layer-stack";
import { cn } from "@/lib/cn";

export function MobileHeaderMenu() {
  const { lang, setLang, t } = useI18n();
  const href = useLocalizedPath();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  return (
    <>
      <button
        type="button"
        aria-expanded={menuOpen}
        aria-label={t.nav.menuAria}
        onClick={() => setMenuOpen((o) => !o)}
        className="glass-card inline-flex h-10 w-10 items-center justify-center rounded-xl border-slate-800 md:hidden"
      >
        {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      <BodyPortal open={menuOpen}>
        <div
          className="fixed inset-0 flex flex-col bg-slate-950 md:hidden"
          style={{ zIndex: Z.mobileMenu }}
          role="dialog"
          aria-modal="true"
          aria-label={t.nav.menuAria}
        >
          <div className="flex shrink-0 items-center justify-end border-b border-slate-800 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label={t.nav.menuClose}
              className="rounded-lg p-2 text-slate-400"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="min-h-0 flex-1 space-y-8 overflow-y-auto overscroll-contain px-4 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <section>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{t.nav.selectLanguage}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {LANGS.map((code) => (
                  <button
                    key={code}
                    type="button"
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-sm",
                      code === lang
                        ? "border-sky-400/50 bg-sky-500/20 text-sky-200"
                        : "border-slate-700 bg-slate-900 text-slate-300",
                    )}
                    onClick={() => {
                      setLang(code as Lang);
                      setMenuOpen(false);
                    }}
                  >
                    {LANG_LABELS[code].native}
                  </button>
                ))}
              </div>
            </section>
            <section>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{t.nav.convert}</p>
              <ul className="mt-3 space-y-1">
                {CATEGORIES.map((cat) => {
                  const Icon = getCategoryIcon(cat);
                  return (
                    <li key={cat}>
                      <Link
                        href={href(categoryPath(cat))}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-slate-800"
                      >
                        <Icon className="h-4 w-4 text-sky-300" />
                        {t.nav[cat as CategoryId]}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
            <section>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{t.ecosystem.menuShort}</p>
              <EcosystemProjectList onNavigate={() => setMenuOpen(false)} className="mt-3" />
            </section>
          </nav>
        </div>
      </BodyPortal>
    </>
  );
}