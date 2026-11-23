"use client";

import { ArrowLeftRight, Check, Copy, Minus, Plus, RectangleHorizontal } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

import { UnitSelect } from "@/components/convert/UnitSelect";
import { useCopyFeedback } from "@/components/convert/use-copy-feedback";
import { useI18n } from "@/i18n/context";
import { unitLabel, unitSymbol } from "@/i18n/tools/get-copy";
import { kixtConvertEvent, pushKixtDataLayer } from "@/lib/analytics/kixt-gtm";
import {
  allAreaFromSquareMeters,
  AREA_EXTRA,
  AREA_PRESETS,
  AREA_PRIORITY,
  AREA_RECT_OUTPUT,
  AREA_UNIT_IDS,
  areaSumDifference,
  convertArea,
  fromSquareMeters,
  rectangleAreaSquareMeters,
  toSquareMeters,
  type AreaPresetId,
  type AreaUnitId,
} from "@/lib/convert/area";
import {
  formatConverted,
  isInvalidInputRaw,
  isNegativeOrInvalidInput,
  isNonPositiveOrInvalidInput,
  parseInputNumber,
  parseNonNegativeNumber,
  parsePositiveNumber,
} from "@/lib/convert/format";
import { LENGTH_UNIT_IDS, type LengthUnitId } from "@/lib/convert/length";
import { cn } from "@/lib/cn";

type EditSide = "from" | "to";
type ArithmeticOp = "sum" | "diff";

const PRESET_LABEL_KEY: Record<AreaPresetId, keyof import("@/i18n/types").Dictionary["area"]> = {
  garden: "presetGarden",
  plan: "presetPlan",
  field: "presetField",
  acreLand: "presetAcreLand",
};

