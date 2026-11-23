"use client";

import { ArrowLeftRight, Check, Copy, Minus, Package, Plus } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

import { UnitSelect } from "@/components/convert/UnitSelect";
import { useCopyFeedback } from "@/components/convert/use-copy-feedback";
import { useI18n } from "@/i18n/context";
import { unitLabel, unitSymbol } from "@/i18n/tools/get-copy";
import { kixtConvertEvent, pushKixtDataLayer } from "@/lib/analytics/kixt-gtm";
import {
  formatConverted,
  isInvalidInputRaw,
  isNegativeOrInvalidInput,
  isNonPositiveOrInvalidInput,
  parseInputNumber,
  parseNonNegativeNumber,
  parsePositiveNumber,
} from "@/lib/convert/format";
import {
  allWeightFromKilograms,
  convertWeight,
  fromKilograms,
  toKilograms,
  WEIGHT_IMPERIAL,
  WEIGHT_METRIC,
  WEIGHT_PRESETS,
  WEIGHT_SCALE_OUTPUT,
  WEIGHT_UNIT_IDS,
  weightSumDifference,
  type WeightPresetId,
  type WeightUnitId,
} from "@/lib/convert/weight";
import { cn } from "@/lib/cn";

type EditSide = "from" | "to";
type ArithmeticOp = "sum" | "diff";
type MultMode = "half" | "double" | "five" | "custom";

const PRESET_LABEL_KEY: Record<WeightPresetId, keyof import("@/i18n/types").Dictionary["weight"]> = {
  micro: "presetMicro",
  ingredient: "presetIngredient",
  body: "presetBody",
  stone: "presetStone",
  freight: "presetFreight",
};

