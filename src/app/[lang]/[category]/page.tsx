import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CategoryHub } from "@/components/hub/CategoryHub";
import { SeoJsonLd } from "@/components/seo/SeoJsonLd";
import { isLang, LANGS } from "@/i18n/locales";
import { buildCategoryMetadata } from "@/lib/seo/metadata";
import { buildPageStructuredData } from "@/lib/seo/structured-data";
import { CATEGORIES, type CategoryId } from "@/lib/tools/routes";

type PageProps = { params: Promise<{ lang: string; category: string }> };

export function generateStaticParams() {
  return CATEGORIES.flatMap((category) => LANGS.map((lang) => ({ lang, category })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang: raw, category } = await params;
  const lang = isLang(raw) ? raw : "en";
  if (!(CATEGORIES as readonly string[]).includes(category)) return {};
  return buildCategoryMetadata(category as CategoryId, lang);
}

export default async function CategoryPage({ params }: PageProps) {
  const { lang: raw, category } = await params;
  if (!isLang(raw) || !(CATEGORIES as readonly string[]).includes(category)) notFound();
  const lang = raw;
  const categoryId = category as CategoryId;
  return (
    <>
      <SeoJsonLd data={buildPageStructuredData(categoryId, lang)} />
      <CategoryHub categoryId={categoryId} />
    </>
  );
}