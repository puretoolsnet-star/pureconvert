import type { Lang } from "@/i18n/locales";
import { SEO_UI } from "@/i18n/seo/labels";
import { TOOL_PAGE_SLICES } from "@/i18n/seo/page-content-tools";
import { SHARED_FAQ, SHARED_LEAD, SHARED_POINTS } from "@/i18n/seo/shared-faq";
import type { CategoryId, ToolRouteId } from "@/lib/tools/routes";
import { CATEGORIES } from "@/lib/tools/routes";

export type SeoContentPageId = "home" | CategoryId | ToolRouteId;

export type PageSeoFaqItem = {
  question: string;
  answer: string;
};

export type PageSeoContent = {
  useCasesTitle: string;
  useCases: string[];
  benefitsTitle: string;
  benefitsLead: string;
  benefitPoints: string[];
  faqTitle: string;
  faqs: PageSeoFaqItem[];
};

function bundle(
  lang: Lang,
  useCases: string[],
  extraFaqs: PageSeoFaqItem[],
  benefitsLead?: string,
  benefitPoints?: string[],
): PageSeoContent {
  const ui = SEO_UI[lang];
  return {
    useCasesTitle: ui.useCases,
    useCases,
    benefitsTitle: ui.benefits,
    benefitsLead: benefitsLead ?? SHARED_LEAD[lang],
    benefitPoints: benefitPoints ?? SHARED_POINTS[lang],
    faqTitle: ui.faq,
    faqs: [...extraFaqs, ...SHARED_FAQ[lang]],
  };
}

const homeUseCases: Record<Lang, string[]> = {
  en: [
    "Pick a category and open a converter in one click — length, physics, digital, or quick math.",
    "Switch language for the same URL pattern across six locales on convert.kixt.net.",
    "Use on mobile without installing an app — PWA-friendly dark UI.",
  ],
  uk: [
    "Оберіть категорію та конвертер одним кліком — виміри, фізика, цифра або математика.",
    "Перемикайте мову — ті самі шаблони URL для шести локалей на convert.kixt.net.",
    "Працює на телефоні без встановлення застосунку — темний інтерфейс kixt.net.",
  ],
  de: [
    "Kategorie wählen und Konverter öffnen — Maße, Physik, Digital oder Rechner.",
    "Sprache wechseln — gleiche URL-Struktur in sechs Sprachen.",
    "Mobil nutzbar ohne App-Installation.",
  ],
  es: [
    "Elige categoría y convertidor — medidas, física, digital o cálculos.",
    "Cambia de idioma con el mismo patrón de URL en seis locales.",
    "Uso móvil sin instalar aplicación.",
  ],
  pl: [
    "Wybierz kategorię i konwerter — miary, fizyka, cyfrowe lub kalkulatory.",
    "Zmiana języka — ten sam wzorzec URL w sześciu wersjach.",
    "Na telefonie bez instalacji aplikacji.",
  ],
  fr: [
    "Choisissez une catégorie — mesures, physique, numérique ou calculs.",
    "Changez de langue — même schéma d’URL en six locales.",
    "Sur mobile sans installation d’application.",
  ],
};

const homeExtraFaq: Record<Lang, PageSeoFaqItem[]> = {
  en: [
    {
      question: "Is PureAudio available here?",
      answer: "No. Only active kixt.net tools are linked — PureAudio is not part of this navigation.",
    },
  ],
  uk: [
    {
      question: "Чи є тут PureAudio?",
      answer: "Ні. У навігації лише активні інструменти kixt.net — PureAudio не підключено.",
    },
  ],
  de: [
    {
      question: "Gibt es PureAudio?",
      answer: "Nein — nur aktive kixt.net-Projekte sind verlinkt.",
    },
  ],
  es: [
    {
      question: "¿Hay PureAudio?",
      answer: "No — solo herramientas activas de kixt.net.",
    },
  ],
  pl: [
    {
      question: "Czy jest PureAudio?",
      answer: "Nie — tylko aktywne narzędzia kixt.net.",
    },
  ],
  fr: [
    {
      question: "Y a-t-il PureAudio ?",
      answer: "Non — seuls les outils actifs kixt.net sont listés.",
    },
  ],
};

