import { DEFAULT_LANG, LANGS, type Lang } from "@/i18n/locales";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://convert.kixt.net").replace(/\/$/, "");

export const OG_LOCALE: Record<Lang, string> = {
  en: "en_GB",
  uk: "uk_UA",
  de: "de_DE",
  es: "es_ES",
  pl: "pl_PL",
  fr: "fr_FR",
};

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

/** Path after language segment, e.g. "" | "/measurements" | "/calculators/percentages" */
export function hreflangAlternates(pathAfterLang: string): Record<string, string> {
  const suffix = pathAfterLang.startsWith("/") || pathAfterLang === "" ? pathAfterLang : `/${pathAfterLang}`;
  const langs: Record<string, string> = {};
  for (const lang of LANGS) {
    langs[lang] = absoluteUrl(`/${lang}${suffix}`);
  }
  langs["x-default"] = absoluteUrl(`/${DEFAULT_LANG}${suffix}`);
  return langs;
}

export function canonicalForLang(lang: Lang, pathAfterLang: string): string {
  const suffix = pathAfterLang.startsWith("/") || pathAfterLang === "" ? pathAfterLang : `/${pathAfterLang}`;
  return absoluteUrl(`/${lang}${suffix}`);
}