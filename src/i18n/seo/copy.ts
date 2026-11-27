import type { Lang } from "@/i18n/locales";
import type { CategoryId, ToolRouteId } from "@/lib/tools/routes";
import { CATEGORIES, TOOL_ROUTE_IDS } from "@/lib/tools/routes";

export type SeoPageId = "home" | CategoryId | ToolRouteId;

export type SeoCopy = {
  title: string;
  description: string;
  keywords: string[];
};

const home: Record<Lang, SeoCopy> = {
  en: {
    title: "PureConvert — free online unit converter (length, mass, data, %)",
    description:
      "Convert length, area, volume, mass, temperature, speed, data sizes, and percentages in your browser on convert.kixt.net — no upload, no account, six languages.",
    keywords: ["unit converter", "online converter", "length converter", "PureConvert", "kixt.net"],
  },
  uk: {
    title: "PureConvert — безкоштовний онлайн-конвертер одиниць (довжина, маса, дані, %)",
    description:
      "Конвертація довжини, площі, об’єму, маси, температури, швидкості, обсягу даних і відсотків у браузері на convert.kixt.net — без завантажень і без облікового запису, 6 мов.",
    keywords: ["конвертер одиниць", "онлайн конвертер", "довжина км милі", "PureConvert", "kixt.net"],
  },
  de: {
    title: "PureConvert — kostenloser Online-Einheitenumrechner (Länge, Masse, Daten, %)",
    description:
      "Länge, Fläche, Volumen, Masse, Temperatur, Geschwindigkeit, Datenspeicher und Prozentrechner im Browser auf convert.kixt.net — ohne Upload, 6 Sprachen.",
    keywords: ["Einheitenumrechner", "Online Umrechner", "Längenumrechner", "PureConvert", "kixt.net"],
  },
  es: {
    title: "PureConvert — convertidor de unidades online gratis (longitud, masa, datos, %)",
    description:
      "Convierte longitud, área, volumen, masa, temperatura, velocidad, almacenamiento y porcentajes en el navegador en convert.kixt.net — sin subir archivos, 6 idiomas.",
    keywords: ["convertidor de unidades", "conversor online", "longitud km millas", "PureConvert", "kixt.net"],
  },
  pl: {
    title: "PureConvert — darmowy konwerter jednostek online (długość, masa, dane, %)",
    description:
      "Długość, pole, objętość, masa, temperatura, prędkość, rozmiary plików i procenty w przeglądarce na convert.kixt.net — bez wysyłania na serwer, 6 języków.",
    keywords: ["konwerter jednostek", "przelicznik online", "długość km mile", "PureConvert", "kixt.net"],
  },
  fr: {
    title: "PureConvert — convertisseur d’unités en ligne gratuit (longueur, masse, données, %)",
    description:
      "Longueur, surface, volume, masse, température, vitesse, stockage et pourcentages dans le navigateur sur convert.kixt.net — sans envoi serveur, 6 langues.",
    keywords: ["convertisseur d’unités", "conversion en ligne", "longueur km miles", "PureConvert", "kixt.net"],
  },
};

