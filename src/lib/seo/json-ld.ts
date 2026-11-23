import { dictionaries, type Lang } from "@/i18n/locales";
import { absoluteUrl } from "@/lib/seo/site-url";

export function homeWebPageJsonLd(lang: Lang) {
  const t = dictionaries[lang];
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: t.brand.name,
    description: t.brand.tagline,
    url: absoluteUrl(`/${lang}`),
    inLanguage: lang,
    publisher: { "@type": "Organization", name: "kixt.net", url: "https://kixt.net" },
  };
}

export function webPageJsonLd(lang: Lang, pathAfterLang: string, name: string, description: string) {
  const suffix = pathAfterLang.startsWith("/") || pathAfterLang === "" ? pathAfterLang : `/${pathAfterLang}`;
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: absoluteUrl(`/${lang}${suffix}`),
    inLanguage: lang,
    isPartOf: {
      "@type": "WebSite",
      name: dictionaries[lang].brand.name,
      url: absoluteUrl(`/${lang}`),
    },
  };
}