export function AreaConverter() {
  const { lang, t } = useI18n();
  const { copiedKey, copy } = useCopyFeedback();

  const [fromUnit, setFromUnit] = useState<AreaUnitId>("m2");
  const [toUnit, setToUnit] = useState<AreaUnitId>("a");
  const [fromRaw, setFromRaw] = useState("");
  const [toRaw, setToRaw] = useState("");
  const [editSide, setEditSide] = useState<EditSide>("from");
  const [copyError, setCopyError] = useState(false);

  const [lenRaw, setLenRaw] = useState("");
  const [lenUnit, setLenUnit] = useState<LengthUnitId>("m");
  const [widRaw, setWidRaw] = useState("");
  const [widUnit, setWidUnit] = useState<LengthUnitId>("m");

  const [arithOp, setArithOp] = useState<ArithmeticOp>("sum");
  const [aRaw, setARaw] = useState("");
  const [aUnit, setAUnit] = useState<AreaUnitId>("a");
  const [bRaw, setBRaw] = useState("");
  const [bUnit, setBUnit] = useState<AreaUnitId>("m2");
  const [resultUnit, setResultUnit] = useState<AreaUnitId>("ha");

  const sqMeters = useMemo(() => {
    if (editSide === "from") {
      if (fromRaw.trim() === "") return null;
      const n = parseNonNegativeNumber(fromRaw);
      if (n === null) return null;
      return toSquareMeters(n, fromUnit);
    }
    if (toRaw.trim() === "") return null;
    const n = parseNonNegativeNumber(toRaw);
    if (n === null) return null;
    return toSquareMeters(n, toUnit);
  }, [editSide, fromRaw, fromUnit, toRaw, toUnit]);

  const gridValues = useMemo(() => {
    if (sqMeters === null) return null;
    return allAreaFromSquareMeters(sqMeters);
  }, [sqMeters]);

  const priorityValues = useMemo(() => {
    if (!gridValues) return null;
    const pick = new Map<string, string>();
    for (const id of AREA_PRIORITY) pick.set(id, gridValues.get(id) ?? "");
    return pick;
  }, [gridValues]);

  const rectangleSqM = useMemo(() => {
    const l = parsePositiveNumber(lenRaw);
    const w = parsePositiveNumber(widRaw);
    if (l === null || w === null) return null;
    return rectangleAreaSquareMeters(l, lenUnit, w, widUnit);
  }, [lenRaw, lenUnit, widRaw, widUnit]);

  const rectangleOutputs = useMemo(() => {
    if (rectangleSqM === null) return null;
    const out = new Map<string, string>();
    for (const id of AREA_RECT_OUTPUT) {
      const v = fromSquareMeters(rectangleSqM, id);
      out.set(id, v !== null ? formatConverted(v) : "");
    }
    return out;
  }, [rectangleSqM]);

  const onFromValueChange = (raw: string) => {
    setFromRaw(raw);
    setEditSide("from");
    const n = parseNonNegativeNumber(raw);
    if (n === null) {
      if (raw.trim() === "") setToRaw("");
      return;
    }
    const converted = convertArea(n, fromUnit, toUnit);
    if (converted !== null) setToRaw(formatConverted(converted));
    pushKixtDataLayer(kixtConvertEvent("input", "area", { field: "from" }));
  };

  const onToValueChange = (raw: string) => {
    setToRaw(raw);
    setEditSide("to");
    const n = parseNonNegativeNumber(raw);
    if (n === null) {
      if (raw.trim() === "") setFromRaw("");
      return;
    }
    const converted = convertArea(n, toUnit, fromUnit);
    if (converted !== null) setFromRaw(formatConverted(converted));
    pushKixtDataLayer(kixtConvertEvent("input", "area", { field: "to" }));
  };

  const onFromUnitChange = (id: string) => {
    const next = id as AreaUnitId;
    if (sqMeters !== null) {
      const newFrom = fromSquareMeters(sqMeters, next);
      if (newFrom !== null) setFromRaw(formatConverted(newFrom));
    }
    setFromUnit(next);
    pushKixtDataLayer(kixtConvertEvent("input", "area", { unit_select: "from", unit: next }));
  };

  const onToUnitChange = (id: string) => {
    const next = id as AreaUnitId;
    setToUnit(next);
    if (sqMeters !== null) {
      const toN = fromSquareMeters(sqMeters, next);
      if (toN !== null) setToRaw(formatConverted(toN));
    }
    pushKixtDataLayer(kixtConvertEvent("input", "area", { unit_select: "to", unit: next }));
  };

  const swap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromRaw(toRaw);
    setToRaw(fromRaw);
    setEditSide(editSide === "from" ? "to" : "from");
    pushKixtDataLayer(kixtConvertEvent("swap", "area"));
  };

  const clearAll = () => {
    setFromRaw("");
    setToRaw("");
    pushKixtDataLayer(kixtConvertEvent("clear", "area"));
  };

  const applyPreset = (id: AreaPresetId) => {
    const preset = AREA_PRESETS[id];
    setFromUnit(preset.unit);
    setFromRaw(preset.value);
    setEditSide("from");
    const n = parseInputNumber(preset.value);
    if (n !== null) {
      const converted = convertArea(n, preset.unit, toUnit);
      if (converted !== null) setToRaw(formatConverted(converted));
    }
    pushKixtDataLayer(kixtConvertEvent("preset", "area", { preset_id: id }));
  };

  const copyValue = async (key: string, text: string) => {
    const ok = await copy(key, text);
    setCopyError(!ok);
    pushKixtDataLayer(kixtConvertEvent("copy", "area", { key }));
  };

  const useGridAsSource = (unitId: string, value: string) => {
    if (!value.trim()) return;
    onFromValueChange(value);
    setFromUnit(unitId as AreaUnitId);
  };

  const applyRectangleToConverter = () => {
    if (rectangleSqM === null) return;
    const m2 = formatConverted(rectangleSqM);
    setFromUnit("m2");
    setFromRaw(m2);
    setEditSide("from");
    const toN = fromSquareMeters(rectangleSqM, toUnit);
    if (toN !== null) setToRaw(formatConverted(toN));
    pushKixtDataLayer(kixtConvertEvent("input", "area", { field: "rectangle_apply" }));
  };

  const fromInvalid =
    fromRaw.trim() !== "" && (isInvalidInputRaw(fromRaw) || isNegativeOrInvalidInput(fromRaw));
  const toInvalid = toRaw.trim() !== "" && (isInvalidInputRaw(toRaw) || isNegativeOrInvalidInput(toRaw));
  const lenInvalid = isNonPositiveOrInvalidInput(lenRaw);
  const widInvalid = isNonPositiveOrInvalidInput(widRaw);

  const arithmeticResult = useMemo(() => {
    const na = parseNonNegativeNumber(aRaw);
    const nb = parseNonNegativeNumber(bRaw);
    if (na === null || nb === null) return "";
    const total = areaSumDifference(na, aUnit, nb, bUnit, arithOp);
    if (total === null) return "";
    const out = fromSquareMeters(total, resultUnit);
    return out !== null ? formatConverted(out) : "";
  }, [aRaw, aUnit, arithOp, bRaw, bUnit, resultUnit]);

  const renderUnitRow = (id: AreaUnitId, value: string, variant: "priority" | "default") => {
    const dim = !value;
    return (
      <li key={id} className="min-w-0">
        <div
          className={cn(
            "flex min-w-0 items-center gap-2 rounded-xl border px-3 py-2",
            variant === "priority"
              ? "border-sky-500/35 bg-sky-500/10"
              : "border-slate-800 bg-slate-900/50",
            dim && "opacity-60",
          )}
        >
          <button
            type="button"
            onClick={() => !dim && useGridAsSource(id, value)}
            className="min-w-0 flex-1 text-left"
            title={t.area.useAsSource}
            disabled={dim}
          >
            <span className="block truncate text-[11px] font-medium text-slate-500">
              <span className="text-sky-300/90">{unitSymbol(lang, id)}</span>
              <span className="mx-1 text-slate-600">·</span>
              <span className="truncate">{unitLabel(lang, id)}</span>
            </span>
            <span className="mt-0.5 block truncate text-base font-semibold tabular-nums text-white">
              {dim ? "—" : value}
            </span>
          </button>
          <button
            type="button"
            disabled={dim}
            onClick={() => copyValue(`grid-${id}`, value)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-700/80 text-slate-400 hover:border-sky-500/40 hover:text-sky-200 disabled:opacity-40"
            aria-label={copiedKey === `grid-${id}` ? t.converter.copied : t.converter.copy}
          >
            {copiedKey === `grid-${id}` ? (
              <Check className="h-4 w-4 text-sky-300" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
      </li>
    );
  };

  return (
    <div className="space-y-8">
      <section className="space-y-4" aria-labelledby="area-main-heading">
        <SectionBlock title={t.area.mainTitle} id="area-main-heading">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{t.area.presetsTitle}</p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(AREA_PRESETS) as AreaPresetId[]).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => applyPreset(id)}
                className="min-h-10 max-w-full rounded-full border border-slate-700 bg-slate-900/50 px-3 py-2 text-xs text-slate-300 hover:border-sky-500/40 hover:text-sky-100 sm:text-sm"
              >
                {t.area[PRESET_LABEL_KEY[id]]}
              </button>
            ))}
            <button
              type="button"
              onClick={clearAll}
              className="min-h-10 rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-400 hover:text-slate-200"
            >
              {t.converter.clear}
            </button>
          </div>
          <p className="text-xs text-slate-500">{t.area.presetsHint}</p>
        </SectionBlock>

        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-end">
          <ValueField
            value={fromRaw}
            onChange={onFromValueChange}
            invalid={fromInvalid}
            invalidText={isNegativeOrInvalidInput(fromRaw) ? t.area.negativeNotAllowed : t.area.invalidInput}
            select={
              <UnitSelect
                label={t.area.fromUnit}
                unitId={fromUnit}
                options={AREA_UNIT_IDS}
                onChange={onFromUnitChange}
              />
            }
          />
          <button
            type="button"
            onClick={swap}
            aria-label={t.area.swapAria}
            className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-sky-500/35 bg-sky-500/15 text-sky-200 hover:bg-sky-500/25 md:mb-1"
          >
            <ArrowLeftRight className="h-5 w-5" />
          </button>
          <ValueField
            value={toRaw}
            onChange={onToValueChange}
            invalid={toInvalid}
            invalidText={isNegativeOrInvalidInput(toRaw) ? t.area.negativeNotAllowed : t.area.invalidInput}
            select={
              <UnitSelect
                label={t.area.toUnit}
                unitId={toUnit}
                options={AREA_UNIT_IDS}
                onChange={onToUnitChange}
              />
            }
          />
        </div>

        <CopyChipRow
          copyError={copyError}
          copyFailedLabel={t.area.copyFailed}
          chips={[
            { key: "main-to", disabled: !toRaw, copied: copiedKey === "main-to", onCopy: () => copyValue("main-to", toRaw), label: t.converter.copy, copiedLabel: t.converter.copied },
            gridValues
              ? {
                  key: "main-all",
                  disabled: false,
                  copied: copiedKey === "main-all",
                  onCopy: () => {
                    const lines = AREA_UNIT_IDS.map((id) => {
                      const v = gridValues.get(id);
                      if (!v) return null;
                      return `${unitSymbol(lang, id)}: ${v}`;
                    })
                      .filter(Boolean)
                      .join("\n");
                    void copyValue("main-all", lines);
                  },
                  label: t.converter.copyAll,
                  copiedLabel: t.converter.copied,
                }
              : null,
          ]}
        />
      </section>

      <section aria-labelledby="area-priority-heading">
        <h2 id="area-priority-heading" className="text-sm font-semibold text-sky-200/90">
          {t.area.priorityTitle}
        </h2>
        <p className="mt-1 text-xs text-slate-500">{t.area.priorityHint}</p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {AREA_PRIORITY.map((id) => renderUnitRow(id, priorityValues?.get(id) ?? "", "priority"))}
        </ul>
      </section>

      <section aria-labelledby="area-all-heading">
        <h2 id="area-all-heading" className="text-sm font-semibold text-white">
          {t.area.allUnitsTitle}
        </h2>
        <p className="mt-1 text-xs text-slate-500">{t.area.useAsSource}</p>
        <h3 className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">{t.area.extraUnitsLabel}</h3>
        <ul className="mt-2 grid gap-2 sm:grid-cols-3">
          {AREA_EXTRA.map((id) => renderUnitRow(id, gridValues?.get(id) ?? "", "default"))}
        </ul>
      </section>

      <section
        className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/30 p-4 sm:p-5"
        aria-labelledby="area-rect-heading"
      >
        <div className="flex items-start gap-3">
          <RectangleHorizontal className="mt-0.5 h-5 w-5 shrink-0 text-sky-400" aria-hidden />
          <SectionBlock title={t.area.rectangleTitle} id="area-rect-heading">
            <p className="text-xs text-slate-500">{t.area.rectangleHint}</p>
          </SectionBlock>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <SideInput
            label={t.area.sideLength}
            value={lenRaw}
            onChange={setLenRaw}
            unit={lenUnit}
            onUnit={(u) => setLenUnit(u)}
            invalid={lenInvalid}
            invalidText={t.area.nonPositiveSides}
          />
          <SideInput
            label={t.area.sideWidth}
            value={widRaw}
            onChange={setWidRaw}
            unit={widUnit}
            onUnit={(u) => setWidUnit(u)}
            invalid={widInvalid}
            invalidText={t.area.nonPositiveSides}
          />
        </div>
        <p className="text-xs font-medium text-slate-400">{t.area.rectangleResult}</p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {AREA_RECT_OUTPUT.map((id) => (
            <li
              key={id}
              className="rounded-xl border border-sky-500/25 bg-sky-500/10 px-3 py-2"
            >
              <span className="text-[11px] text-sky-200/80">{unitLabel(lang, id)}</span>
              <p className="text-lg font-semibold tabular-nums text-white">
                {rectangleOutputs?.get(id) ?? "—"}{" "}
                <span className="text-sm text-sky-300/90">{unitSymbol(lang, id)}</span>
              </p>
            </li>
          ))}
        </ul>
        <button
          type="button"
          disabled={rectangleSqM === null}
          onClick={applyRectangleToConverter}
          className="min-h-11 rounded-full border border-sky-500/35 bg-sky-500/10 px-4 py-2 text-sm text-sky-100 disabled:opacity-40"
        >
          {t.area.applyToConverter}
        </button>
      </section>

      <section
        className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/30 p-4 sm:p-5"
        aria-labelledby="area-arith-heading"
      >
        <SectionBlock title={t.area.arithmeticTitle} id="area-arith-heading">
          <p className="text-xs text-slate-500">{t.area.arithmeticHint}</p>
        </SectionBlock>
        <div className="flex flex-wrap gap-2">
          <OpButton active={arithOp === "sum"} onClick={() => { setArithOp("sum"); pushKixtDataLayer(kixtConvertEvent("arithmetic", "area", { op: "sum" })); }} icon={Plus} label={t.area.sum} />
          <OpButton active={arithOp === "diff"} onClick={() => { setArithOp("diff"); pushKixtDataLayer(kixtConvertEvent("arithmetic", "area", { op: "diff" })); }} icon={Minus} label={t.area.difference} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <ArithRow label={t.area.valueA} value={aRaw} onChange={setARaw} unit={aUnit} onUnit={setAUnit} negativeHint={t.area.negativeNotAllowed} />
          <ArithRow label={t.area.valueB} value={bRaw} onChange={setBRaw} unit={bUnit} onUnit={setBUnit} negativeHint={t.area.negativeNotAllowed} />
        </div>
        <UnitSelect
          label={t.area.resultIn}
          unitId={resultUnit}
          options={AREA_UNIT_IDS}
          onChange={(id) => setResultUnit(id as AreaUnitId)}
        />
        <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-3">
          <p className="text-xs text-sky-200/80">{t.converter.result}</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-white">
            {arithmeticResult ? (
              <>
                {arithmeticResult}{" "}
                <span className="text-lg text-sky-200/90">{unitSymbol(lang, resultUnit)}</span>
              </>
            ) : (
              "—"
            )}
          </p>
        </div>
      </section>
    </div>
  );
}

