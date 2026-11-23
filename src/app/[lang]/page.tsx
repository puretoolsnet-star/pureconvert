import type { Metadata } from "next";

import { HomePage } from "@/components/home/HomePage";
import { SeoJsonLd } from "@/components/seo/SeoJsonLd";
import { dictionaries, isLang, type Lang } from "@/i18n/locales";
import { homeWebPageJsonLd, webPageJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata, trimMetaDescription } from "@/lib/seo/metadata";

type PageProps = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang = isLang(raw) ? raw : "en";
  return buildPageMetadata(lang);
}

export default async function Page({ params }: PageProps) {
  const { lang: raw } = await params;
  if (!isLang(raw)) return null;
  const lang = raw as Lang;
  const t = dictionaries[lang];
  const description = trimMetaDescription(`${t.home.heroIntro} ${t.brand.tagline}`);
  return (
    <>
      <SeoJsonLd data={homeWebPageJsonLd(lang)} />
      <SeoJsonLd
        data={webPageJsonLd(lang, "", t.home.heroTitle, description)}
      />
      <HomePage />
    </>
  );
}