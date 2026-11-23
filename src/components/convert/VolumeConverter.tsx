"use client";

import { ArrowLeftRight, Check, Copy, Minus, Plus, Scale } from "lucide-react";
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
  allVolumeFromLiters,
  convertVolume,
  fromLiters,
  toLiters,
  VOLUME_EXTRA,
  VOLUME_PRESETS,
  VOLUME_PRIORITY,
  VOLUME_UNIT_IDS,
  volumeSumDifference,
  type VolumePresetId,
  type VolumeUnitId,
} from "@/lib/convert/volume";
import { cn } from "@/lib/cn";

type EditSide = "from" | "to";
type ArithmeticOp = "sum" | "diff";
type MultMode = "half" | "double" | "triple" | "custom";

const PRESET_LABEL_KEY: Record<VolumePresetId, keyof import("@/i18n/types").Dictionary["volume"]> = {
  recipe: "presetRecipe",
  pint: "presetPint",
  quart: "presetQuart",
  gallon: "presetGallon",
  cubic: "presetCubic",
};

const SCALE_OUTPUT: VolumeUnitId[] = ["ml", "l", "cup"];

export function VolumeConverter() {
  const { lang, t } = useI18n();
  const { copiedKey, copy } = useCopyFeedback();

  const [fromUnit, setFromUnit] = useState<VolumeUnitId>("l");
  const [toUnit, setToUnit] = useState<VolumeUnitId>("cup");
  const [fromRaw, setFromRaw] = useState("");
  const [toRaw, setToRaw] = useState("");
  const [editSide, setEditSide] = useState<EditSide>("from");
  const [copyError, setCopyError] = useState(false);

  const [multMode, setMultMode] = useState<MultMode>("double");
  const [customMultRaw, setCustomMultRaw] = useState("1.5");

  const [arithOp, setArithOp] = useState<ArithmeticOp>("sum");
  const [aRaw, setARaw] = useState("");
  const [aUnit, setAUnit] = useState<VolumeUnitId>("cup");
  const [bRaw, setBRaw] = useState("");
  const [bUnit, setBUnit] = useState<VolumeUnitId>("ml");
  const [resultUnit, setResultUnit] = useState<VolumeUnitId>("l");

  const liters = useMemo(() => {
    if (editSide === "from") {
      if (fromRaw.trim() === "") return null;
      const n = parseNonNegativeNumber(fromRaw);
      if (n === null) return null;
      return toLiters(n, fromUnit);
    }
    if (toRaw.trim() === "") return null;
    const n = parseNonNegativeNumber(toRaw);
    if (n === null) return null;
    return toLiters(n, toUnit);
  }, [editSide, fromRaw, fromUnit, toRaw, toUnit]);

  const gridValues = useMemo(() => {
    if (liters === null) return null;
    return allVolumeFromLiters(liters);
  }, [liters]);

  const multFactor = useMemo(() => {
    if (multMode === "half") return 0.5;
    if (multMode === "double") return 2;
    if (multMode === "triple") return 3;
    return parsePositiveNumber(customMultRaw);
  }, [customMultRaw, multMode]);

  const baseLiters = useMemo(() => {
    if (fromRaw.trim() === "") return null;
    const n = parseNonNegativeNumber(fromRaw);
    if (n === null) return null;
    return toLiters(n, fromUnit);
  }, [fromRaw, fromUnit]);

  const scaledLiters = useMemo(() => {
    if (baseLiters === null || multFactor === null) return null;
    return baseLiters * multFactor;
  }, [baseLiters, multFactor]);

  const scaledDisplay = useMemo(() => {
    if (scaledLiters === null) return null;
    const map = new Map<string, string>();
    for (const id of SCALE_OUTPUT) {
      const v = fromLiters(scaledLiters, id);
      map.set(id, v !== null ? formatConverted(v) : "");
    }
    const inFrom = fromLiters(scaledLiters, fromUnit);
    map.set(fromUnit, inFrom !== null ? formatConverted(inFrom) : "");
    return map;
  }, [scaledLiters, fromUnit]);

  const onFromValueChange = (raw: string) => {
    setFromRaw(raw);
    setEditSide("from");
    const n = parseNonNegativeNumber(raw);
    if (n === null) {
      if (raw.trim() === "") setToRaw("");
      return;
    }
    const converted = convertVolume(n, fromUnit, toUnit);
    if (converted !== null) setToRaw(formatConverted(converted));
    pushKixtDataLayer(kixtConvertEvent("input", "volume", { field: "from" }));
  };

  const onToValueChange = (raw: string) => {
    setToRaw(raw);
    setEditSide("to");
    const n = parseNonNegativeNumber(raw);
    if (n === null) {
      if (raw.trim() === "") setFromRaw("");
      return;
    }
    const converted = convertVolume(n, toUnit, fromUnit);
    if (converted !== null) setFromRaw(formatConverted(converted));
    pushKixtDataLayer(kixtConvertEvent("input", "volume", { field: "to" }));
  };

  const onFromUnitChange = (id: string) => {
    const next = id as VolumeUnitId;
    if (liters !== null) {
      const newFrom = fromLiters(liters, next);
      if (newFrom !== null) setFromRaw(formatConverted(newFrom));
    }
    setFromUnit(next);
    pushKixtDataLayer(kixtConvertEvent("input", "volume", { unit_select: "from", unit: next }));
  };

  const onToUnitChange = (id: string) => {
    const next = id as VolumeUnitId;
    setToUnit(next);
    if (liters !== null) {
      const toN = fromLiters(liters, next);
      if (toN !== null) setToRaw(formatConverted(toN));
    }
    pushKixtDataLayer(kixtConvertEvent("input", "volume", { unit_select: "to", unit: next }));
  };

  const swap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromRaw(toRaw);
    setToRaw(fromRaw);
    setEditSide(editSide === "from" ? "to" : "from");
    pushKixtDataLayer(kixtConvertEvent("swap", "volume"));
  };

  const clearAll = () => {
    setFromRaw("");
    setToRaw("");
    pushKixtDataLayer(kixtConvertEvent("clear", "volume"));
  };

  const applyPreset = (id: VolumePresetId) => {
    const preset = VOLUME_PRESETS[id];
    setFromUnit(preset.unit);
    setFromRaw(preset.value);
    setEditSide("from");
    const n = parseInputNumber(preset.value);
    if (n !== null) {
      const converted = convertVolume(n, preset.unit, toUnit);
      if (converted !== null) setToRaw(formatConverted(converted));
    }
    pushKixtDataLayer(kixtConvertEvent("preset", "volume", { preset_id: id }));
  };

  const copyValue = async (key: string, text: string) => {
    const ok = await copy(key, text);
    setCopyError(!ok);
    pushKixtDataLayer(kixtConvertEvent("copy", "volume", { key }));
  };

  const useGridAsSource = (unitId: string, value: string) => {
    if (!value.trim()) return;
    setFromUnit(unitId as VolumeUnitId);
    onFromValueChange(value);
  };

  const setScale = (mode: MultMode) => {
    setMultMode(mode);
    pushKixtDataLayer(kixtConvertEvent("input", "volume", { scale_mode: mode }));
  };

  const fromInvalid = fromRaw.trim() !== "" && (isInvalidInputRaw(fromRaw) || isNegativeOrInvalidInput(fromRaw));
  const toInvalid = toRaw.trim() !== "" && (isInvalidInputRaw(toRaw) || isNegativeOrInvalidInput(toRaw));
  const customMultInvalid = multMode === "custom" && isNonPositiveOrInvalidInput(customMultRaw);

  const arithmeticResult = useMemo(() => {
    const na = parseNonNegativeNumber(aRaw);
    const nb = parseNonNegativeNumber(bRaw);
    if (na === null || nb === null) return "";
    const total = volumeSumDifference(na, aUnit, nb, bUnit, arithOp);
    if (total === null) return "";
    const out = fromLiters(total, resultUnit);
    return out !== null ? formatConverted(out) : "";
  }, [aRaw, aUnit, arithOp, bRaw, bUnit, resultUnit]);

  const renderUnitRow = (id: VolumeUnitId, value: string, variant: "priority" | "default") => (
    <li key={id} className="min-w-0">
      <div
        className={cn(
          "flex min-w-0 items-center gap-2 rounded-xl border px-3 py-2",
          variant === "priority" ? "border-sky-500/35 bg-sky-500/10" : "border-slate-800 bg-slate-900/50",
          !value && "opacity-60",
        )}
      >
        <button
          type="button"
          onClick={() => value && useGridAsSource(id, value)}
          className="min-w-0 flex-1 text-left"
          title={t.volume.useAsSource}
          disabled={!value}
        >
          <span className="block truncate text-[11px] font-medium text-slate-500">
            <span className="text-sky-300/90">{unitSymbol(lang, id)}</span>
            <span className="mx-1 text-slate-600">·</span>
            <span className="truncate">{unitLabel(lang, id)}</span>
          </span>
          <span className="mt-0.5 block truncate text-base font-semibold tabular-nums text-white">{value || "—"}</span>
        </button>
        <button
          type="button"
          disabled={!value}
          onClick={() => copyValue(`grid-${id}`, value)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-700/80 text-slate-400 hover:border-sky-500/40 hover:text-sky-200 disabled:opacity-40"
          aria-label={copiedKey === `grid-${id}` ? t.converter.copied : t.converter.copy}
        >
          {copiedKey === `grid-${id}` ? <Check className="h-4 w-4 text-sky-300" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
    </li>
  );

  return (
    <div className="space-y-8">
      <section className="space-y-4" aria-labelledby="vol-main-heading">
        <SectionBlock title={t.volume.mainTitle} id="vol-main-heading">
          <p className="text-xs text-slate-500">{t.volume.usKitchenNote}</p>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{t.volume.presetsTitle}</p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(VOLUME_PRESETS) as VolumePresetId[]).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => applyPreset(id)}
                className="min-h-10 max-w-full rounded-full border border-slate-700 bg-slate-900/50 px-3 py-2 text-xs text-slate-300 hover:border-sky-500/40 sm:text-sm"
              >
                {t.volume[PRESET_LABEL_KEY[id]]}
              </button>
            ))}
            <button
              type="button"
              onClick={clearAll}
              className="min-h-10 rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-400"
            >
              {t.converter.clear}
            </button>
          </div>
          <p className="text-xs text-slate-500">{t.volume.presetsHint}</p>
        </SectionBlock>

        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-end">
          <ValueField
            value={fromRaw}
            onChange={onFromValueChange}
            invalid={fromInvalid}
            invalidText={isNegativeOrInvalidInput(fromRaw) ? t.volume.negativeNotAllowed : t.volume.invalidInput}
            select={<UnitSelect label={t.volume.fromUnit} unitId={fromUnit} options={VOLUME_UNIT_IDS} onChange={onFromUnitChange} />}
          />
          <button
            type="button"
            onClick={swap}
            aria-label={t.volume.swapAria}
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-sky-500/35 bg-sky-500/15 text-sky-200 md:mb-1"
          >
            <ArrowLeftRight className="h-5 w-5" />
          </button>
          <ValueField
            value={toRaw}
            onChange={onToValueChange}
            invalid={toInvalid}
            invalidText={isNegativeOrInvalidInput(toRaw) ? t.volume.negativeNotAllowed : t.volume.invalidInput}
            select={<UnitSelect label={t.volume.toUnit} unitId={toUnit} options={VOLUME_UNIT_IDS} onChange={onToUnitChange} />}
          />
        </div>
        <CopyRow copiedKey={copiedKey} copyError={copyError} t={t} toRaw={toRaw} gridValues={gridValues} lang={lang} copyValue={copyValue} />
      </section>

      <section aria-labelledby="vol-priority-heading">
        <h2 id="vol-priority-heading" className="text-sm font-semibold text-sky-200/90">
          {t.volume.priorityTitle}
        </h2>
        <p className="mt-1 text-xs text-slate-500">{t.volume.priorityHint}</p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {VOLUME_PRIORITY.map((id) => renderUnitRow(id, gridValues?.get(id) ?? "", "priority"))}
        </ul>
      </section>

      <section aria-labelledby="vol-all-heading">
        <h2 id="vol-all-heading" className="text-sm font-semibold text-white">
          {t.volume.allUnitsTitle}
        </h2>
        <p className="mt-1 text-xs text-slate-500">{t.volume.useAsSource}</p>
        <h3 className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">{t.volume.extraUnitsLabel}</h3>
        <ul className="mt-2 grid gap-2 sm:grid-cols-2">
          {VOLUME_EXTRA.map((id) => renderUnitRow(id, gridValues?.get(id) ?? "", "default"))}
        </ul>
      </section>

      <section
        className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/30 p-4 sm:p-5"
        aria-labelledby="vol-scale-heading"
      >
        <div className="flex items-start gap-3">
          <Scale className="mt-0.5 h-5 w-5 text-sky-400" aria-hidden />
          <SectionBlock title={t.volume.scalingTitle} id="vol-scale-heading">
            <p className="text-xs text-slate-500">{t.volume.scalingHint}</p>
          </SectionBlock>
        </div>
        <p className="text-xs text-slate-400">
          {t.volume.scalingBase}:{" "}
          <span className="font-medium text-white tabular-nums">
            {fromRaw.trim() && !fromInvalid
              ? `${fromRaw} ${unitSymbol(lang, fromUnit)}`
              : "—"}
          </span>
        </p>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["half", t.volume.scaleHalf],
              ["double", t.volume.scaleDouble],
              ["triple", t.volume.scaleTriple],
            ] as const
          ).map(([mode, label]) => (
            <button
              key={mode}
              type="button"
              onClick={() => setScale(mode)}
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
            onClick={() => setScale("custom")}
            className={cn(
              "min-h-11 rounded-full border px-4 py-2 text-sm",
              multMode === "custom" ? "border-sky-400/45 bg-sky-500/15 text-sky-100" : "border-slate-800 text-slate-400",
            )}
          >
            {t.volume.scaleCustom}
          </button>
        </div>
        {multMode === "custom" ? (
          <label className="block">
            <span className="text-xs text-slate-400">{t.volume.multiplierLabel}</span>
            <input
              type="text"
              inputMode="decimal"
              value={customMultRaw}
              onChange={(e) => {
                setCustomMultRaw(e.target.value);
                pushKixtDataLayer(kixtConvertEvent("input", "volume", { scale_mode: "custom" }));
              }}
              className={cn(
                "mt-1 min-h-11 w-full max-w-xs rounded-lg border bg-slate-950/60 px-3 text-lg tabular-nums text-white",
                customMultInvalid ? "border-rose-500/50" : "border-slate-700",
              )}
            />
            {customMultInvalid ? (
              <p className="mt-1 text-xs text-rose-400/90">{t.volume.nonPositiveMultiplier}</p>
            ) : null}
          </label>
        ) : null}
        <p className="text-xs font-medium text-sky-200/80">{t.volume.scaledResult}</p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {[fromUnit, ...SCALE_OUTPUT.filter((id) => id !== fromUnit)].map((id) => (
            <li key={id} className="rounded-xl border border-sky-500/25 bg-sky-500/10 px-3 py-2">
              <span className="text-[11px] text-sky-200/80">{unitLabel(lang, id)}</span>
              <p className="text-lg font-semibold tabular-nums text-white">
                {scaledDisplay?.get(id) ?? "—"}{" "}
                <span className="text-sm text-sky-300/90">{unitSymbol(lang, id)}</span>
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/30 p-4 sm:p-5" aria-labelledby="vol-arith">
        <SectionBlock title={t.volume.arithmeticTitle} id="vol-arith">
          <p className="text-xs text-slate-500">{t.volume.arithmeticHint}</p>
        </SectionBlock>
        <ArithOpButtons arithOp={arithOp} setArithOp={setArithOp} t={t} />
        <div className="grid gap-3 sm:grid-cols-2">
          <ArithRow label={t.volume.valueA} value={aRaw} onChange={setARaw} unit={aUnit} onUnit={setAUnit} hint={t.volume.negativeNotAllowed} />
          <ArithRow label={t.volume.valueB} value={bRaw} onChange={setBRaw} unit={bUnit} onUnit={setBUnit} hint={t.volume.negativeNotAllowed} />
        </div>
        <UnitSelect label={t.volume.resultIn} unitId={resultUnit} options={VOLUME_UNIT_IDS} onChange={(id) => setResultUnit(id as VolumeUnitId)} />
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

function CopyRow({
  copiedKey,
  copyError,
  t,
  toRaw,
  gridValues,
  lang,
  copyValue,
}: {
  copiedKey: string | null;
  copyError: boolean;
  t: import("@/i18n/types").Dictionary;
  toRaw: string;
  gridValues: Map<string, string> | null;
  lang: import("@/i18n/locales").Lang;
  copyValue: (key: string, text: string) => void;
}) {
  return (
    <div>
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
              const lines = VOLUME_UNIT_IDS.map((id) => {
                const v = gridValues.get(id);
                if (!v) return null;
                return `${unitSymbol(lang, id)}: ${v}`;
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
      {copyError ? <p className="mt-2 text-xs text-rose-400/90">{t.volume.copyFailed}</p> : null}
    </div>
  );
}

function ArithOpButtons({
  arithOp,
  setArithOp,
  t,
}: {
  arithOp: ArithmeticOp;
  setArithOp: (v: ArithmeticOp) => void;
  t: import("@/i18n/types").Dictionary;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => {
          setArithOp("sum");
          pushKixtDataLayer(kixtConvertEvent("arithmetic", "volume", { op: "sum" }));
        }}
        className={cn(
          "inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 py-2 text-sm",
          arithOp === "sum" ? "border-sky-400/45 bg-sky-500/15 text-sky-100" : "border-slate-800 text-slate-400",
        )}
      >
        <Plus className="h-4 w-4" />
        {t.volume.sum}
      </button>
      <button
        type="button"
        onClick={() => {
          setArithOp("diff");
          pushKixtDataLayer(kixtConvertEvent("arithmetic", "volume", { op: "diff" }));
        }}
        className={cn(
          "inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 py-2 text-sm",
          arithOp === "diff" ? "border-sky-400/45 bg-sky-500/15 text-sky-100" : "border-slate-800 text-slate-400",
        )}
      >
        <Minus className="h-4 w-4" />
        {t.volume.difference}
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
  unit: VolumeUnitId;
  onUnit: (u: VolumeUnitId) => void;
  hint: string;
}) {
  const { t } = useI18n();
  const invalid = value.trim() !== "" && isNegativeOrInvalidInput(value);
  return (
    <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/40 p-3">
      <UnitSelect label={label} unitId={unit} options={VOLUME_UNIT_IDS} onChange={(id) => onUnit(id as VolumeUnitId)} />
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