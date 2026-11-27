"use client";

import { useI18n } from "@/i18n/context";
import { getPageSeoContent, type SeoContentPageId } from "@/i18n/seo/page-content";

export function usePageSeoContent(pageId: SeoContentPageId) {
  const { lang } = useI18n();
  return getPageSeoContent(pageId, lang);
}