const categorySlices: Record<CategoryId, Record<Lang, { useCases: string[]; extraFaqs: PageSeoFaqItem[] }>> = {
  measurements: {
    en: {
      useCases: ["DIY and construction: mm, cm, ft, in on one screen.", "Land registry: ha, acre, and are together.", "Kitchen: liters, cups, and gallons for recipes."],
      extraFaqs: [
        { question: "Imperial and metric mixed?", answer: "Yes — every sub-tool shows both families in the live grid." },
      ],
    },
    uk: {
      useCases: ["Будівництво: мм, см, фути, дюйми.", "Земля: га, акр, сотка.", "Кухня: літри, чашки, галони."],
      extraFaqs: [{ question: "Метричні та імперські разом?", answer: "Так — у сітці одночасно." }],
    },
    de: {
      useCases: ["Bau: mm, cm, ft, in.", "Fläche: ha, acre.", "Küche: Liter, cups."],
      extraFaqs: [{ question: "Metrisch + imperial?", answer: "Ja, im Raster." }],
    },
    es: {
      useCases: ["Obra: mm, cm, ft, in.", "Terreno: ha, acre.", "Cocina: litros, tazas."],
      extraFaqs: [{ question: "¿Métrico e imperial?", answer: "Sí, en la cuadrícula." }],
    },
    pl: {
      useCases: ["Budowa: mm, cm, stopy.", "Działka: ha, akr.", "Kuchnia: litry, filiżanki."],
      extraFaqs: [{ question: "Metryczne i imperialne?", answer: "Tak." }],
    },
    fr: {
      useCases: ["Bricolage: mm, cm, pieds.", "Terrain: ha, acre.", "Cuisine: litres, cups."],
      extraFaqs: [{ question: "Métrique et impérial ?", answer: "Oui." }],
    },
  },
  physics: {
    en: {
      useCases: ["Shipping labels: kg vs lb.", "Weather and HVAC: °C/°F.", "Road trip: km/h, mph, and ETA."],
      extraFaqs: [{ question: "Pressure vs energy?", answer: "They live on separate tabs — never converted into each other." }],
    },
    uk: {
      useCases: ["Пошта: кг ↔ lb.", "Погода: °C/°F.", "Подорож: км/год, ETA."],
      extraFaqs: [{ question: "Тиск і енергія?", answer: "Окремі вкладки без змішування." }],
    },
    de: {
      useCases: ["Versand kg↔lb", "Wetter °C/°F", "Fahrt km/h"],
      extraFaqs: [{ question: "Druck vs Energie?", answer: "Getrennte Tabs." }],
    },
    es: {
      useCases: ["Envíos kg↔lb", "Clima °C/°F", "Viaje km/h"],
      extraFaqs: [{ question: "¿Presión vs energía?", answer: "Pestañas separadas." }],
    },
    pl: {
      useCases: ["Przesyłki kg↔lb", "Pogoda °C/°F", "Trasa km/h"],
      extraFaqs: [{ question: "Ciśnienie vs energia?", answer: "Osobne zakładki." }],
    },
    fr: {
      useCases: ["Colis kg↔lb", "Météo °C/°F", "Route km/h"],
      extraFaqs: [{ question: "Pression vs énergie ?", answer: "Onglets séparés." }],
    },
  },
  digital: {
    en: {
      useCases: ["Explain backup size TB vs GB.", "Check if 100 Mbps fits a 4 GB upload.", "Lock 16∶9 when resizing banners."],
      extraFaqs: [{ question: "Storage vs bitrate?", answer: "Different tools — binary 1024 vs decimal bit rates." }],
    },
    uk: {
      useCases: ["Резервна копія ТБ vs ГБ.", "Чи вистачить 100 Мбіт/с для 4 ГБ.", "Фіксоване 16∶9 для банерів."],
      extraFaqs: [{ question: "Обсяг vs бітрейт?", answer: "Різні інструменти — 1024 vs десяткові біти." }],
    },
    de: {
      useCases: ["Backup TB↔GB", "100 Mbps für 4 GB", "16:9 Banner"],
      extraFaqs: [{ question: "Speicher vs Bitrate?", answer: "Getrennte Tools." }],
    },
    es: {
      useCases: ["Copia TB↔GB", "100 Mbps y 4 GB", "Banner 16:9"],
      extraFaqs: [{ question: "¿Almacenamiento vs bitrate?", answer: "Herramientas distintas." }],
    },
    pl: {
      useCases: ["Kopia TB↔GB", "100 Mbps i 4 GB", "Baner 16:9"],
      extraFaqs: [{ question: "Pamięć vs bitrate?", answer: "Osobne narzędzia." }],
    },
    fr: {
      useCases: ["Sauvegarde To↔Go", "100 Mbit/s pour 4 Go", "Bannière 16:9"],
      extraFaqs: [{ question: "Stockage vs débit ?", answer: "Outils séparés." }],
    },
  },
  calculators: {
    en: {
      useCases: ["Sale tags: −20% without a spreadsheet.", "Grade stats: what % is 42 of 50.", "Ingredient scaling with proportions."],
      extraFaqs: [{ question: "No unit tables here?", answer: "Correct — pure number modes, separate from measurement converters." }],
    },
    uk: {
      useCases: ["Цінник −20% без таблиць.", "Оцінка: який % це 42 з 50.", "Масштаб інгредієнтів через пропорції."],
      extraFaqs: [{ question: "Без одиниць виміру?", answer: "Так — лише числа, окремо від конвертерів." }],
    },
    de: {
      useCases: ["−20% im Laden", "Anteil %", "Proportionen"],
      extraFaqs: [{ question: "Ohne Einheiten?", answer: "Ja — reine Zahlen." }],
    },
    es: {
      useCases: ["−20% en tienda", "Cuota %", "Proporciones"],
      extraFaqs: [{ question: "¿Sin unidades?", answer: "Sí — solo números." }],
    },
    pl: {
      useCases: ["−20% w sklepie", "Udział %", "Proporcje"],
      extraFaqs: [{ question: "Bez jednostek?", answer: "Tak — same liczby." }],
    },
    fr: {
      useCases: ["−20% en magasin", "Part %", "Proportions"],
      extraFaqs: [{ question: "Sans unités ?", answer: "Oui — nombres purs." }],
    },
  },
};

export function getPageSeoContent(pageId: SeoContentPageId, lang: Lang): PageSeoContent {
  if (pageId === "home") {
    return bundle(lang, homeUseCases[lang], homeExtraFaq[lang]);
  }
  if ((CATEGORIES as readonly string[]).includes(pageId)) {
    const cat = categorySlices[pageId as CategoryId][lang];
    return bundle(lang, cat.useCases, cat.extraFaqs);
  }
  const tool = TOOL_PAGE_SLICES[pageId as ToolRouteId][lang];
  return bundle(lang, tool.useCases, tool.extraFaqs);
}