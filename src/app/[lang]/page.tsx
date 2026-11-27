import type { Metadata } from "next";

import { HomePage } from "@/components/home/HomePage";
import { SeoJsonLd } from "@/components/seo/SeoJsonLd";
import { isLang, type Lang } from "@/i18n/locales";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildPageStructuredData } from "@/lib/seo/structured-data";

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
  return (
    <>
      <SeoJsonLd data={buildPageStructuredData("home", lang)} />
      <HomePage />
    </>
  );
}