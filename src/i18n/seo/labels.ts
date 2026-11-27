import type { Lang } from "@/i18n/locales";

export const SEO_UI: Record<
  Lang,
  {
    relatedTitle: string;
    relatedNavAria: string;
    useCases: string;
    benefits: string;
    faq: string;
  }
> = {
  en: {
    relatedTitle: "More converters in this category",
    relatedNavAria: "Related converters",
    useCases: "Common uses",
    benefits: "Why convert locally in your browser",
    faq: "Frequently asked questions",
  },
  uk: {
    relatedTitle: "Інші конвертери в цій категорії",
    relatedNavAria: "Пов’язані конвертери",
    useCases: "Типові сценарії",
    benefits: "Чому конвертувати локально у браузері",
    faq: "Часті питання",
  },
  de: {
    relatedTitle: "Weitere Konverter in dieser Kategorie",
    relatedNavAria: "Verwandte Konverter",
    useCases: "Typische Anwendungen",
    benefits: "Warum lokal im Browser umrechnen",
    faq: "Häufige Fragen",
  },
  es: {
    relatedTitle: "Más convertidores en esta categoría",
    relatedNavAria: "Convertidores relacionados",
    useCases: "Usos habituales",
    benefits: "Por qué convertir localmente en el navegador",
    faq: "Preguntas frecuentes",
  },
  pl: {
    relatedTitle: "Więcej konwerterów w tej kategorii",
    relatedNavAria: "Powiązane konwertery",
    useCases: "Typowe zastosowania",
    benefits: "Dlaczego konwertować lokalnie w przeglądarce",
    faq: "Częste pytania",
  },
  fr: {
    relatedTitle: "Autres convertisseurs dans cette catégorie",
    relatedNavAria: "Convertisseurs associés",
    useCases: "Cas d’usage courants",
    benefits: "Pourquoi convertir localement dans le navigateur",
    faq: "Questions fréquentes",
  },
};