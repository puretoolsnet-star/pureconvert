import type { Lang } from "@/i18n/locales";
import type { PageSeoFaqItem } from "@/i18n/seo/page-content";

export const SHARED_LEAD: Record<Lang, string> = {
  en: "PureConvert on convert.kixt.net runs entirely in your browser. Numbers never leave your device — there is no server upload, database, or sign-in.",
  uk: "PureConvert на convert.kixt.net працює повністю у вашому браузері. Значення не надсилаються на сервер — без завантажень, бази даних і реєстрації.",
  de: "PureConvert auf convert.kixt.net läuft vollständig im Browser. Werte werden nicht an einen Server gesendet — kein Upload, keine Datenbank, kein Konto.",
  es: "PureConvert en convert.kixt.net funciona solo en tu navegador. Los datos no se envían a ningún servidor — sin subidas, cuentas ni bases de datos.",
  pl: "PureConvert na convert.kixt.net działa w całości w przeglądarce. Liczby nie trafiają na serwer — bez wysyłania plików, konta i bazy danych.",
  fr: "PureConvert sur convert.kixt.net s’exécute entièrement dans le navigateur. Aucune donnée n’est envoyée au serveur — pas de compte ni de base de données.",
};

export const SHARED_POINTS: Record<Lang, string[]> = {
  en: [
    "Instant recalculation across a full unit grid as you type.",
    "One-click copy for results — handy for homework, travel, or shopping lists.",
    "Six locales (en, uk, de, es, pl, fr) with matching canonical and hreflang URLs.",
    "Part of the privacy-first kixt.net toolbox alongside PurePDF, PureQR, and more.",
  ],
  uk: [
    "Миттєвий перерахунок у сітці одиниць під час введення.",
    "Копіювання результатів одним дотиком — для навчання, подорожей чи списків покупок.",
    "Шість мов (en, uk, de, es, pl, fr) із коректними canonical і hreflang.",
    "Частина екосистеми kixt.net разом із PurePDF, PureQR та іншими інструментами.",
  ],
  de: [
    "Sofortige Neuberechnung in der Einheitenliste beim Tippen.",
    "Ergebnisse mit einem Klick kopieren.",
    "Sechs Sprachen mit passenden canonical- und hreflang-URLs.",
    "Teil des datenschutzorientierten kixt.net-Ökosystems.",
  ],
  es: [
    "Recálculo instantáneo en la cuadrícula de unidades.",
    "Copiar resultados con un clic.",
    "Seis idiomas con URLs canonical y hreflang.",
    "Parte del ecosistema kixt.net junto a PurePDF, PureQR y más.",
  ],
  pl: [
    "Natychmiastowy przelicz w siatce jednostek podczas pisania.",
    "Kopiowanie wyników jednym kliknięciem.",
    "Sześć języków z poprawnymi adresami canonical i hreflang.",
    "Część ekosystemu kixt.net obok PurePDF, PureQR i innych.",
  ],
  fr: [
    "Recalcul instantané dans la grille d’unités pendant la saisie.",
    "Copie des résultats en un clic.",
    "Six langues avec URL canonical et hreflang.",
    "Fait partie de l’écosystème kixt.net avec PurePDF, PureQR, etc.",
  ],
};

export const SHARED_FAQ: Record<Lang, PageSeoFaqItem[]> = {
  en: [
    {
      question: "Is PureConvert free?",
      answer: "Yes. Core converters are free to use in the browser. Ads may appear in reserved slots to support hosting.",
    },
    {
      question: "Do you store my conversions?",
      answer: "No. Everything runs client-side in JavaScript; we do not receive your numbers.",
    },
    {
      question: "Which languages are available?",
      answer: "English, Ukrainian, German, Spanish, Polish, and French — switch anytime from the header menu.",
    },
  ],
  uk: [
    {
      question: "Чи безкоштовний PureConvert?",
      answer: "Так. Основні конвертери безкоштовні; реклама може з’являтися в виділених блоках для підтримки хостингу.",
    },
    {
      question: "Чи зберігаєте ви мої обчислення?",
      answer: "Ні. Усе виконується у JavaScript на вашому пристрої; ми не отримуємо ваші числа.",
    },
    {
      question: "Які мови доступні?",
      answer: "Англійська, українська, німецька, іспанська, польська та французька — перемикач у шапці сайту.",
    },
  ],
  de: [
    {
      question: "Ist PureConvert kostenlos?",
      answer: "Ja. Kernfunktionen sind gratis; Anzeigen können in reservierten Bereichen erscheinen.",
    },
    {
      question: "Speichern Sie meine Eingaben?",
      answer: "Nein. Die Verarbeitung erfolgt nur lokal im Browser.",
    },
    {
      question: "Welche Sprachen gibt es?",
      answer: "Englisch, Ukrainisch, Deutsch, Spanisch, Polnisch und Französisch.",
    },
  ],
  es: [
    {
      question: "¿PureConvert es gratis?",
      answer: "Sí. Los convertidores principales son gratuitos; puede haber anuncios en ranuras reservadas.",
    },
    {
      question: "¿Guardan mis conversiones?",
      answer: "No. Todo se ejecuta localmente en el navegador.",
    },
    {
      question: "¿Qué idiomas hay?",
      answer: "Inglés, ucraniano, alemán, español, polaco y francés.",
    },
  ],
  pl: [
    {
      question: "Czy PureConvert jest darmowy?",
      answer: "Tak. Podstawowe konwertery są bezpłatne; reklamy mogą pojawiać się w wyznaczonych miejscach.",
    },
    {
      question: "Czy przechowujecie moje obliczenia?",
      answer: "Nie. Wszystko działa lokalnie w przeglądarce.",
    },
    {
      question: "Jakie języki są dostępne?",
      answer: "Angielski, ukraiński, niemiecki, hiszpański, polski i francuski.",
    },
  ],
  fr: [
    {
      question: "PureConvert est-il gratuit ?",
      answer: "Oui. Les convertisseurs de base sont gratuits ; des annonces peuvent apparaître dans des emplacements réservés.",
    },
    {
      question: "Stockez-vous mes conversions ?",
      answer: "Non. Tout s’exécute localement dans le navigateur.",
    },
    {
      question: "Quelles langues ?",
      answer: "Anglais, ukrainien, allemand, espagnol, polonais et français.",
    },
  ],
};