function SectionBlock({ title, id, children }: { title: string; id?: string; children?: ReactNode }) {
  return (
    <div>
      <h2 id={id} className="text-sm font-semibold text-white">
        {title}
      </h2>
      {children ? <div className="mt-2 space-y-2">{children}</div> : null}
    </div>
  );
}

function ValueField({
  value,
  onChange,
  invalid,
  invalidText,
  select,
}: {
  value: string;
  onChange: (v: string) => void;
  invalid: boolean;
  invalidText: string;
  select: ReactNode;
}) {
  const { t } = useI18n();
  return (
    <div className="min-w-0 space-y-2">
      {select}
      <label className="block">
        <span className="sr-only">{t.converter.enterValue}</span>
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t.converter.enterValue}
          aria-invalid={invalid}
          className={cn(
            "mt-1 min-h-12 w-full rounded-xl border bg-slate-900/60 px-4 text-xl font-medium tabular-nums text-white outline-none",
            invalid ? "border-rose-500/50 ring-1 ring-rose-500/25" : "border-slate-700 focus:border-sky-500/50",
          )}
        />
      </label>
      {invalid ? (
        <p className="text-xs text-rose-400/90" role="alert">
          {invalidText}
        </p>
      ) : null}
    </div>
  );
}

function SideInput({
  label,
  value,
  onChange,
  unit,
  onUnit,
  invalid,
  invalidText,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  unit: LengthUnitId;
  onUnit: (u: LengthUnitId) => void;
  invalid: boolean;
  invalidText: string;
}) {
  const { t } = useI18n();
  return (
    <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/40 p-3">
      <UnitSelect label={label} unitId={unit} options={LENGTH_UNIT_IDS} onChange={(id) => onUnit(id as LengthUnitId)} />
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          pushKixtDataLayer(kixtConvertEvent("input", "area", { field: "rectangle" }));
        }}
        placeholder={t.converter.enterValue}
        aria-invalid={invalid}
        className={cn(
          "min-h-11 w-full rounded-lg border bg-slate-950/60 px-3 text-lg tabular-nums text-white outline-none",
          invalid ? "border-rose-500/50" : "border-slate-700",
        )}
      />
      {invalid ? (
        <p className="text-xs text-rose-400/90" role="alert">
          {invalidText}
        </p>
      ) : null}
    </div>
  );
}

