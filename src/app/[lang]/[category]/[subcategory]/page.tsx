import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ConverterShell } from "@/components/convert/ConverterShell";
import { SeoJsonLd } from "@/components/seo/SeoJsonLd";
import { isLang, LANGS } from "@/i18n/locales";
import { buildToolMetadata } from "@/lib/seo/metadata";
import { buildPageStructuredData } from "@/lib/seo/structured-data";
import { CATEGORIES, routeFromSegments, type ToolRouteId } from "@/lib/tools/routes";

type PageProps = { params: Promise<{ lang: string; category: string; subcategory: string }> };

export function generateStaticParams() {
  return CATEGORIES.flatMap((category) =>
    LANGS.flatMap((lang) => {
      const subs =
        category === "measurements"
          ? ["length", "area", "volume"]
          : category === "physics"
            ? ["weight", "temperature", "speed", "pressure-energy"]
            : category === "digital"
              ? ["data-storage", "data-transfer", "ratios-aspect"]
              : ["percentages", "discounts", "proportions"];
      return subs.map((subcategory) => ({ lang, category, subcategory }));
    }),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang: raw, category, subcategory } = await params;
  const lang = isLang(raw) ? raw : "en";
  const route = routeFromSegments(category, subcategory);
  if (!route) return {};
  return buildToolMetadata(route as ToolRouteId, lang);
}

export default async function SubcategoryPage({ params }: PageProps) {
  const { lang: raw, category, subcategory } = await params;
  const routeId = routeFromSegments(category, subcategory);
  if (!isLang(raw) || !routeId) notFound();
  const lang = raw;
  const categoryId = category as (typeof CATEGORIES)[number];
  return (
    <>
      <SeoJsonLd data={buildPageStructuredData(routeId as ToolRouteId, lang)} />
      <ConverterShell routeId={routeId as ToolRouteId} categoryId={categoryId} />
    </>
  );
}