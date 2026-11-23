"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

import { KixtGtmRouteSync } from "@/components/analytics/KixtGtmRouteSync";
import { I18nProvider } from "@/i18n/context";
import type { Lang } from "@/i18n/locales";

export function LangShell({ lang, children }: { lang: Lang; children: ReactNode }) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <I18nProvider initialLang={lang}>
      <KixtGtmRouteSync />
      {children}
    </I18nProvider>
  );
}