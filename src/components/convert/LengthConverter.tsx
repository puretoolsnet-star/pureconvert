"use client";

import { ArrowLeftRight, Check, Copy, Minus, Plus } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

import { UnitSelect } from "@/components/convert/UnitSelect";
import { useCopyFeedback } from "@/components/convert/use-copy-feedback";
import { useI18n } from "@/i18n/context";
import { unitLabel, unitSymbol } from "@/i18n/tools/get-copy";
import { kixtConvertEvent, pushKixtDataLayer } from "@/lib/analytics/kixt-gtm";
import { formatConverted, isInvalidInputRaw, parseInputNumber } from "@/lib/convert/format";
import {
  allLengthFromMeters,
  convertLength,
  fromMeters,
  LENGTH_PRESETS,
  LENGTH_UNIT_IDS,
  type LengthPresetId,
  type LengthUnitId,
  toMeters,
} from "@/lib/convert/length";
import { cn } from "@/lib/cn";

const METRIC: LengthUnitId[] = ["nm", "um", "mm", "cm", "m", "km"];
const IMPERIAL: LengthUnitId[] = ["in", "ft", "yd", "mi", "nmi"];

type EditSide = "from" | "to";
type ArithmeticOp = "sum" | "diff";

const PRESET_LABEL_KEY: Record<LengthPresetId, keyof import("@/i18n/types").Dictionary["length"]> = {
  height: "presetHeight",
  run: "presetRun",
  sea: "presetSea",
  micro: "presetMicro",
};

