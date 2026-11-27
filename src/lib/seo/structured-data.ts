import { dictionaries, DEFAULT_LANG, LANGS, type Lang } from "@/i18n/locales";
import { getSeoCopy, type SeoPageId } from "@/i18n/seo/copy";
import { getPageSeoContent } from "@/i18n/seo/page-content";
import { seoPathAfterLang } from "@/lib/seo/paths";
import { absoluteUrl } from "@/lib/seo/site-url";
import { CATEGORIES, SUBCATEGORIES_BY_CATEGORY, type CategoryId, type ToolRouteId } from "@/lib/tools/routes";

function ecosystemRelatedUrls(): string[] {
  const origins = [
    process.env.NEXT_PUBLIC_ECOSYSTEM_PUREPDF_URL?.trim() || "https://pdf.kixt.net",
    process.env.NEXT_PUBLIC_ECOSYSTEM_PUREQR_URL?.trim() || "https://qr.kixt.net",
    process.env.NEXT_PUBLIC_ECOSYSTEM_PURETABLE_URL?.trim() || "https://table.kixt.net",
    process.env.NEXT_PUBLIC_ECOSYSTEM_PURESIGN_URL?.trim() || "https://sign.kixt.net",
    process.env.NEXT_PUBLIC_ECOSYSTEM_PUREIMAGE_URL?.trim() || "https://img.kixt.net",
    process.env.NEXT_PUBLIC_ECOSYSTEM_PURETEXT_URL?.trim() || "https://text.kixt.net",
  ];
  return origins.map((origin) => `${origin.replace(/\/$/, "")}/${DEFAULT_LANG}`);
}

function pageUrl(lang: Lang, pathAfterLang: string): string {
  const suffix = pathAfterLang.startsWith("/") || pathAfterLang === "" ? pathAfterLang : `/${pathAfterLang}`;
  return absoluteUrl(`/${lang}${suffix}`);
}

function softwareApp(name: string, description: string, url: string, lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    url,
    description,
    inLanguage: lang,
    isAccessibleForFree: true,
    provider: {
      "@type": "Organization",
      name: dictionaries[lang].brand.name,
      url: pageUrl(lang, ""),
    },
  };
}

export function buildFaqPageStructuredData(pageId: SeoPageId, lang: Lang) {
  const content = getPageSeoContent(pageId, lang);
  const pathAfterLang = seoPathAfterLang(pageId);
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
    url: pageUrl(lang, pathAfterLang),
    inLanguage: lang,
  };
}

export function buildHomeStructuredData(lang: Lang) {
  const copy = getSeoCopy("home", lang);
  const url = pageUrl(lang, "");
  const dict = dictionaries[lang];

  const itemListElement = CATEGORIES.flatMap((categoryId, catIndex) => {
    const subs = SUBCATEGORIES_BY_CATEGORY[categoryId];
    return subs.map((sub, subIndex) => {
      const routeId = `${categoryId}/${sub}` as ToolRouteId;
      const position =
        CATEGORIES.slice(0, catIndex).reduce((acc, c) => acc + SUBCATEGORIES_BY_CATEGORY[c].length, 0) +
        subIndex +
        1;
      return {
        "@type": "ListItem",
        position,
        name: dict.subcategories[routeId].title,
        url: pageUrl(lang, `/${categoryId}/${sub}`),
      };
    });
  });

  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: dict.brand.name,
      description: copy.description,
      url,
      inLanguage: lang,
      publisher: { "@type": "Organization", name: "kixt.net", url: "https://kixt.net" },
      sameAs: ecosystemRelatedUrls(),
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: dict.home.categoriesHeading,
      itemListElement,
    },
    softwareApp(dict.brand.name, copy.description, url, lang),
    buildFaqPageStructuredData("home", lang),
  ];
}

export function buildCategoryStructuredData(categoryId: CategoryId, lang: Lang) {
  const copy = getSeoCopy(categoryId, lang);
  const pathAfterLang = seoPathAfterLang(categoryId);
  const url = pageUrl(lang, pathAfterLang);
  const dict = dictionaries[lang];
  const subs = SUBCATEGORIES_BY_CATEGORY[categoryId];

  return [
    softwareApp(dict.categories[categoryId].hubTitle, copy.description, url, lang),
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: dict.brand.name, item: pageUrl(lang, "") },
        { "@type": "ListItem", position: 2, name: dict.categories[categoryId].hubTitle, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: dict.categories[categoryId].hubTitle,
      itemListElement: subs.map((sub, index) => {
        const routeId = `${categoryId}/${sub}` as ToolRouteId;
        return {
          "@type": "ListItem",
          position: index + 1,
          name: dict.subcategories[routeId].title,
          url: pageUrl(lang, `/${categoryId}/${sub}`),
        };
      }),
    },
    buildFaqPageStructuredData(categoryId, lang),
  ];
}

export function buildToolStructuredData(routeId: ToolRouteId, lang: Lang) {
  const copy = getSeoCopy(routeId, lang);
  const pathAfterLang = seoPathAfterLang(routeId);
  const url = pageUrl(lang, pathAfterLang);
  const dict = dictionaries[lang];
  const [categoryId, sub] = routeId.split("/") as [CategoryId, string];

  return [
    softwareApp(dict.subcategories[routeId].title, copy.description, url, lang),
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: dict.brand.name, item: pageUrl(lang, "") },
        {
          "@type": "ListItem",
          position: 2,
          name: dict.categories[categoryId].hubTitle,
          item: pageUrl(lang, `/${categoryId}`),
        },
        { "@type": "ListItem", position: 3, name: dict.subcategories[routeId].title, item: url },
      ],
    },
    buildFaqPageStructuredData(routeId, lang),
  ];
}

export function buildPageStructuredData(pageId: SeoPageId, lang: Lang) {
  if (pageId === "home") return buildHomeStructuredData(lang);
  if ((CATEGORIES as readonly string[]).includes(pageId)) {
    return buildCategoryStructuredData(pageId as CategoryId, lang);
  }
  return buildToolStructuredData(pageId as ToolRouteId, lang);
}

void LANGS;