export function WeightConverter() {
  const { lang, t } = useI18n();
  const { copiedKey, copy } = useCopyFeedback();

  const [fromUnit, setFromUnit] = useState<WeightUnitId>("kg");
  const [toUnit, setToUnit] = useState<WeightUnitId>("lb");
  const [fromRaw, setFromRaw] = useState("");
  const [toRaw, setToRaw] = useState("");
  const [editSide, setEditSide] = useState<EditSide>("from");
  const [copyError, setCopyError] = useState(false);

  const [multMode, setMultMode] = useState<MultMode>("double");
  const [customMultRaw, setCustomMultRaw] = useState("2.5");

  const [arithOp, setArithOp] = useState<ArithmeticOp>("sum");
  const [aRaw, setARaw] = useState("");
  const [aUnit, setAUnit] = useState<WeightUnitId>("g");
  const [bRaw, setBRaw] = useState("");
  const [bUnit, setBUnit] = useState<WeightUnitId>("oz");
  const [resultUnit, setResultUnit] = useState<WeightUnitId>("kg");

  const kilograms = useMemo(() => {
    const raw = editSide === "from" ? fromRaw : toRaw;
    const unit = editSide === "from" ? fromUnit : toUnit;
    if (raw.trim() === "") return null;
    const n = parseNonNegativeNumber(raw);
    if (n === null) return null;
    return toKilograms(n, unit);
  }, [editSide, fromRaw, fromUnit, toRaw, toUnit]);

  const gridValues = useMemo(() => {
    if (kilograms === null) return null;
    return allWeightFromKilograms(kilograms);
  }, [kilograms]);

  const multFactor = useMemo(() => {
    if (multMode === "half") return 0.5;
    if (multMode === "double") return 2;
    if (multMode === "five") return 5;
    return parsePositiveNumber(customMultRaw);
  }, [customMultRaw, multMode]);

  const baseKg = useMemo(() => {
    if (fromRaw.trim() === "") return null;
    const n = parseNonNegativeNumber(fromRaw);
    if (n === null) return null;
    return toKilograms(n, fromUnit);
  }, [fromRaw, fromUnit]);

  const scaledKg = useMemo(() => {
    if (baseKg === null || multFactor === null) return null;
    return baseKg * multFactor;
  }, [baseKg, multFactor]);

  const scaledDisplay = useMemo(() => {
    if (scaledKg === null) return null;
    const map = new Map<string, string>();
    for (const id of [...new Set<WeightUnitId>([fromUnit, ...WEIGHT_SCALE_OUTPUT])]) {
      const v = fromKilograms(scaledKg, id);
      map.set(id, v !== null ? formatConverted(v) : "");
    }
    return map;
  }, [scaledKg, fromUnit]);

  const onFromValueChange = (raw: string) => {
    setFromRaw(raw);
    setEditSide("from");
    const n = parseNonNegativeNumber(raw);
    if (n === null) {
      if (raw.trim() === "") setToRaw("");
      return;
    }
    const converted = convertWeight(n, fromUnit, toUnit);
    if (converted !== null) setToRaw(formatConverted(converted));
    pushKixtDataLayer(kixtConvertEvent("input", "weight", { field: "from" }));
  };

  const onToValueChange = (raw: string) => {
    setToRaw(raw);
    setEditSide("to");
    const n = parseNonNegativeNumber(raw);
    if (n === null) {
      if (raw.trim() === "") setFromRaw("");
      return;
    }
    const converted = convertWeight(n, toUnit, fromUnit);
    if (converted !== null) setFromRaw(formatConverted(converted));
    pushKixtDataLayer(kixtConvertEvent("input", "weight", { field: "to" }));
  };

  const onFromUnitChange = (id: string) => {
    const next = id as WeightUnitId;
    if (kilograms !== null) {
      const v = fromKilograms(kilograms, next);
      if (v !== null) setFromRaw(formatConverted(v));
    }
    setFromUnit(next);
    pushKixtDataLayer(kixtConvertEvent("input", "weight", { unit_select: "from" }));
  };

  const onToUnitChange = (id: string) => {
    const next = id as WeightUnitId;
    setToUnit(next);
    if (kilograms !== null) {
      const v = fromKilograms(kilograms, next);
      if (v !== null) setToRaw(formatConverted(v));
    }
    pushKixtDataLayer(kixtConvertEvent("input", "weight", { unit_select: "to" }));
  };

  const swap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromRaw(toRaw);
    setToRaw(fromRaw);
    setEditSide(editSide === "from" ? "to" : "from");
    pushKixtDataLayer(kixtConvertEvent("swap", "weight"));
  };

  const clearAll = () => {
    setFromRaw("");
    setToRaw("");
    pushKixtDataLayer(kixtConvertEvent("clear", "weight"));
  };

  const applyPreset = (id: WeightPresetId) => {
    const preset = WEIGHT_PRESETS[id];
    setFromUnit(preset.unit);
    setFromRaw(preset.value);
    setEditSide("from");
    const n = parseInputNumber(preset.value);
    if (n !== null) {
      const c = convertWeight(n, preset.unit, toUnit);
      if (c !== null) setToRaw(formatConverted(c));
    }
    pushKixtDataLayer(kixtConvertEvent("preset", "weight", { preset_id: id }));
  };

  const copyValue = async (key: string, text: string) => {
    setCopyError(!(await copy(key, text)));
    pushKixtDataLayer(kixtConvertEvent("copy", "weight", { key }));
  };

  const useGridAsSource = (unitId: string, value: string) => {
    if (!value.trim()) return;
    setFromUnit(unitId as WeightUnitId);
    onFromValueChange(value);
  };

  const fromInvalid = fromRaw.trim() !== "" && (isInvalidInputRaw(fromRaw) || isNegativeOrInvalidInput(fromRaw));
  const toInvalid = toRaw.trim() !== "" && (isInvalidInputRaw(toRaw) || isNegativeOrInvalidInput(toRaw));
  const customMultInvalid = multMode === "custom" && isNonPositiveOrInvalidInput(customMultRaw);

  const arithmeticResult = useMemo(() => {
    const na = parseNonNegativeNumber(aRaw);
    const nb = parseNonNegativeNumber(bRaw);
    if (na === null || nb === null) return "";
    const total = weightSumDifference(na, aUnit, nb, bUnit, arithOp);
    if (total === null) return "";
    const out = fromKilograms(total, resultUnit);
    return out !== null ? formatConverted(out) : "";
  }, [aRaw, aUnit, arithOp, bRaw, bUnit, resultUnit]);

  const renderUnitRow = (id: WeightUnitId, value: string, highlight: boolean) => (
    <li key={id} className="min-w-0">
      <div
        className={cn(
          "flex min-w-0 items-center gap-2 rounded-xl border px-3 py-2",
          highlight ? "border-sky-500/35 bg-sky-500/10" : "border-slate-800 bg-slate-900/50",
          !value && "opacity-60",
        )}
      >
        <button
          type="button"
          disabled={!value}
          onClick={() => useGridAsSource(id, value)}
          className="min-w-0 flex-1 text-left"
          title={t.weight.useAsSource}
        >
          <span className="block truncate text-[11px] text-slate-500">
            <span className="text-sky-300/90">{unitSymbol(lang, id)}</span>
            <span className="mx-1 text-slate-600">·</span>
            <span className="truncate">{unitLabel(lang, id)}</span>
          </span>
          <span className="mt-0.5 block text-base font-semibold tabular-nums text-white">{value || "—"}</span>
        </button>
        <button
          type="button"
          disabled={!value}
          onClick={() => copyValue(`grid-${id}`, value)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-700/80 text-slate-400 hover:border-sky-500/40 disabled:opacity-40"
          aria-label={copiedKey === `grid-${id}` ? t.converter.copied : t.converter.copy}
        >
          {copiedKey === `grid-${id}` ? <Check className="h-4 w-4 text-sky-300" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
    </li>
  );

  return (
    <div className="space-y-8">
      <section className="space-y-4" aria-labelledby="wt-main">
        <SectionBlock title={t.weight.mainTitle} id="wt-main">
          <p className="text-xs text-slate-500">{t.weight.massNote}</p>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{t.weight.presetsTitle}</p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(WEIGHT_PRESETS) as WeightPresetId[]).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => applyPreset(id)}
                className="min-h-10 rounded-full border border-slate-700 bg-slate-900/50 px-3 py-2 text-xs text-slate-300 hover:border-sky-500/40 sm:text-sm"
              >
                {t.weight[PRESET_LABEL_KEY[id]]}
              </button>
            ))}
            <button type="button" onClick={clearAll} className="min-h-10 rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-400">
              {t.converter.clear}
            </button>
          </div>
          <p className="text-xs text-slate-500">{t.weight.presetsHint}</p>
        </SectionBlock>

        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-end">
          <ValueField
            value={fromRaw}
            onChange={onFromValueChange}
            invalid={fromInvalid}
            invalidText={isNegativeOrInvalidInput(fromRaw) ? t.weight.negativeNotAllowed : t.weight.invalidInput}
            select={<UnitSelect label={t.weight.fromUnit} unitId={fromUnit} options={WEIGHT_UNIT_IDS} onChange={onFromUnitChange} />}
          />
          <button
            type="button"
            onClick={swap}
            aria-label={t.weight.swapAria}
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-sky-500/35 bg-sky-500/15 text-sky-200 md:mb-1"
          >
            <ArrowLeftRight className="h-5 w-5" />
          </button>
          <ValueField
            value={toRaw}
            onChange={onToValueChange}
            invalid={toInvalid}
            invalidText={isNegativeOrInvalidInput(toRaw) ? t.weight.negativeNotAllowed : t.weight.invalidInput}
            select={<UnitSelect label={t.weight.toUnit} unitId={toUnit} options={WEIGHT_UNIT_IDS} onChange={onToUnitChange} />}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={!toRaw}
            onClick={() => copyValue("main-to", toRaw)}
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-700 px-4 py-2 text-sm disabled:opacity-40"
          >
            <Copy className="h-4 w-4" />
            {copiedKey === "main-to" ? t.converter.copied : t.converter.copy}
          </button>
          {gridValues ? (
            <button
              type="button"
              onClick={() => {
                const lines = WEIGHT_UNIT_IDS.map((id) => {
                  const v = gridValues.get(id);
                  return v ? `${unitSymbol(lang, id)}: ${v}` : null;
                })
                  .filter(Boolean)
                  .join("\n");
                void copyValue("main-all", lines);
              }}
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-700 px-4 py-2 text-sm"
            >
              <Copy className="h-4 w-4" />
              {copiedKey === "main-all" ? t.converter.copied : t.converter.copyAll}
            </button>
          ) : null}
        </div>
        {copyError ? <p className="text-xs text-rose-400/90">{t.weight.copyFailed}</p> : null}
      </section>

      <section aria-labelledby="wt-grid">
        <h2 id="wt-grid" className="text-sm font-semibold text-white">
          {t.weight.allUnitsTitle}
        </h2>
        <p className="mt-1 text-xs text-slate-500">{t.weight.useAsSource}</p>
        <h3 className="mt-4 text-xs font-semibold uppercase text-slate-500">{t.weight.metricTitle}</h3>
        <p className="text-xs text-slate-600">{t.weight.metricHint}</p>
        <ul className="mt-2 grid gap-2 sm:grid-cols-2">{WEIGHT_METRIC.map((id) => renderUnitRow(id, gridValues?.get(id) ?? "", true))}</ul>
        <h3 className="mt-4 text-xs font-semibold uppercase text-slate-500">{t.weight.imperialTitle}</h3>
        <p className="text-xs text-slate-600">{t.weight.imperialHint}</p>
        <ul className="mt-2 grid gap-2 sm:grid-cols-3">{WEIGHT_IMPERIAL.map((id) => renderUnitRow(id, gridValues?.get(id) ?? "", true))}</ul>
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/30 p-4 sm:p-5" aria-labelledby="wt-scale">
        <div className="flex items-start gap-3">
          <Package className="mt-0.5 h-5 w-5 text-sky-400" aria-hidden />
          <SectionBlock title={t.weight.scalingTitle} id="wt-scale">
            <p className="text-xs text-slate-500">{t.weight.scalingHint}</p>
          </SectionBlock>
        </div>
        <p className="text-xs text-slate-400">
          {t.weight.scalingBase}:{" "}
          <span className="font-medium tabular-nums text-white">
            {fromRaw.trim() && !fromInvalid ? `${fromRaw} ${unitSymbol(lang, fromUnit)}` : "—"}
          </span>
        </p>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["half", t.weight.scaleHalf],
              ["double", t.weight.scaleDouble],
              ["five", t.weight.scaleFive],
            ] as const
          ).map(([mode, label]) => (
            <button
              key={mode}
              type="button"
              onClick={() => {
                setMultMode(mode);
                pushKixtDataLayer(kixtConvertEvent("input", "weight", { scale_mode: mode }));
              }}
              className={cn(
                "min-h-11 rounded-full border px-4 py-2 text-sm font-medium",
                multMode === mode ? "border-sky-400/45 bg-sky-500/15 text-sky-100" : "border-slate-800 text-slate-400",
              )}
            >
              {label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setMultMode("custom")}
            className={cn(
              "min-h-11 rounded-full border px-4 py-2 text-sm",
              multMode === "custom" ? "border-sky-400/45 bg-sky-500/15 text-sky-100" : "border-slate-800 text-slate-400",
            )}
          >
            {t.weight.scaleCustom}
          </button>
        </div>
        {multMode === "custom" ? (
          <label className="block max-w-xs">
            <span className="text-xs text-slate-400">{t.weight.multiplierLabel}</span>
            <input
              type="text"
              inputMode="decimal"
              value={customMultRaw}
              onChange={(e) => setCustomMultRaw(e.target.value)}
              className={cn(
                "mt-1 min-h-11 w-full rounded-lg border bg-slate-950/60 px-3 text-lg tabular-nums text-white",
                customMultInvalid ? "border-rose-500/50" : "border-slate-700",
              )}
            />
            {customMultInvalid ? <p className="mt-1 text-xs text-rose-400/90">{t.weight.nonPositiveMultiplier}</p> : null}
          </label>
        ) : null}
        <p className="text-xs font-medium text-sky-200/80">{t.weight.scaledResult}</p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {[fromUnit, ...WEIGHT_SCALE_OUTPUT.filter((id) => id !== fromUnit)].map((id) => (
            <li key={id} className="rounded-xl border border-sky-500/25 bg-sky-500/10 px-3 py-2">
              <span className="text-[11px] text-sky-200/80">{unitLabel(lang, id)}</span>
              <p className="text-lg font-semibold tabular-nums text-white">
                {scaledDisplay?.get(id) ?? "—"} <span className="text-sm text-sky-300/90">{unitSymbol(lang, id)}</span>
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/30 p-4 sm:p-5" aria-labelledby="wt-arith">
        <SectionBlock title={t.weight.arithmeticTitle} id="wt-arith">
          <p className="text-xs text-slate-500">{t.weight.arithmeticHint}</p>
        </SectionBlock>
        <ArithOpButtons arithOp={arithOp} setArithOp={setArithOp} sum={t.weight.sum} diff={t.weight.difference} />
        <div className="grid gap-3 sm:grid-cols-2">
          <ArithRow label={t.weight.valueA} value={aRaw} onChange={setARaw} unit={aUnit} onUnit={setAUnit} hint={t.weight.negativeNotAllowed} />
          <ArithRow label={t.weight.valueB} value={bRaw} onChange={setBRaw} unit={bUnit} onUnit={setBUnit} hint={t.weight.negativeNotAllowed} />
        </div>
        <UnitSelect label={t.weight.resultIn} unitId={resultUnit} options={WEIGHT_UNIT_IDS} onChange={(id) => setResultUnit(id as WeightUnitId)} />
        <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-3">
          <p className="text-xs text-sky-200/80">{t.converter.result}</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-white">
            {arithmeticResult ? (
              <>
                {arithmeticResult} <span className="text-lg text-sky-200/90">{unitSymbol(lang, resultUnit)}</span>
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
            invalid ? "border-rose-500/50" : "border-slate-700 focus:border-sky-500/50",
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

function ArithOpButtons({
  arithOp,
  setArithOp,
  sum,
  diff,
}: {
  arithOp: ArithmeticOp;
  setArithOp: (v: ArithmeticOp) => void;
  sum: string;
  diff: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => {
          setArithOp("sum");
          pushKixtDataLayer(kixtConvertEvent("arithmetic", "weight", { op: "sum" }));
        }}
        className={cn(
          "inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 py-2 text-sm",
          arithOp === "sum" ? "border-sky-400/45 bg-sky-500/15 text-sky-100" : "border-slate-800 text-slate-400",
        )}
      >
        <Plus className="h-4 w-4" />
        {sum}
      </button>
      <button
        type="button"
        onClick={() => {
          setArithOp("diff");
          pushKixtDataLayer(kixtConvertEvent("arithmetic", "weight", { op: "diff" }));
        }}
        className={cn(
          "inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 py-2 text-sm",
          arithOp === "diff" ? "border-sky-400/45 bg-sky-500/15 text-sky-100" : "border-slate-800 text-slate-400",
        )}
      >
        <Minus className="h-4 w-4" />
        {diff}
      </button>
    </div>
  );
}

function ArithRow({
  label,
  value,
  onChange,
  unit,
  onUnit,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  unit: WeightUnitId;
  onUnit: (u: WeightUnitId) => void;
  hint: string;
}) {
  const { t } = useI18n();
  const invalid = value.trim() !== "" && isNegativeOrInvalidInput(value);
  return (
    <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/40 p-3">
      <UnitSelect label={label} unitId={unit} options={WEIGHT_UNIT_IDS} onChange={(id) => onUnit(id as WeightUnitId)} />
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
      {invalid ? <p className="text-xs text-rose-400/90">{hint}</p> : null}
    </div>
  );
}