export function LengthConverter() {
  const { lang, t } = useI18n();
  const { copiedKey, copy } = useCopyFeedback();

  const [fromUnit, setFromUnit] = useState<LengthUnitId>("m");
  const [toUnit, setToUnit] = useState<LengthUnitId>("ft");
  const [fromRaw, setFromRaw] = useState("");
  const [toRaw, setToRaw] = useState("");
  const [editSide, setEditSide] = useState<EditSide>("from");
  const [copyError, setCopyError] = useState(false);

  const [arithOp, setArithOp] = useState<ArithmeticOp>("sum");
  const [aRaw, setARaw] = useState("");
  const [aUnit, setAUnit] = useState<LengthUnitId>("m");
  const [bRaw, setBRaw] = useState("");
  const [bUnit, setBUnit] = useState<LengthUnitId>("cm");
  const [resultUnit, setResultUnit] = useState<LengthUnitId>("m");

  const meters = useMemo(() => {
    if (editSide === "from") {
      const n = parseInputNumber(fromRaw);
      if (n === null) return null;
      return toMeters(n, fromUnit);
    }
    const n = parseInputNumber(toRaw);
    if (n === null) return null;
    return toMeters(n, toUnit);
  }, [editSide, fromRaw, fromUnit, toRaw, toUnit]);

  const gridValues = useMemo(() => {
    if (meters === null) return null;
    return allLengthFromMeters(meters);
  }, [meters]);

  const onFromValueChange = (raw: string) => {
    setFromRaw(raw);
    setEditSide("from");
    const n = parseInputNumber(raw);
    if (n === null) {
      if (raw.trim() === "") setToRaw("");
      return;
    }
    const converted = convertLength(n, fromUnit, toUnit);
    if (converted !== null) setToRaw(formatConverted(converted));
    pushKixtDataLayer(kixtConvertEvent("input", "length", { field: "from", unit: fromUnit }));
  };

  const onToValueChange = (raw: string) => {
    setToRaw(raw);
    setEditSide("to");
    const n = parseInputNumber(raw);
    if (n === null) {
      if (raw.trim() === "") setFromRaw("");
      return;
    }
    const converted = convertLength(n, toUnit, fromUnit);
    if (converted !== null) setFromRaw(formatConverted(converted));
    pushKixtDataLayer(kixtConvertEvent("input", "length", { field: "to", unit: toUnit }));
  };

  const onFromUnitChange = (id: string) => {
    const next = id as LengthUnitId;
    if (meters !== null) {
      const newFrom = fromMeters(meters, next);
      if (newFrom !== null) setFromRaw(formatConverted(newFrom));
    }
    setFromUnit(next);
    pushKixtDataLayer(kixtConvertEvent("input", "length", { unit_select: "from", unit: next }));
  };

  const onToUnitChange = (id: string) => {
    const next = id as LengthUnitId;
    setToUnit(next);
    if (meters !== null) {
      const toN = fromMeters(meters, next);
      if (toN !== null) setToRaw(formatConverted(toN));
    }
    pushKixtDataLayer(kixtConvertEvent("input", "length", { unit_select: "to", unit: next }));
  };

  const swap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromRaw(toRaw);
    setToRaw(fromRaw);
    setEditSide(editSide === "from" ? "to" : "from");
    pushKixtDataLayer(kixtConvertEvent("swap", "length", { from: toUnit, to: fromUnit }));
  };

  const clearAll = () => {
    setFromRaw("");
    setToRaw("");
    setEditSide("from");
    pushKixtDataLayer(kixtConvertEvent("clear", "length"));
  };

  const applyPreset = (id: LengthPresetId) => {
    const preset = LENGTH_PRESETS[id];
    setFromUnit(preset.unit);
    setFromRaw(preset.value);
    setEditSide("from");
    const n = parseInputNumber(preset.value);
    if (n !== null) {
      const converted = convertLength(n, preset.unit, toUnit);
      if (converted !== null) setToRaw(formatConverted(converted));
    }
    pushKixtDataLayer(kixtConvertEvent("preset", "length", { preset_id: id }));
  };

  const copyValue = async (key: string, text: string) => {
    const ok = await copy(key, text);
    if (!ok) setCopyError(true);
    else setCopyError(false);
    pushKixtDataLayer(kixtConvertEvent("copy", "length", { key }));
  };

  const useGridAsSource = (unitId: string, value: string) => {
    if (!value.trim()) return;
    setFromUnit(unitId as LengthUnitId);
    onFromValueChange(value);
  };

  const fromInvalid = fromRaw.trim() !== "" && isInvalidInputRaw(fromRaw);
  const toInvalid = toRaw.trim() !== "" && isInvalidInputRaw(toRaw);

  const arithmeticResult = useMemo(() => {
    const na = parseInputNumber(aRaw);
    const nb = parseInputNumber(bRaw);
    if (na === null || nb === null) return "";
    const ma = toMeters(na, aUnit);
    const mb = toMeters(nb, bUnit);
    if (ma === null || mb === null) return "";
    const total = arithOp === "sum" ? ma + mb : ma - mb;
    const out = fromMeters(total, resultUnit);
    return out !== null ? formatConverted(out) : "";
  }, [aRaw, aUnit, arithOp, bRaw, bUnit, resultUnit]);

  const renderGridGroup = (title: string, ids: LengthUnitId[]) => (
    <div className="mt-4 first:mt-0">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
      <ul className="grid gap-2 sm:grid-cols-2">
        {ids.map((id) => {
          const value = gridValues?.get(id) ?? "";
          const dim = !value;
          return (
            <li key={id} className="min-w-0">
              <div
                className={cn(
                  "flex min-w-0 items-center gap-2 rounded-xl border px-3 py-2",
                  dim ? "border-slate-800/60 bg-slate-900/30" : "border-slate-800 bg-slate-900/50",
                )}
              >
                <button
                  type="button"
                  onClick={() => !dim && useGridAsSource(id, value)}
                  className="min-w-0 flex-1 text-left"
                  title={t.length.useAsSource}
                  disabled={dim}
                >
                  <span className="block truncate text-[11px] font-medium text-slate-500">
                    <span className="text-sky-300/90">{unitSymbol(lang, id)}</span>
                    <span className="mx-1 text-slate-600">·</span>
                    {unitLabel(lang, id)}
                  </span>
                  <span className="mt-0.5 block truncate text-base font-medium tabular-nums text-white">
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
        })}
      </ul>
    </div>
  );

  return (
    <div className="space-y-8">
      <section className="space-y-4" aria-labelledby="length-main-heading">
        <SectionBlock title={t.length.mainTitle} id="length-main-heading">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{t.length.presetsTitle}</p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(LENGTH_PRESETS) as LengthPresetId[]).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => applyPreset(id)}
                className="min-h-10 max-w-full rounded-full border border-slate-700 bg-slate-900/50 px-3 py-2 text-left text-xs text-slate-300 hover:border-sky-500/40 hover:text-sky-100 sm:text-sm"
              >
                {t.length[PRESET_LABEL_KEY[id]]}
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
          <p className="text-xs text-slate-500">{t.length.presetsHint}</p>
        </SectionBlock>

        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-end">
          <ValueField
            value={fromRaw}
            onChange={onFromValueChange}
            invalid={fromInvalid}
            invalidText={t.length.invalidInput}
            select={
              <UnitSelect
                label={t.length.fromUnit}
                unitId={fromUnit}
                options={LENGTH_UNIT_IDS}
                onChange={onFromUnitChange}
              />
            }
          />

          <button
            type="button"
            onClick={swap}
            aria-label={t.length.swapAria}
            className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-sky-500/35 bg-sky-500/15 text-sky-200 hover:bg-sky-500/25 md:mb-1"
          >
            <ArrowLeftRight className="h-5 w-5" aria-hidden />
            <span className="sr-only">{t.length.swap}</span>
          </button>

          <ValueField
            value={toRaw}
            onChange={onToValueChange}
            invalid={toInvalid}
            invalidText={t.length.invalidInput}
            select={
              <UnitSelect
                label={t.length.toUnit}
                unitId={toUnit}
                options={LENGTH_UNIT_IDS}
                onChange={onToUnitChange}
              />
            }
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <CopyChip
            disabled={!toRaw}
            copied={copiedKey === "main-to"}
            onCopy={() => copyValue("main-to", toRaw)}
            label={t.converter.copy}
            copiedLabel={t.converter.copied}
            text={`${toRaw} ${unitSymbol(lang, toUnit)}`}
          />
          {gridValues ? (
            <CopyChip
              disabled={false}
              copied={copiedKey === "main-all"}
              onCopy={() => {
                const lines = LENGTH_UNIT_IDS.map((id) => {
                  const v = gridValues.get(id);
                  if (!v) return null;
                  return `${unitSymbol(lang, id)}: ${v}`;
                })
                  .filter(Boolean)
                  .join("\n");
                void copyValue("main-all", lines);
              }}
              label={t.converter.copyAll}
              copiedLabel={t.converter.copied}
            />
          ) : null}
        </div>
        {copyError ? (
          <p className="text-xs text-rose-400/90" role="status">
            {t.length.copyFailed}
          </p>
        ) : null}
      </section>

      <section aria-labelledby="length-grid-heading">
        <h2 id="length-grid-heading" className="mb-3 text-sm font-semibold text-sky-200/90">
          {t.length.allUnitsTitle}
        </h2>
        <p className="mb-4 text-xs text-slate-500">{t.length.useAsSource}</p>
        {renderGridGroup(t.length.metricLabel, METRIC)}
        <div className="mt-4">{renderGridGroup(t.length.imperialLabel, IMPERIAL)}</div>
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/30 p-4 sm:p-5" aria-labelledby="length-arith">
        <SectionBlock title={t.length.arithmeticTitle} id="length-arith">
          <p className="text-xs text-slate-500">{t.length.arithmeticHint}</p>
        </SectionBlock>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setArithOp("sum");
              pushKixtDataLayer(kixtConvertEvent("arithmetic", "length", { op: "sum" }));
            }}
            className={cn(
              "inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 py-2 text-sm",
              arithOp === "sum"
                ? "border-sky-400/45 bg-sky-500/15 text-sky-100"
                : "border-slate-800 text-slate-400",
            )}
          >
            <Plus className="h-4 w-4" />
            {t.length.sum}
          </button>
          <button
            type="button"
            onClick={() => {
              setArithOp("diff");
              pushKixtDataLayer(kixtConvertEvent("arithmetic", "length", { op: "diff" }));
            }}
            className={cn(
              "inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 py-2 text-sm",
              arithOp === "diff"
                ? "border-sky-400/45 bg-sky-500/15 text-sky-100"
                : "border-slate-800 text-slate-400",
            )}
          >
            <Minus className="h-4 w-4" />
            {t.length.difference}
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <ArithRow label={t.length.valueA} value={aRaw} onChange={setARaw} unit={aUnit} onUnit={setAUnit} />
          <ArithRow label={t.length.valueB} value={bRaw} onChange={setBRaw} unit={bUnit} onUnit={setBUnit} />
        </div>
        <UnitSelect
          label={t.length.resultIn}
          unitId={resultUnit}
          options={LENGTH_UNIT_IDS}
          onChange={(id) => setResultUnit(id as LengthUnitId)}
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

