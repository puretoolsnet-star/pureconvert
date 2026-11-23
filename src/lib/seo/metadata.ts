import type { Metadata } from "next";

import { dictionaries, LANGS, type Lang } from "@/i18n/locales";
import { TOOL_MODE_SEO } from "@/lib/seo/tool-modes";
import { OG_LOCALE, absoluteUrl, canonicalForLang, hreflangAlternates } from "@/lib/seo/site-url";
import type { CategoryId, ToolRouteId } from "@/lib/tools/routes";

export { SITE_URL, absoluteUrl, hreflangAlternates } from "@/lib/seo/site-url";

const META_DESC_MAX = 158;

export function trimMetaDescription(text: string): string {
  const one = text.replace(/\s+/g, " ").trim();
  if (one.length <= META_DESC_MAX) return one;
  return `${one.slice(0, META_DESC_MAX - 1).trimEnd()}…`;
}

function withSeoBundle(lang: Lang, title: string, description: string, pathAfterLang: string): Metadata {
  const desc = trimMetaDescription(description);
  const canonical = canonicalForLang(lang, pathAfterLang);
  const brand = dictionaries[lang].brand.name;
  return {
    title,
    description: desc,
    alternates: {
      canonical,
      languages: hreflangAlternates(pathAfterLang),
    },
    openGraph: {
      type: "website",
      siteName: brand,
      title,
      description: desc,
      url: canonical,
      locale: OG_LOCALE[lang],
      alternateLocale: LANGS.filter((l) => l !== lang).map((l) => OG_LOCALE[l]),
    },
    twitter: {
      card: "summary",
      title,
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
    title: { default: `${en.brand.name} — ${en.home.heroTitle}`, template: `%s | ${en.brand.name}` },
    description: trimMetaDescription(`${en.home.heroIntro} ${en.brand.tagline}`),
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
  const t = dictionaries[lang];
  const pathAfterLang = "";
  const title = t.home.heroTitle;
  const description = `${t.home.heroIntro} ${t.brand.tagline}`;
  return withSeoBundle(lang, title, description, pathAfterLang);
}

export function buildCategoryMetadata(categoryId: CategoryId, lang: Lang): Metadata {
  const t = dictionaries[lang];
  const cat = t.categories[categoryId];
  const pathAfterLang = `/${categoryId}`;
  const description = `${cat.pageIntro} ${t.brand.tagline}`;
  return withSeoBundle(lang, cat.hubTitle, description, pathAfterLang);
}

export function buildToolMetadata(routeId: ToolRouteId, lang: Lang): Metadata {
  const t = dictionaries[lang];
  const sub = t.subcategories[routeId];
  if (!sub) return {};
  const [category, subSlug] = routeId.split("/");
  const pathAfterLang = `/${category}/${subSlug}`;
  const modes = TOOL_MODE_SEO[lang][routeId];
  const description = [sub.description, sub.hint, modes].filter(Boolean).join(" ");
  return withSeoBundle(lang, sub.title, description, pathAfterLang);
}