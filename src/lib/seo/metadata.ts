import type { Metadata } from "next";

import { dictionaries, LANGS, type Lang } from "@/i18n/locales";
import { getSeoCopy, type SeoPageId } from "@/i18n/seo/copy";
import { seoPathAfterLang } from "@/lib/seo/paths";
import { OG_LOCALE, absoluteUrl, canonicalForLang, hreflangAlternates } from "@/lib/seo/site-url";
import type { CategoryId, ToolRouteId } from "@/lib/tools/routes";

export { SITE_URL, absoluteUrl, hreflangAlternates } from "@/lib/seo/site-url";

const META_DESC_MAX = 158;

export function trimMetaDescription(text: string): string {
  const one = text.replace(/\s+/g, " ").trim();
  if (one.length <= META_DESC_MAX) return one;
  return `${one.slice(0, META_DESC_MAX - 1).trimEnd()}…`;
}

function withSeoBundle(lang: Lang, page: SeoPageId): Metadata {
  const copy = getSeoCopy(page, lang);
  const pathAfterLang = seoPathAfterLang(page);
  const desc = trimMetaDescription(copy.description);
  const canonical = canonicalForLang(lang, pathAfterLang);
  const brand = dictionaries[lang].brand.name;
  return {
    title: { absolute: copy.title },
    description: desc,
    keywords: copy.keywords,
    alternates: {
      canonical,
      languages: hreflangAlternates(pathAfterLang),
    },
    openGraph: {
      type: "website",
      siteName: brand,
      title: copy.title,
      description: desc,
      url: canonical,
      locale: OG_LOCALE[lang],
      alternateLocale: LANGS.filter((l) => l !== lang).map((l) => OG_LOCALE[l]),
    },
    twitter: {
      card: "summary",
      title: copy.title,
      description: desc,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
  };
}

export function siteMetadataBase(): Metadata {
  const en = dictionaries.en;
  return {
    metadataBase: new URL(absoluteUrl("")),
    title: { default: getSeoCopy("home", "en").title, template: `%s | ${en.brand.name}` },
    description: trimMetaDescription(getSeoCopy("home", "en").description),
    applicationName: en.brand.name,
    openGraph: {
      type: "website",
      siteName: en.brand.name,
      locale: OG_LOCALE.en,
      alternateLocale: LANGS.filter((l) => l !== "en").map((l) => OG_LOCALE[l]),
    },
    robots: { index: true, follow: true },
    verification: {
      google: "NdLL2m61xfnzABPwz5qAmkk0vhEL4f_5eVvJjZynJ5U",
    },
  };
}

export function buildPageMetadata(lang: Lang): Metadata {
  return withSeoBundle(lang, "home");
}

export function buildCategoryMetadata(categoryId: CategoryId, lang: Lang): Metadata {
  return withSeoBundle(lang, categoryId);
}

export function buildToolMetadata(routeId: ToolRouteId, lang: Lang): Metadata {
  return withSeoBundle(lang, routeId);
}