const categories: Record<CategoryId, Record<Lang, SeoCopy>> = {
  measurements: {
    en: {
      title: "Measurement converters — length, area & volume | PureConvert",
      description:
        "Metric and imperial length, land area (m², ha, acre), and kitchen volume units — live grids and math, 100% in your browser on convert.kixt.net.",
      keywords: ["length converter", "area converter", "volume converter", "metric imperial", "PureConvert"],
    },
    uk: {
      title: "Конвертери вимірів — довжина, площа та об’єм | PureConvert",
      description:
        "Метричні та імперські одиниці довжини, площі землі (м², га, акр) і кухонний об’єм — сітка одиниць і обчислення локально на convert.kixt.net.",
      keywords: ["конвертер довжини", "площа га", "об’єм літри галони", "PureConvert"],
    },
    de: {
      title: "Maß-Konverter — Länge, Fläche & Volumen | PureConvert",
      description:
        "Metrisch und imperial: Länge, Fläche (ha, Morgen) und Volumen — live im Browser auf convert.kixt.net, ohne Server.",
      keywords: ["Längenumrechner", "Flächenrechner", "Volumenumrechner", "PureConvert"],
    },
    es: {
      title: "Convertidores de medidas — longitud, área y volumen | PureConvert",
      description:
        "Unidades métricas e imperiales de longitud, área agrícola y cocina — todo en el navegador en convert.kixt.net.",
      keywords: ["convertidor longitud", "área hectáreas", "volumen litros", "PureConvert"],
    },
    pl: {
      title: "Konwertery miar — długość, pole i objętość | PureConvert",
      description:
        "Jednostki metryczne i imperialne długości, pola i objętości — lokalnie w przeglądarce na convert.kixt.net.",
      keywords: ["konwerter długości", "pole ha", "objętość litry", "PureConvert"],
    },
    fr: {
      title: "Convertisseurs de mesures — longueur, surface & volume | PureConvert",
      description:
        "Unités métriques et impériales pour longueur, surface et volume — dans le navigateur sur convert.kixt.net.",
      keywords: ["convertisseur longueur", "surface hectare", "volume litres", "PureConvert"],
    },
  },
  physics: {
    en: {
      title: "Physics converters — mass, temperature, speed, pressure & energy",
      description:
        "Convert kg/lb, °C/°F/K, km/h and mph, tire pressure, and kWh locally — separate tabs, presets, travel-time solver on convert.kixt.net.",
      keywords: ["mass converter", "temperature converter", "speed km/h mph", "pressure psi", "PureConvert"],
    },
    uk: {
      title: "Фізичні конвертери — маса, температура, швидкість, тиск і енергія",
      description:
        "Кг/фунти, °C/°F/K, км/год і mil/h, тиск у шинах, кВт·год — окремі вкладки та пресети локально на convert.kixt.net.",
      keywords: ["конвертер маси", "температура Цельсій", "швидкість", "тиск psi", "PureConvert"],
    },
    de: {
      title: "Physik-Konverter — Masse, Temperatur, Geschwindigkeit, Druck & Energie",
      description:
        "kg/lb, °C/°F/K, km/h, Reifendruck und kWh — getrennte Gruppen, Presets, lokal auf convert.kixt.net.",
      keywords: ["Masse umrechnen", "Temperatur", "Geschwindigkeit", "Druck bar psi", "PureConvert"],
    },
    es: {
      title: "Convertidores físicos — masa, temperatura, velocidad, presión y energía",
      description:
        "kg/lb, °C/°F/K, km/h, presión de neumáticos y kWh — pestañas separadas en el navegador en convert.kixt.net.",
      keywords: ["masa kg libras", "temperatura", "velocidad", "presión", "PureConvert"],
    },
    pl: {
      title: "Konwertery fizyczne — masa, temperatura, prędkość, ciśnienie i energia",
      description:
        "kg/funty, °C/°F/K, km/h, ciśnienie i kWh — lokalnie w przeglądarce na convert.kixt.net.",
      keywords: ["masa kg funty", "temperatura", "prędkość", "ciśnienie", "PureConvert"],
    },
    fr: {
      title: "Convertisseurs physique — masse, température, vitesse, pression & énergie",
      description:
        "kg/lb, °C/°F/K, km/h, pression pneus et kWh — onglets séparés dans le navigateur sur convert.kixt.net.",
      keywords: ["masse kg livres", "température", "vitesse", "pression", "PureConvert"],
    },
  },
  digital: {
    en: {
      title: "Digital converters — storage, bitrate & aspect ratio | PureConvert",
      description:
        "Binary storage steps (KB–PB), network bit rates, byte/s view, transfer-time estimates, and 16:9 ratio tools — client-side on convert.kixt.net.",
      keywords: ["data storage converter", "Mbps calculator", "aspect ratio", "PureConvert"],
    },
    uk: {
      title: "Цифрові конвертери — обсяг даних, швидкість мережі та пропорції",
      description:
        "Кроки 1024 (КБ–ПБ), бітрейт, байт/с, час передачі файлу та співвідношення сторін — локально на convert.kixt.net.",
      keywords: ["конвертер МБ ГБ", "Мбіт/с", "пропорції 16:9", "PureConvert"],
    },
    de: {
      title: "Digital-Konverter — Speicher, Bitrate & Seitenverhältnis | PureConvert",
      description:
        "1024-Speicherstufen, bps–Gbps, Byte/s und Auflösungsraster — lokal auf convert.kixt.net.",
      keywords: ["Datenspeicher MB GB", "Mbit/s", "Seitenverhältnis", "PureConvert"],
    },
    es: {
      title: "Convertidores digitales — almacenamiento, bitrate y proporción",
      description:
        "Pasos binarios de almacenamiento, tasas en bps, bytes/s y relación de aspecto — en el navegador en convert.kixt.net.",
      keywords: ["MB GB conversor", "Mbps", "relación de aspecto", "PureConvert"],
    },
    pl: {
      title: "Konwertery cyfrowe — pamięć, bitrate i proporcje | PureConvert",
      description:
        "Rozmiary plików 1024, bps–Gbps, bajt/s i siatka rozdzielczości — lokalnie na convert.kixt.net.",
      keywords: ["MB GB konwerter", "Mbps", "proporcje", "PureConvert"],
    },
    fr: {
      title: "Convertisseurs numériques — stockage, débit & ratio d’aspect",
      description:
        "Tailles binaires, débits réseau, octets/s et grille de résolution — localement sur convert.kixt.net.",
      keywords: ["Mo Go convertisseur", "Mbit/s", "ratio 16:9", "PureConvert"],
    },
  },
  calculators: {
    en: {
      title: "Quick math — percentages, discounts & proportions | PureConvert",
      description:
        "Three-tab percent modes, discount/markup/reverse price, and a/b = c/x proportion solver with steps — no spreadsheets, runs locally on convert.kixt.net.",
      keywords: ["percentage calculator", "discount calculator", "proportion solver", "PureConvert"],
    },
    uk: {
      title: "Швидкі калькулятори — відсотки, знижки та пропорції | PureConvert",
      description:
        "Режими відсотків, знижка/націнка/зворотна ціна та пропорція a/b = c/x з кроками — локально на convert.kixt.net.",
      keywords: ["калькулятор відсотків", "знижка", "пропорції", "PureConvert"],
    },
    de: {
      title: "Schnellrechner — Prozent, Rabatt & Proportionen | PureConvert",
      description:
        "Prozent-Modi, Rabatt/Marge und Proportion a/b = c/x mit Schritten — lokal auf convert.kixt.net.",
      keywords: ["Prozentrechner", "Rabatt", "Proportionen", "PureConvert"],
    },
    es: {
      title: "Calculadoras rápidas — porcentajes, descuentos y proporciones",
      description:
        "Modos de %, descuento/recargo y proporción a/b = c/x — en el navegador en convert.kixt.net.",
      keywords: ["calculadora porcentajes", "descuento", "proporciones", "PureConvert"],
    },
    pl: {
      title: "Szybkie kalkulatory — procenty, rabaty i proporcje | PureConvert",
      description:
        "Tryby procentów, rabat/narzut i proporcja a/b = c/x — lokalnie na convert.kixt.net.",
      keywords: ["kalkulator procentów", "rabat", "proporcje", "PureConvert"],
    },
    fr: {
      title: "Calculatrices rapides — pourcentages, remises & proportions",
      description:
        "Modes %, remise/majoration et proportion a/b = c/x — dans le navigateur sur convert.kixt.net.",
      keywords: ["calculateur pourcentage", "remise", "proportions", "PureConvert"],
    },
  },
};

