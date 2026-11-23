import type { MetadataRoute } from "next";

import { LANGS } from "@/i18n/locales";
import { hreflangAlternates, SITE_URL } from "@/lib/seo/site-url";
import { CATEGORIES, SUBCATEGORIES_BY_CATEGORY } from "@/lib/tools/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const now = new Date();

  const push = (pathAfterLang: string, changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"], priority: number) => {
    for (const lang of LANGS) {
      entries.push({
        url: `${SITE_URL}/${lang}${pathAfterLang}`,
        lastModified: now,
        changeFrequency,
        priority,
        alternates: {
          languages: hreflangAlternates(pathAfterLang),
        },
      });
    }
  };

  push("", "weekly", 1);

  for (const category of CATEGORIES) {
    push(`/${category}`, "weekly", 0.85);
    for (const sub of SUBCATEGORIES_BY_CATEGORY[category]) {
      push(`/${category}/${sub}`, "monthly", 0.75);
    }
  }

  return entries;
}