function SectionBlock({
  title,
  id,
  children,
}: {
  title: string;
  id?: string;
  children?: ReactNode;
}) {
  return (
    <div>
      <h2 id={id} className="text-sm font-semibold text-white">
        {title}
      </h2>
      {children ? <div className="mt-3 space-y-3">{children}</div> : null}
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

function ArithRow({
  label,
  value,
  onChange,
  unit,
  onUnit,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  unit: LengthUnitId;
  onUnit: (u: LengthUnitId) => void;
}) {
  const { t } = useI18n();
  const invalid = isInvalidInputRaw(value);
  return (
    <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/40 p-3">
      <UnitSelect label={label} unitId={unit} options={LENGTH_UNIT_IDS} onChange={(id) => onUnit(id as LengthUnitId)} />
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
    </div>
  );
}

function CopyChip({
  onCopy,
  disabled,
  copied,
  label,
  copiedLabel,
  text,
}: {
  onCopy: () => void;
  disabled: boolean;
  copied: boolean;
  label: string;
  copiedLabel: string;
  text?: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onCopy}
      className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300 disabled:opacity-40 hover:border-sky-500/40"
    >
      <Copy className="h-4 w-4" />
      {copied ? copiedLabel : label}
      {text ? <span className="sr-only">{text}</span> : null}
    </button>
  );
}