const tools: Record<ToolRouteId, Record<Lang, SeoCopy>> = {
  "measurements/length": {
    en: {
      title: "Length converter — nm to nautical miles, metric & imperial",
      description:
        "Convert nanometers through nautical miles with a live unit grid, presets, swap, and sum/difference math — private, in-browser on convert.kixt.net.",
      keywords: ["length converter", "km to miles", "feet to meters", "nautical miles"],
    },
    uk: {
      title: "Конвертер довжини — від нанометрів до морських миль",
      description:
        "Метричні та імперські одиниці, сітка, пресети та арифметика довжини — локально у браузері на convert.kixt.net.",
      keywords: ["конвертер довжини", "км у милі", "фути метри", "морські милі"],
    },
    de: {
      title: "Längenumrechner — nm bis Seemeile, metrisch & imperial",
      description: "Einheitenraster, Presets und Längenrechnung — lokal auf convert.kixt.net.",
      keywords: ["Längenumrechner", "km in Meilen", "Fuß Meter"],
    },
    es: {
      title: "Convertidor de longitud — nm a millas náuticas",
      description: "Cuadrícula de unidades, presets y suma/resta — en convert.kixt.net.",
      keywords: ["convertidor longitud", "km millas", "pies metros"],
    },
    pl: {
      title: "Konwerter długości — od nm do mil morskich",
      description: "Siatka jednostek, presety i arytmetyka — lokalnie na convert.kixt.net.",
      keywords: ["konwerter długości", "km mile", "stopy metry"],
    },
    fr: {
      title: "Convertisseur de longueur — nm aux milles nautiques",
      description: "Grille d’unités, exemples et calculs — localement sur convert.kixt.net.",
      keywords: ["convertisseur longueur", "km miles", "pieds mètres"],
    },
  },
  "measurements/area": {
    en: {
      title: "Area converter — m², hectares, acres & rectangle calc",
      description:
        "Farm and floor-plan units with priority row, rectangle area helper, and area arithmetic — client-side on convert.kixt.net.",
      keywords: ["area converter", "hectare to acre", "square meters"],
    },
    uk: {
      title: "Конвертер площі — м², гектари, акри та прямокутник",
      description: "Одиниці землі та планів, калькулятор ділянки — локально на convert.kixt.net.",
      keywords: ["площа м2", "гектар акр", "конвертер площі"],
    },
    de: {
      title: "Flächenumrechner — m², Hektar, Acres & Rechteck",
      description: "Land- und Plan-Einheiten mit Rechteckrechner — lokal auf convert.kixt.net.",
      keywords: ["Flächenrechner", "Hektar Acre", "Quadratmeter"],
    },
    es: {
      title: "Convertidor de área — m², hectáreas, acres y rectángulo",
      description: "Unidades agrícolas y de planos — en convert.kixt.net.",
      keywords: ["área m2", "hectárea acre", "convertidor área"],
    },
    pl: {
      title: "Konwerter pola — m², hektary, akry i prostokąt",
      description: "Jednostki pola i kalkulator działki — lokalnie na convert.kixt.net.",
      keywords: ["pole m2", "hektar akr", "konwerter pola"],
    },
    fr: {
      title: "Convertisseur de surface — m², hectares, acres & rectangle",
      description: "Unités agricoles et plans — localement sur convert.kixt.net.",
      keywords: ["surface m2", "hectare acre", "convertisseur surface"],
    },
  },
  "measurements/volume": {
    en: {
      title: "Volume converter — liters, m³, US cups & recipe scaling",
      description:
        "Metric and US kitchen volume with ½×–3× recipe scaling and volume math — no upload on convert.kixt.net.",
      keywords: ["volume converter", "liters to gallons", "cups to ml"],
    },
    uk: {
      title: "Конвертер об’єму — літри, м³, US cups і масштаб рецепта",
      description: "Кухонні та метричні одиниці з масштабуванням рецепту — на convert.kixt.net.",
      keywords: ["об’єм літри", "галони", "чашки ml"],
    },
    de: {
      title: "Volumenumrechner — Liter, m³, US-Cups & Rezeptskalierung",
      description: "Küchen- und metrische Volumen — lokal auf convert.kixt.net.",
      keywords: ["Volumen Liter", "Gallonen", "Cups ml"],
    },
    es: {
      title: "Convertidor de volumen — litros, m³, tazas US y recetas",
      description: "Cocina métrica/US con escalado — en convert.kixt.net.",
      keywords: ["volumen litros", "galones", "tazas ml"],
    },
    pl: {
      title: "Konwerter objętości — litry, m³, filiżanki US i przepisy",
      description: "Jednostki kuchenne i metryczne — lokalnie na convert.kixt.net.",
      keywords: ["objętość litry", "galony", "szklanki ml"],
    },
    fr: {
      title: "Convertisseur de volume — litres, m³, cups US & recettes",
      description: "Cuisine métrique/US avec mise à l’échelle — sur convert.kixt.net.",
      keywords: ["volume litres", "gallons", "cups ml"],
    },
  },
  "physics/weight": {
    en: {
      title: "Weight / mass converter — mg to tonnes, oz, lb & stone",
      description:
        "Full mass grid, portion scaling, and sum/difference — groceries to freight, locally on convert.kixt.net.",
      keywords: ["weight converter", "kg to lb", "grams to ounces"],
    },
    uk: {
      title: "Конвертер маси — від мг до тонн, унції, фунти, stone",
      description: "Сітка одиниць, масштаб порцій і арифметика — локально на convert.kixt.net.",
      keywords: ["маса кг фунти", "грами унції", "конвертер ваги"],
    },
    de: {
      title: "Gewicht/Masse-Umrechner — mg bis Tonne, oz, lb & Stone",
      description: "Masse-Raster und Portions-Skalierung — lokal auf convert.kixt.net.",
      keywords: ["Masse kg lb", "Gramm Unzen"],
    },
    es: {
      title: "Convertidor de masa — mg a toneladas, oz, lb y stone",
      description: "Cuadrícula completa y escalado — en convert.kixt.net.",
      keywords: ["masa kg libras", "gramos onzas"],
    },
    pl: {
      title: "Konwerter masy — od mg do ton, oz, lb i stone",
      description: "Siatka jednostek i skalowanie porcji — lokalnie na convert.kixt.net.",
      keywords: ["masa kg funty", "gramy uncje"],
    },
    fr: {
      title: "Convertisseur de masse — mg à tonnes, oz, lb & stone",
      description: "Grille complète et portions — localement sur convert.kixt.net.",
      keywords: ["masse kg livres", "grammes onces"],
    },
  },
  "physics/temperature": {
    en: {
      title: "Temperature converter — °C, °F, Kelvin & ΔT math",
      description:
        "Live scale grid, absolute-zero guard, presets, and temperature-change (ΔT) tools — client-side on convert.kixt.net.",
      keywords: ["celsius fahrenheit", "kelvin converter", "temperature change"],
    },
    uk: {
      title: "Конвертер температури — °C, °F, Кельвін і ΔT",
      description: "Сітка шкал, захист абсолютного нуля, пресети та ΔT — на convert.kixt.net.",
      keywords: ["температура цельсій", "фаренгейт", "кельвін"],
    },
    de: {
      title: "Temperaturumrechner — °C, °F, Kelvin & ΔT",
      description: "Skalen-Raster und ΔT-Rechnung — lokal auf convert.kixt.net.",
      keywords: ["Celsius Fahrenheit", "Kelvin"],
    },
    es: {
      title: "Convertidor de temperatura — °C, °F, kelvin y ΔT",
      description: "Cuadrícula y cambio de temperatura — en convert.kixt.net.",
      keywords: ["celsius fahrenheit", "kelvin"],
    },
    pl: {
      title: "Konwerter temperatury — °C, °F, Kelvin i ΔT",
      description: "Siatka skal i obliczenia ΔT — lokalnie na convert.kixt.net.",
      keywords: ["celsius fahrenheit", "kelvin"],
    },
    fr: {
      title: "Convertisseur de température — °C, °F, kelvin & ΔT",
      description: "Grilles et variation ΔT — localement sur convert.kixt.net.",
      keywords: ["celsius fahrenheit", "kelvin"],
    },
  },
  "physics/speed": {
    en: {
      title: "Speed converter — km/h, mph, knots & travel-time solver",
      description:
        "Transport and aviation units plus distance·time solver with zero-guards — in your browser on convert.kixt.net.",
      keywords: ["speed converter", "km/h to mph", "knots converter"],
    },
    uk: {
      title: "Конвертер швидкості — км/год, mph, вузли та час у дорозі",
      description: "Одиниці транспорту й авіації, розв’язувач відстань·час — на convert.kixt.net.",
      keywords: ["швидкість км год", "mph", "вузли"],
    },
    de: {
      title: "Geschwindigkeitsumrechner — km/h, mph, Knoten & Fahrzeit",
      description: "Strecke·Zeit-Rechner — lokal auf convert.kixt.net.",
      keywords: ["km/h mph", "Knoten"],
    },
    es: {
      title: "Convertidor de velocidad — km/h, mph, nudos y tiempo",
      description: "Solver distancia·tiempo — en convert.kixt.net.",
      keywords: ["velocidad km/h", "mph", "nudos"],
    },
    pl: {
      title: "Konwerter prędkości — km/h, mph, węzły i czas podróży",
      description: "Solver dystans·czas — lokalnie na convert.kixt.net.",
      keywords: ["prędkość km/h", "mph", "węzły"],
    },
    fr: {
      title: "Convertisseur de vitesse — km/h, mph, nœuds & temps de trajet",
      description: "Solveur distance·temps — sur convert.kixt.net.",
      keywords: ["vitesse km/h", "mph", "nœuds"],
    },
  },
  "physics/pressure-energy": {
    en: {
      title: "Pressure & energy converter — Pa, bar, psi & kWh tabs",
      description:
        "Independent pressure and energy tabs (no cross-mixing), presets and grids — local on convert.kixt.net.",
      keywords: ["pressure converter", "psi to bar", "kWh joules"],
    },
    uk: {
      title: "Тиск і енергія — Pa, bar, psi та кВт·год (окремі вкладки)",
      description: "Розділені режими тиску й енергії без змішування — на convert.kixt.net.",
      keywords: ["тиск bar psi", "енергія кВт год"],
    },
    de: {
      title: "Druck & Energie — Pa, bar, psi & kWh (getrennte Tabs)",
      description: "Getrennte Druck- und Energie-Gruppen — lokal auf convert.kixt.net.",
      keywords: ["Druck bar psi", "kWh Joule"],
    },
    es: {
      title: "Presión y energía — Pa, bar, psi y kWh (pestañas)",
      description: "Grupos independientes — en convert.kixt.net.",
      keywords: ["presión bar psi", "kWh julios"],
    },
    pl: {
      title: "Ciśnienie i energia — Pa, bar, psi i kWh (zakładki)",
      description: "Oddzielne tryby — lokalnie na convert.kixt.net.",
      keywords: ["ciśnienie bar psi", "kWh dżule"],
    },
    fr: {
      title: "Pression & énergie — Pa, bar, psi & kWh (onglets)",
      description: "Groupes séparés — localement sur convert.kixt.net.",
      keywords: ["pression bar psi", "kWh joules"],
    },
  },
  "digital/data-storage": {
    en: {
      title: "Data storage converter — bytes to PB (1024 steps)",
      description:
        "Binary KB/MB/GB/TB grid, presets, and sum of two file sizes — private on convert.kixt.net.",
      keywords: ["MB to GB", "data size converter", "kilobytes megabytes"],
    },
    uk: {
      title: "Обсяг даних — байти до ПБ (крок 1024)",
      description: "Двійкова сітка, пресети й сума двох розмірів — на convert.kixt.net.",
      keywords: ["МБ ГБ", "розмір файлу", "конвертер даних"],
    },
    de: {
      title: "Datenspeicher — Bytes bis PB (1024-Stufen)",
      description: "Binäres Raster und Summe — lokal auf convert.kixt.net.",
      keywords: ["MB GB", "Dateigröße"],
    },
    es: {
      title: "Almacenamiento — bytes a PB (pasos 1024)",
      description: "Cuadrícula binaria y suma — en convert.kixt.net.",
      keywords: ["MB GB", "tamaño archivo"],
    },
    pl: {
      title: "Pamięć danych — bajty do PB (krok 1024)",
      description: "Siatka binarna i suma — lokalnie na convert.kixt.net.",
      keywords: ["MB GB", "rozmiar pliku"],
    },
    fr: {
      title: "Stockage — octets à Po (pas 1024)",
      description: "Grille binaire et somme — sur convert.kixt.net.",
      keywords: ["Mo Go", "taille fichier"],
    },
  },
  "digital/data-transfer": {
    en: {
      title: "Data transfer rate — bps to Gbps & file upload time",
      description:
        "Decimal bit rates, byte/s view, and ideal transfer-time estimate — client-side on convert.kixt.net.",
      keywords: ["mbps converter", "download time calculator", "bits per second"],
    },
    uk: {
      title: "Швидкість передачі — bps до Gbps і час завантаження",
      description: "Десятковий бітрейт, байт/с, оцінка часу — на convert.kixt.net.",
      keywords: ["Мбіт/с", "час завантаження", "bitrate"],
    },
    de: {
      title: "Übertragungsrate — bps bis Gbps & Datei-Dauer",
      description: "Dezimal-Bitraten und Byte/s — lokal auf convert.kixt.net.",
      keywords: ["Mbit/s", "Downloadzeit"],
    },
    es: {
      title: "Tasa de transferencia — bps a Gbps y tiempo de subida",
      description: "Bitrates decimales y byte/s — en convert.kixt.net.",
      keywords: ["Mbps", "tiempo descarga"],
    },
    pl: {
      title: "Prędkość transferu — bps do Gbps i czas pobierania",
      description: "Bitrate dziesiętny i bajt/s — lokalnie na convert.kixt.net.",
      keywords: ["Mbps", "czas pobierania"],
    },
    fr: {
      title: "Débit réseau — bps à Gbps & temps de transfert",
      description: "Débits décimaux et octets/s — sur convert.kixt.net.",
      keywords: ["Mbit/s", "temps téléchargement"],
    },
  },
  "digital/ratios-aspect": {
    en: {
      title: "Aspect ratio & proportion scaler — 16:9, GCD, resolutions",
      description:
        "Simplify ratios, decimal form, custom scaler, and resolution grid from one pair — on convert.kixt.net.",
      keywords: ["aspect ratio calculator", "16:9", "ratio simplifier"],
    },
    uk: {
      title: "Пропорції та aspect ratio — 16:9, НСД, сітка роздільності",
      description: "Спрощення, десяткова форма, масштаб і копіювання — на convert.kixt.net.",
      keywords: ["співвідношення 16:9", "пропорції", "роздільність"],
    },
    de: {
      title: "Seitenverhältnis & Skalierung — 16:9, ggT, Auflösungen",
      description: "Verkürzen, Dezimal, Raster — lokal auf convert.kixt.net.",
      keywords: ["16:9", "Seitenverhältnis"],
    },
    es: {
      title: "Proporción y aspect ratio — 16:9, MCD, resoluciones",
      description: "Simplificar, escala y cuadrícula — en convert.kixt.net.",
      keywords: ["16:9", "relación aspecto"],
    },
    pl: {
      title: "Proporcje i aspect ratio — 16:9, NWD, rozdzielczości",
      description: "Uproszczenie, skala, siatka — lokalnie na convert.kixt.net.",
      keywords: ["16:9", "proporcje"],
    },
    fr: {
      title: "Ratio d’aspect & échelle — 16:9, PGCD, résolutions",
      description: "Simplification et grille — sur convert.kixt.net.",
      keywords: ["16:9", "ratio écran"],
    },
  },
  "calculators/percentages": {
    en: {
      title: "Percentage calculator — % of number, share % & change",
      description:
        "Three guarded modes with copyable results — homework, finance, and stats without Excel on convert.kixt.net.",
      keywords: ["percentage calculator", "percent change", "what percent of"],
    },
    uk: {
      title: "Калькулятор відсотків — % від числа, частка та зміна",
      description: "Три режими з перевірками ділення на нуль — локально на convert.kixt.net.",
      keywords: ["відсотки калькулятор", "зміна відсотків"],
    },
    de: {
      title: "Prozentrechner — % von Zahl, Anteil & Änderung",
      description: "Drei Modi mit Kopieren — lokal auf convert.kixt.net.",
      keywords: ["Prozentrechner", "Prozentänderung"],
    },
    es: {
      title: "Calculadora de porcentajes — % de número, cuota y cambio",
      description: "Tres modos con copia — en convert.kixt.net.",
      keywords: ["porcentajes", "cambio porcentual"],
    },
    pl: {
      title: "Kalkulator procentów — % liczby, udział i zmiana",
      description: "Trzy tryby — lokalnie na convert.kixt.net.",
      keywords: ["procenty kalkulator", "zmiana procentowa"],
    },
    fr: {
      title: "Calculateur de pourcentages — % d’un nombre, part & variation",
      description: "Trois modes copiables — sur convert.kixt.net.",
      keywords: ["pourcentage", "variation pourcentage"],
    },
  },
  "calculators/discounts": {
    en: {
      title: "Discount & markup calculator — sale price & reverse base",
      description:
        "Preset discounts, markup from cost, or find pre-discount price — commerce math locally on convert.kixt.net.",
      keywords: ["discount calculator", "markup calculator", "sale price"],
    },
    uk: {
      title: "Знижки та націнка — ціна продажу і зворотний розрахунок",
      description: "Пресети знижок, націнка від собівартості — на convert.kixt.net.",
      keywords: ["калькулятор знижки", "націнка"],
    },
    de: {
      title: "Rabatt & Aufschlag — Verkaufspreis & Rückrechnung",
      description: "Rabatt-Presets und Marge — lokal auf convert.kixt.net.",
      keywords: ["Rabattrechner", "Aufschlag"],
    },
    es: {
      title: "Descuentos y recargos — precio final y precio base",
      description: "Presets y recargo — en convert.kixt.net.",
      keywords: ["descuento", "recargo"],
    },
    pl: {
      title: "Rabaty i narzuty — cena końcowa i cena bazowa",
      description: "Presety rabatu — lokalnie na convert.kixt.net.",
      keywords: ["rabat kalkulator", "narzut"],
    },
    fr: {
      title: "Remises & majorations — prix soldé & prix d’origine",
      description: "Exemples de remise et marge — sur convert.kixt.net.",
      keywords: ["remise", "majoration"],
    },
  },
  "calculators/proportions": {
    en: {
      title: "Proportion solver — a/b = c/x with cross-multiply steps",
      description:
        "Enter three known values, get x with shown algebra — recipes, maps, and mix ratios on convert.kixt.net.",
      keywords: ["proportion calculator", "cross multiply", "solve for x"],
    },
    uk: {
      title: "Пропорції — a/b = c/x із кроками перехресного множення",
      description: "Три відомі значення, розв’язок x і пояснення — на convert.kixt.net.",
      keywords: ["пропорції", "перехресне множення"],
    },
    de: {
      title: "Proportionen lösen — a/b = c/x mit Kreuzmultiplikation",
      description: "Schritte sichtbar — lokal auf convert.kixt.net.",
      keywords: ["Proportionen", "Kreuzmultiplikation"],
    },
    es: {
      title: "Proporciones — a/b = c/x con multiplicación cruzada",
      description: "Pasos visibles — en convert.kixt.net.",
      keywords: ["proporciones", "regla de tres"],
    },
    pl: {
      title: "Proporcje — a/b = c/x z mnożeniem krzyżowym",
      description: "Kroki rozwiązania — lokalnie na convert.kixt.net.",
      keywords: ["proporcje", "mnożenie krzyżowe"],
    },
    fr: {
      title: "Proportions — a/b = c/x avec produit en croix",
      description: "Étapes affichées — sur convert.kixt.net.",
      keywords: ["proportions", "produit en croix"],
    },
  },
};

export function getSeoCopy(page: SeoPageId, lang: Lang): SeoCopy {
  if (page === "home") return home[lang];
  if ((CATEGORIES as readonly string[]).includes(page)) return categories[page as CategoryId][lang];
  return tools[page as ToolRouteId][lang];
}

export const ALL_SEO_PAGE_IDS: SeoPageId[] = [
  "home",
  ...CATEGORIES,
  ...TOOL_ROUTE_IDS,
];

export function isSeoPageId(value: string): value is SeoPageId {
  return (ALL_SEO_PAGE_IDS as readonly string[]).includes(value);
}