function ArithRow({
  label,
  value,
  onChange,
  unit,
  onUnit,
  negativeHint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  unit: AreaUnitId;
  onUnit: (u: AreaUnitId) => void;
  negativeHint: string;
}) {
  const { t } = useI18n();
  const invalid = value.trim() !== "" && isNegativeOrInvalidInput(value);
  return (
    <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/40 p-3">
      <UnitSelect label={label} unitId={unit} options={AREA_UNIT_IDS} onChange={(id) => onUnit(id as AreaUnitId)} />
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t.converter.enterValue}
        className={cn(
          "min-h-11 w-full rounded-lg border bg-slate-950/60 px-3 text-lg tabular-nums text-white outline-none",
          invalid ? "border-rose-500/50" : "border-slate-700",
        )}
      />
      {invalid ? <p className="text-xs text-rose-400/90">{negativeHint}</p> : null}
    </div>
  );
}

function OpButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Plus;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 py-2 text-sm",
        active ? "border-sky-400/45 bg-sky-500/15 text-sky-100" : "border-slate-800 text-slate-400",
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function CopyChipRow({
  copyError,
  copyFailedLabel,
  chips,
}: {
  copyError: boolean;
  copyFailedLabel: string;
  chips: ({ key: string; disabled: boolean; copied: boolean; onCopy: () => void; label: string; copiedLabel: string } | null)[];
}) {
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {chips.filter(Boolean).map((c) => {
          const chip = c!;
          return (
            <button
              key={chip.key}
              type="button"
              disabled={chip.disabled}
              onClick={chip.onCopy}
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300 disabled:opacity-40 hover:border-sky-500/40"
            >
              <Copy className="h-4 w-4" />
              {chip.copied ? chip.copiedLabel : chip.label}
            </button>
          );
        })}
      </div>
      {copyError ? (
        <p className="mt-2 text-xs text-rose-400/90" role="status">
          {copyFailedLabel}
        </p>
      ) : null}
    </div>
  );
}