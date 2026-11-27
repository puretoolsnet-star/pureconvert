import type { Lang } from "@/i18n/locales";
import type { PageSeoFaqItem } from "@/i18n/seo/page-content";
import type { ToolRouteId } from "@/lib/tools/routes";

export type ToolSeoSlice = {
  useCases: string[];
  extraFaqs: PageSeoFaqItem[];
};

const L: Lang[] = ["en", "uk", "de", "es", "pl", "fr"];

function slice(
  en: ToolSeoSlice,
  uk: ToolSeoSlice,
  de: ToolSeoSlice,
  es: ToolSeoSlice,
  pl: ToolSeoSlice,
  fr: ToolSeoSlice,
): Record<Lang, ToolSeoSlice> {
  return { en, uk, de, es, pl, fr };
}

export const TOOL_PAGE_SLICES: Record<ToolRouteId, Record<Lang, ToolSeoSlice>> = {
  "measurements/length": slice(
    {
      useCases: [
        "Convert running routes between km and miles before a race.",
        "Check nanometer ↔ micron tolerances in engineering specs.",
        "Sum two beam lengths in the same output unit for a cut list.",
      ],
      extraFaqs: [
        {
          question: "Can I swap from and to units?",
          answer: "Yes — use the swap control; the full grid updates instantly.",
        },
        {
          question: "Are nautical miles included?",
          answer: "Yes. NM, statute miles, feet, and metric steps share one live grid.",
        },
      ],
    },
    {
      useCases: [
        "Перевести дистанцію забігу з км у милі.",
        "Перевірити допуски нм ↔ мкм у технічній документації.",
        "Підсумувати дві довжини в одній одиниці для кошторису.",
      ],
      extraFaqs: [
        { question: "Чи можна поміняти «з» і «на»?", answer: "Так — кнопка обміну оновлює всю сітку миттєво." },
        { question: "Чи є морські милі?", answer: "Так, разом із метричними та футами в одній сітці." },
      ],
    },
    {
      useCases: ["Strecke km↔mi", "nm↔µm Toleranzen", "Zwei Längen summieren"],
      extraFaqs: [
        { question: "Einheiten tauschen?", answer: "Ja, per Umschalter — Raster aktualisiert sofort." },
        { question: "Seemeilen?", answer: "Ja, im gleichen Raster." },
      ],
    },
    {
      useCases: ["Ruta km↔mi", "nm↔µm", "Sumar longitudes"],
      extraFaqs: [
        { question: "¿Intercambiar unidades?", answer: "Sí, con actualización instantánea." },
        { question: "¿Millas náuticas?", answer: "Sí, en la misma cuadrícula." },
      ],
    },
    {
      useCases: ["Trasa km↔mile", "nm↔µm", "Sumować długości"],
      extraFaqs: [
        { question: "Zamiana jednostek?", answer: "Tak — natychmiastowa aktualizacja siatki." },
        { question: "Mile morskie?", answer: "Tak, w tej samej siatce." },
      ],
    },
    {
      useCases: ["Parcours km↔mi", "nm↔µm", "Sommer des longueurs"],
      extraFaqs: [
        { question: "Inverser les unités ?", answer: "Oui — mise à jour instantanée." },
        { question: "Milles nautiques ?", answer: "Oui, dans la même grille." },
      ],
    },
  ),
  "measurements/area": slice(
    {
      useCases: [
        "Compare plot sizes in m², ares, hectares, and acres.",
        "Estimate a rectangular field from length × width.",
        "Add or subtract two surface values for a floor plan.",
      ],
      extraFaqs: [
        { question: "What is an are (a)?", answer: "100 m² — common for small land lots in some countries." },
        { question: "Does rectangle math feed the converter?", answer: "Yes — apply the result into the main grid." },
      ],
    },
    {
      useCases: ["Порівняти ділянки в м², сотках, га та акрах.", "Оцінити прямокутник поля.", "Додати дві площі в плані."],
      extraFaqs: [
        { question: "Що таке сотка (а)?", answer: "100 м² — типова одиниця для ділянок." },
        { question: "Чи переноситься площа з прямокутника?", answer: "Так — у головний конвертер." },
      ],
    },
    {
      useCases: ["Grundstück ha↔ac", "Rechteckfläche", "Flächen addieren"],
      extraFaqs: [
        { question: "Was ist ein Ar?", answer: "100 m²." },
        { question: "Rechteck übernehmen?", answer: "Ja, in den Konverter." },
      ],
    },
    {
      useCases: ["Parcela ha↔ac", "Rectángulo", "Sumar áreas"],
      extraFaqs: [
        { question: "¿Qué es un área (a)?", answer: "100 m²." },
        { question: "¿Aplicar rectángulo?", answer: "Sí, al convertidor principal." },
      ],
    },
    {
      useCases: ["Działka ha↔akr", "Prostokąt", "Dodać pola"],
      extraFaqs: [
        { question: "Co to ar?", answer: "100 m²." },
        { question: "Przenieść prostokąt?", answer: "Tak, do konwertera." },
      ],
    },
    {
      useCases: ["Terrain ha↔acre", "Rectangle", "Additionner surfaces"],
      extraFaqs: [
        { question: "Qu’est-ce qu un are ?", answer: "100 m²." },
        { question: "Appliquer le rectangle ?", answer: "Oui, au convertisseur." },
      ],
    },
  ),
  "measurements/volume": slice(
    {
      useCases: ["Scale a recipe between cups, ml, and liters.", "Convert tank volume between m³ and gallons.", "Add two liquid measures for batch cooking."],
      extraFaqs: [
        { question: "Are US kitchen units supported?", answer: "Yes — tsp through gallon with labels." },
        { question: "Recipe scaling?", answer: "Use ½× to 3× multipliers on your base volume." },
      ],
    },
    {
      useCases: ["Масштабувати рецепт cups ↔ ml.", "Об’єм бака m³ ↔ галони.", "Скласти дві порції рідини."],
      extraFaqs: [
        { question: "Чи є US cups?", answer: "Так — від чайної ложки до галона." },
        { question: "Масштаб рецепта?", answer: "Множники ½×–3× від базового об’єму." },
      ],
    },
    {
      useCases: ["Rezept cups↔ml", "Tank m³↔gal", "Volumen summieren"],
      extraFaqs: [
        { question: "US-Kücheneinheiten?", answer: "Ja." },
        { question: "Rezeptskalierung?", answer: "Mit ½×–3×." },
      ],
    },
    {
      useCases: ["Receta cups↔ml", "Tanque m³↔gal", "Sumar volúmenes"],
      extraFaqs: [
        { question: "¿Unidades US?", answer: "Sí." },
        { question: "¿Escalar receta?", answer: "Con ½×–3×." },
      ],
    },
    {
      useCases: ["Przepis cups↔ml", "Zbiornik m³↔gal", "Sumować objętości"],
      extraFaqs: [
        { question: "Jednostki US?", answer: "Tak." },
        { question: "Skalowanie?", answer: "½×–3×." },
      ],
    },
    {
      useCases: ["Recette cups↔ml", "Cuve m³↔gal", "Additionner volumes"],
      extraFaqs: [
        { question: "Unités US ?", answer: "Oui." },
        { question: "Mise à l’échelle ?", answer: "½× à 3×." },
      ],
    },
  ),
  "physics/weight": slice(
    {
      useCases: ["Convert grocery portions between g, oz, and lb.", "Scale a recipe from 500 g to pounds.", "Freight totals in kg vs short tons."],
      extraFaqs: [
        { question: "Stone (st) included?", answer: "Yes — 1 st = 14 lb in the mass grid." },
        { question: "Batch scaling?", answer: "½×–5× multipliers from your base mass." },
      ],
    },
    {
      useCases: ["Порції продуктів g ↔ oz.", "Рецепт 500 г у фунти.", "Вантаж кг ↔ тонни."],
      extraFaqs: [
        { question: "Чи є stone?", answer: "Так — 1 st = 14 lb." },
        { question: "Масштаб порцій?", answer: "Множники ½×–5×." },
      ],
    },
    {
      useCases: ["Portionen g↔oz", "Rezept in lb", "Fracht kg"],
      extraFaqs: [
        { question: "Stone?", answer: "Ja, 14 lb." },
        { question: "Skalierung?", answer: "½×–5×." },
      ],
    },
    {
      useCases: ["Porciones g↔oz", "Receta en lb", "Carga kg"],
      extraFaqs: [
        { question: "¿Stone?", answer: "Sí, 14 lb." },
        { question: "¿Escalado?", answer: "½×–5×." },
      ],
    },
    {
      useCases: ["Porcje g↔oz", "Przepis w lb", "Ładunek kg"],
      extraFaqs: [
        { question: "Stone?", answer: "Tak, 14 lb." },
        { question: "Skalowanie?", answer: "½×–5×." },
      ],
    },
    {
      useCases: ["Portions g↔oz", "Recette en lb", "Fret kg"],
      extraFaqs: [
        { question: "Stone ?", answer: "Oui, 14 lb." },
        { question: "Échelle ?", answer: "½× à 5×." },
      ],
    },
  ),
  "physics/temperature": slice(
    {
      useCases: ["Oven settings between °C and °F.", "Lab readings in Kelvin vs Celsius.", "Compute ΔT between two measurements without offset error."],
      extraFaqs: [
        { question: "Absolute zero?", answer: "Inputs below physical limits show a guard — conversions stay valid." },
        { question: "Difference vs point conversion?", answer: "ΔT block uses direct deltas; the grid converts scale points." },
      ],
    },
    {
      useCases: ["Духовка °C ↔ °F.", "Лабораторія K ↔ °C.", "ΔT між двома вимірами."],
      extraFaqs: [
        { question: "Абсолютний нуль?", answer: "Є попередження при фізично неможливих значеннях." },
        { question: "ΔT vs точка?", answer: "Блок ΔT для змін; сітка — для шкал." },
      ],
    },
    {
      useCases: ["Ofen °C↔°F", "Labor K", "ΔT"],
      extraFaqs: [
        { question: "Absoluter Nullpunkt?", answer: "Hinweis bei ungültigen Werten." },
        { question: "ΔT vs Punkt?", answer: "Getrennte Blöcke." },
      ],
    },
    {
      useCases: ["Horno °C↔°F", "Kelvin", "ΔT"],
      extraFaqs: [
        { question: "Cero absoluto?", answer: "Aviso en valores inválidos." },
        { question: "ΔT vs punto?", answer: "Bloques separados." },
      ],
    },
    {
      useCases: ["Piekarnik °C↔°F", "Kelvin", "ΔT"],
      extraFaqs: [
        { question: "Zero absolutne?", answer: "Ostrzeżenie przy błędnych wartościach." },
        { question: "ΔT vs punkt?", answer: "Osobne bloki." },
      ],
    },
    {
      useCases: ["Four °C↔°F", "Kelvin", "ΔT"],
      extraFaqs: [
        { question: "Zéro absolu ?", answer: "Avertissement si valeur impossible." },
        { question: "ΔT vs point ?", answer: "Blocs séparés." },
      ],
    },
  ),
  "physics/speed": slice(
    {
      useCases: ["Compare highway limits km/h vs mph.", "Boat speed in knots vs km/h.", "Find travel time for a fixed distance."],
      extraFaqs: [
        { question: "How are knots defined?", answer: "1 kn = 1.852 km/h — used in the knot presets." },
        { question: "Travel solver edge cases?", answer: "Zero speed or time shows a guard instead of infinity." },
      ],
    },
    {
      useCases: ["Ліміт швидкості km/h ↔ mph.", "Човен у вузлах.", "Час у дорозі для відстані."],
      extraFaqs: [
        { question: "Вузол?", answer: "1 kn = 1,852 km/h." },
        { question: "Нуль швидкості?", answer: "Показує захист замість ділення на нуль." },
      ],
    },
    {
      useCases: ["km/h↔mph", "Knoten", "Fahrzeit"],
      extraFaqs: [
        { question: "Knoten?", answer: "1 kn = 1,852 km/h." },
        { question: "Nullgeschwindigkeit?", answer: "Schutz statt Fehler." },
      ],
    },
    {
      useCases: ["km/h↔mph", "Nudos", "Tiempo ruta"],
      extraFaqs: [
        { question: "¿Nudo?", answer: "1 kn = 1,852 km/h." },
        { question: "¿Velocidad cero?", answer: "Aviso en lugar de error." },
      ],
    },
    {
      useCases: ["km/h↔mph", "Węzły", "Czas podróży"],
      extraFaqs: [
        { question: "Węzeł?", answer: "1 kn = 1,852 km/h." },
        { question: "Prędkość zero?", answer: "Ochrona zamiast błędu." },
      ],
    },
    {
      useCases: ["km/h↔mph", "Nœuds", "Temps trajet"],
      extraFaqs: [
        { question: "Nœud ?", answer: "1 kn = 1,852 km/h." },
        { question: "Vitesse nulle ?", answer: "Garde au lieu d’erreur." },
      ],
    },
  ),
  "physics/pressure-energy": slice(
    {
      useCases: ["Tire pressure bar ↔ psi.", "Hydraulic line ratings in Pa/kPa.", "Household kWh vs joules on an energy bill."],
      extraFaqs: [
        { question: "Why separate tabs?", answer: "Pressure and energy are different quantities — we never cross-convert them." },
        { question: "Energy presets?", answer: "Includes kWh, Wh, kcal, and MJ shortcuts." },
      ],
    },
    {
      useCases: ["Тиск шин bar ↔ psi.", "Гідравліка Pa/kPa.", "Рахунок кВт·год ↔ Дж."],
      extraFaqs: [
        { question: "Чому окремі вкладки?", answer: "Тиск і енергія — різні величини, без змішування." },
        { question: "Пресети енергії?", answer: "кВт·год, Вт·год, ккал, МДж." },
      ],
    },
    {
      useCases: ["Reifendruck bar↔psi", "Hydraulik", "kWh↔J"],
      extraFaqs: [
        { question: "Getrennte Tabs?", answer: "Keine Kreuzumrechnung Druck/Energie." },
        { question: "Energie-Presets?", answer: "kWh, kcal, MJ u. a." },
      ],
    },
    {
      useCases: ["Neumáticos bar↔psi", "Hidráulica", "kWh↔J"],
      extraFaqs: [
        { question: "¿Pestañas separadas?", answer: "Sin mezclar presión y energía." },
        { question: "¿Presets energía?", answer: "kWh, kcal, MJ." },
      ],
    },
    {
      useCases: ["Opony bar↔psi", "Ciśnienie", "kWh↔J"],
      extraFaqs: [
        { question: "Osobne zakładki?", answer: "Bez mieszania ciśnienia i energii." },
        { question: "Presety energii?", answer: "kWh, kcal, MJ." },
      ],
    },
    {
      useCases: ["Pneus bar↔psi", "Hydraulique", "kWh↔J"],
      extraFaqs: [
        { question: "Onglets séparés ?", answer: "Pas de mélange pression/énergie." },
        { question: "Exemples énergie ?", answer: "kWh, kcal, MJ." },
      ],
    },
  ),
  "digital/data-storage": slice(
    {
      useCases: ["Explain download size MB vs GB to a client.", "Add two attachment sizes for email limits.", "Compare phone storage tiers."],
      extraFaqs: [
        { question: "1024 or 1000?", answer: "Storage grid uses binary 1024 steps (KiB-style labels)." },
        { question: "Sum two sizes?", answer: "Yes — pick a common output unit for A+B." },
      ],
    },
    {
      useCases: ["Пояснити клієнту МБ vs ГБ.", "Скласти розмір двох вкладень.", "Порівняти пам’ять телефону."],
      extraFaqs: [
        { question: "1024 чи 1000?", answer: "Двійкові кроки 1024." },
        { question: "Сума двох розмірів?", answer: "Так, у спільній одиниці." },
      ],
    },
    {
      useCases: ["MB vs GB", "Summe Anhänge", "Speicher"],
      extraFaqs: [
        { question: "1024?", answer: "Binäre Stufen." },
        { question: "Summe?", answer: "Ja." },
      ],
    },
    {
      useCases: ["MB vs GB", "Sumar adjuntos", "Almacenamiento"],
      extraFaqs: [
        { question: "¿1024?", answer: "Pasos binarios." },
        { question: "¿Suma?", answer: "Sí." },
      ],
    },
    {
      useCases: ["MB vs GB", "Suma załączników", "Pamięć"],
      extraFaqs: [
        { question: "1024?", answer: "Krok binarny." },
        { question: "Suma?", answer: "Tak." },
      ],
    },
    {
      useCases: ["Mo vs Go", "Somme pièces jointes", "Stockage"],
      extraFaqs: [
        { question: "1024 ?", answer: "Pas binaire." },
        { question: "Somme ?", answer: "Oui." },
      ],
    },
  ),
  "digital/data-transfer": slice(
    {
      useCases: ["Compare ISP plan Mbps vs real MB/s.", "Estimate upload time for a GB file.", "VoIP vs 4K streaming bitrate checks."],
      extraFaqs: [
        { question: "Bits vs bytes?", answer: "Bit rates use decimal steps; byte/s row shows 8× conversion." },
        { question: "Transfer time accuracy?", answer: "Ideal formula — real networks vary with overhead." },
      ],
    },
    {
      useCases: ["Тариф Mbps vs МБ/с.", "Час відвантаження файлу ГБ.", "Бітрейт дзвінка vs 4K."],
      extraFaqs: [
        { question: "Біти чи байти?", answer: "Біти — десяткові кроки; рядок байт/с = ÷8." },
        { question: "Точність часу?", answer: "Ідеальна формула; мережа має накладні витрати." },
      ],
    },
    {
      useCases: ["Mbps vs MB/s", "Upload-Zeit", "Streaming"],
      extraFaqs: [
        { question: "Bits/Bytes?", answer: "Byte/s = Bitrate/8." },
        { question: "Zeitschätzung?", answer: "Ideal — reale Netze variieren." },
      ],
    },
    {
      useCases: ["Mbps vs MB/s", "Tiempo subida", "Streaming"],
      extraFaqs: [
        { question: "¿Bits o bytes?", answer: "Byte/s = bitrate/8." },
        { question: "¿Tiempo real?", answer: "Estimación ideal." },
      ],
    },
    {
      useCases: ["Mbps vs MB/s", "Czas uploadu", "Streaming"],
      extraFaqs: [
        { question: "Bity czy bajty?", answer: "Bajt/s = bitrate/8." },
        { question: "Czas?", answer: "Szacunek idealny." },
      ],
    },
    {
      useCases: ["Mbps vs Mo/s", "Temps envoi", "Streaming"],
      extraFaqs: [
        { question: "Bits ou octets ?", answer: "Octets/s = débit/8." },
        { question: "Temps ?", answer: "Estimation idéale." },
      ],
    },
  ),
  "digital/ratios-aspect": slice(
    {
      useCases: ["Simplify 1920×1080 to 16∶9.", "Scale UI mockups with locked ratio.", "Pick resolution steps for export."],
      extraFaqs: [
        { question: "GCD simplification?", answer: "Yes — integer ratio after greatest common divisor." },
        { question: "Copy dimensions?", answer: "One tap copies width×height from the scaler." },
      ],
    },
    {
      useCases: ["1920×1080 → 16∶9.", "Макет UI з фіксованою пропорцією.", "Кроки роздільності для експорту."],
      extraFaqs: [
        { question: "НСД?", answer: "Так — цілі числа після найбільшого спільного дільника." },
        { question: "Копіювати розміри?", answer: "Одним дотиком зі скалера." },
      ],
    },
    {
      useCases: ["16:9", "UI-Skala", "Auflösungen"],
      extraFaqs: [
        { question: "ggT?", answer: "Ja." },
        { question: "Kopieren?", answer: "Ja." },
      ],
    },
    {
      useCases: ["16:9", "Escala UI", "Resoluciones"],
      extraFaqs: [
        { question: "¿MCD?", answer: "Sí." },
        { question: "¿Copiar?", answer: "Sí." },
      ],
    },
    {
      useCases: ["16:9", "Skala UI", "Rozdzielczości"],
      extraFaqs: [
        { question: "NWD?", answer: "Tak." },
        { question: "Kopiowanie?", answer: "Tak." },
      ],
    },
    {
      useCases: ["16:9", "Maquette UI", "Résolutions"],
      extraFaqs: [
        { question: "PGCD ?", answer: "Oui." },
        { question: "Copier ?", answer: "Oui." },
      ],
    },
  ),
  "calculators/percentages": slice(
    {
      useCases: ["Tax or tip as % of a bill.", "What % is A of B in reports.", "Month-over-month % change."],
      extraFaqs: [
        { question: "Divide by zero?", answer: "Guards block invalid whole or base values." },
        { question: "Switch modes?", answer: "Inputs are kept when you change tabs." },
      ],
    },
    {
      useCases: ["Податок або чайові % від суми.", "Який % складає A від B.", "Зміна % місяць до місяця."],
      extraFaqs: [
        { question: "Ділення на нуль?", answer: "Захист при нульовій основі." },
        { question: "Зміна режиму?", answer: "Введені значення зберігаються." },
      ],
    },
    {
      useCases: ["Trinkgeld %", "Anteil %", "Änderung %"],
      extraFaqs: [
        { question: "Division durch 0?", answer: "Schutz aktiv." },
        { question: "Modi wechseln?", answer: "Eingaben bleiben." },
      ],
    },
    {
      useCases: ["Propina %", "Cuota %", "Cambio %"],
      extraFaqs: [
        { question: "¿División por cero?", answer: "Bloqueo activo." },
        { question: "¿Cambiar pestaña?", answer: "Se conservan valores." },
      ],
    },
    {
      useCases: ["Napiwek %", "Udział %", "Zmiana %"],
      extraFaqs: [
        { question: "Dzielenie przez zero?", answer: "Ochrona aktywna." },
        { question: "Zmiana trybu?", answer: "Wartości zostają." },
      ],
    },
    {
      useCases: ["Pourboire %", "Part %", "Variation %"],
      extraFaqs: [
        { question: "Division par zéro ?", answer: "Garde active." },
        { question: "Changer d’onglet ?", answer: "Les valeurs restent." },
      ],
    },
  ),
  "calculators/discounts": slice(
    {
      useCases: ["Black Friday price after −30%.", "Wholesale markup from cost.", "Find list price before a known % off."],
      extraFaqs: [
        { question: "100% discount?", answer: "Blocked — final price cannot go below zero meaningfully." },
        { question: "Copy results?", answer: "Any output line has a copy action." },
      ],
    },
    {
      useCases: ["Ціна після −30%.", "Націнка від собівартості.", "Ціна до знижки за відомим %."],
      extraFaqs: [
        { question: "100% знижка?", answer: "Заблоковано." },
        { question: "Копіювання?", answer: "Біля кожного результату." },
      ],
    },
    {
      useCases: ["−30% Preis", "Marge", "Listenpreis"],
      extraFaqs: [
        { question: "100% Rabatt?", answer: "Blockiert." },
        { question: "Kopieren?", answer: "Ja." },
      ],
    },
    {
      useCases: ["−30%", "Margen", "Precio lista"],
      extraFaqs: [
        { question: "¿100% descuento?", answer: "Bloqueado." },
        { question: "¿Copiar?", answer: "Sí." },
      ],
    },
    {
      useCases: ["−30%", "Narzut", "Cena katalogowa"],
      extraFaqs: [
        { question: "100% rabatu?", answer: "Zablokowane." },
        { question: "Kopiowanie?", answer: "Tak." },
      ],
    },
    {
      useCases: ["−30%", "Marge", "Prix catalogue"],
      extraFaqs: [
        { question: "100 % remise ?", answer: "Bloqué." },
        { question: "Copier ?", answer: "Oui." },
      ],
    },
  ),
  "calculators/proportions": slice(
    {
      useCases: ["Recipe ratio when one ingredient changes.", "Map scale a/b = c/x.", "Mix paint or alloy proportions."],
      extraFaqs: [
        { question: "Are steps shown?", answer: "Cross-multiply substitution is listed for learning." },
        { question: "Example 3∶4 = 15∶x?", answer: "x = 20 — load sample to try instantly." },
      ],
    },
    {
      useCases: ["Рецепт при зміні інгредієнта.", "Масштаб карти a/b = c/x.", "Пропорції фарби чи сплаву."],
      extraFaqs: [
        { question: "Чи показуються кроки?", answer: "Так — перехресне множення." },
        { question: "3∶4 = 15∶x?", answer: "x = 20 — є приклад." },
      ],
    },
    {
      useCases: ["Rezept", "Maßstab", "Mischung"],
      extraFaqs: [
        { question: "Schritte?", answer: "Ja, Kreuzmultiplikation." },
        { question: "Beispiel?", answer: "3:4 = 15:x → 20." },
      ],
    },
    {
      useCases: ["Receta", "Escala mapa", "Mezcla"],
      extraFaqs: [
        { question: "¿Pasos?", answer: "Sí, multiplicación cruzada." },
        { question: "¿Ejemplo?", answer: "3:4 = 15:x → 20." },
      ],
    },
    {
      useCases: ["Przepis", "Skala mapy", "Mieszanka"],
      extraFaqs: [
        { question: "Kroki?", answer: "Tak, mnożenie krzyżowe." },
        { question: "Przykład?", answer: "3:4 = 15:x → 20." },
      ],
    },
    {
      useCases: ["Recette", "Échelle carte", "Mélange"],
      extraFaqs: [
        { question: "Étapes ?", answer: "Oui, produit en croix." },
        { question: "Exemple ?", answer: "3:4 = 15:x → 20." },
      ],
    },
  ),
};

void L;