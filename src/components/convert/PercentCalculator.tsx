"use client";

import { Check, Copy, Minus, Plus, TrendingDown, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";

import { useCopyFeedback } from "@/components/convert/use-copy-feedback";
import { useI18n } from "@/i18n/context";
import { kixtConvertEvent, pushKixtDataLayer } from "@/lib/analytics/kixt-gtm";
import { cn } from "@/lib/cn";
import { formatConverted, isInvalidInputRaw, parseInputNumber } from "@/lib/convert/format";
import { PERCENT_SAMPLES, percentChange, percentOfNumber, shareAsPercent, type PercentMode } from "@/lib/convert/percentages";
import type { SubcategoryId } from "@/lib/tools/routes";

export function PercentCalculator() {
  const { t } = useI18n();
  const { copiedKey, copy } = useCopyFeedback();
  const [mode, setMode] = useState<PercentMode>("percentOf");
  const [copyError, setCopyError] = useState(false);

  const [baseValue, setBaseValue] = useState("");
  const [percent, setPercent] = useState("");
  const [part, setPart] = useState("");
  const [whole, setWhole] = useState("");
  const [fromVal, setFromVal] = useState("");
  const [toVal, setToVal] = useState("");

  const percentOf = useMemo(() => {
    const x = parseInputNumber(baseValue);
    const p = parseInputNumber(percent);
    if (x === null || p === null) return null;
    const slice = percentOfNumber(x, p);
    return {
      slice: formatConverted(slice),
      plus: formatConverted(x + slice),
      minus: formatConverted(x - slice),
    };
  }, [baseValue, percent]);

  const share = useMemo(() => {
    const a = parseInputNumber(part);
    const b = parseInputNumber(whole);
    if (whole.trim() !== "" && b === 0) return "zero" as const;
    if (a === null || b === null) return null;
    const pct = shareAsPercent(a, b);
    if (pct === null) return "zero" as const;
    return `${formatConverted(pct)}%`;
  }, [part, whole]);

  const change = useMemo(() => {
    const a = parseInputNumber(fromVal);
    const b = parseInputNumber(toVal);
    if (a === null || b === null) return null;
    const r = percentChange(a, b);
    if (r === "zeroBase") return "zeroBase" as const;
    if (r === null) return null;
    const sign = r.percent > 0 ? "up" : r.percent < 0 ? "down" : "flat";
    return {
      percent: `${formatConverted(r.percent)}%`,
      diff: formatConverted(r.absoluteDiff),
      sign,
    };
  }, [fromVal, toVal]);

  const loadSample = () => {
    const s = PERCENT_SAMPLES[mode];
    if (mode === "percentOf") {
      setBaseValue(s.base ?? "");
      setPercent(s.percent ?? "");
    } else if (mode === "whatPercent") {
      setPart(s.part ?? "");
      setWhole(s.whole ?? "");
    } else {
      setFromVal(s.from ?? "");
      setToVal(s.to ?? "");
    }
    pushKixtDataLayer(kixtConvertEvent("sample", "percentages", { mode }));
  };

  const clearAll = () => {
    setBaseValue("");
    setPercent("");
    setPart("");
    setWhole("");
    setFromVal("");
    setToVal("");
    pushKixtDataLayer(kixtConvertEvent("clear", "percentages"));
  };

  const setModeKeep = (next: PercentMode) => {
    setMode(next);
    pushKixtDataLayer(kixtConvertEvent("mode_switch", "percentages", { mode: next }));
  };

  const copyText = async (key: string, text: string) => {
    if (!text) return;
    setCopyError(!(await copy(key, text)));
    pushKixtDataLayer(kixtConvertEvent("copy", "percentages", { key }));
  };

  const modes: { id: PercentMode; label: string }[] = [
    { id: "percentOf", label: t.percentages.modePercentOf },
    { id: "whatPercent", label: t.percentages.modeWhatPercent },
    { id: "change", label: t.percentages.modeChange },
  ];

  const formula =
    mode === "percentOf" ? t.percentages.formulaPercentOf : mode === "whatPercent" ? t.percentages.formulaShare : t.percentages.formulaChange;

  return (
    <div className="space-y-6">
      <ActionBar onSample={loadSample} onClear={clearAll} />
      <p className="text-xs text-slate-500">{t.percentages.sampleHint}</p>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label={t.converter.mode}>
        {modes.map((m) => (
          <button
            key={m.id}
            type="button"
            role="tab"
            aria-selected={mode === m.id}
            onClick={() => setModeKeep(m.id)}
            className={cn(
              "min-h-11 shrink-0 rounded-full border px-3 py-2 text-xs font-medium sm:text-sm",
              mode === m.id ? "border-sky-400/45 bg-sky-500/15 text-sky-100" : "border-slate-800 text-slate-400",
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      <p className="text-center text-sm text-slate-400">{formula}</p>

      {mode === "percentOf" && (
        <FieldGrid>
          <NumField label={t.percentages.labelValue} value={baseValue} onChange={setBaseValue} inputKey="pct-base" />
          <NumField label={t.percentages.labelPercent} value={percent} onChange={setPercent} inputKey="pct-p" />
        </FieldGrid>
      )}
      {mode === "whatPercent" && (
        <FieldGrid>
          <NumField label={t.percentages.labelPart} value={part} onChange={setPart} inputKey="pct-part" />
          <NumField label={t.percentages.labelWhole} value={whole} onChange={setWhole} inputKey="pct-whole" />
        </FieldGrid>
      )}
      {mode === "change" && (
        <FieldGrid>
          <NumField label={t.percentages.labelFrom} value={fromVal} onChange={setFromVal} inputKey="pct-from" />
          <NumField label={t.percentages.labelTo} value={toVal} onChange={setToVal} inputKey="pct-to" />
        </FieldGrid>
      )}

      {mode === "percentOf" && (
        <div className="space-y-3">
          <ResultRow
            label={t.percentages.resultPercentOf}
            value={percentOf?.slice ?? ""}
            copyKey="res-slice"
            copiedKey={copiedKey}
            onCopy={copyText}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <ResultRow
              label={t.percentages.resultPlus}
              value={percentOf?.plus ?? ""}
              copyKey="res-plus"
              copiedKey={copiedKey}
              onCopy={copyText}
              icon={Plus}
            />
            <ResultRow
              label={t.percentages.resultMinus}
              value={percentOf?.minus ?? ""}
              copyKey="res-minus"
              copiedKey={copiedKey}
              onCopy={copyText}
              icon={Minus}
            />
          </div>
        </div>
      )}

      {mode === "whatPercent" && (
        <>
          {share === "zero" ? (
            <p className="text-sm text-rose-400/90" role="alert">
              {t.percentages.divideByZero}
            </p>
          ) : null}
          <ResultRow
            label={t.percentages.resultShare}
            value={share && share !== "zero" ? share : ""}
            copyKey="res-share"
            copiedKey={copiedKey}
            onCopy={copyText}
          />
        </>
      )}

      {mode === "change" && (
        <div className="space-y-3">
          {change === "zeroBase" ? (
            <p className="text-sm text-rose-400/90" role="alert">
              {t.percentages.zeroBaseChange}
            </p>
          ) : null}
          {change && change !== "zeroBase" ? (
            <div
              className={cn(
                "flex items-center gap-2 rounded-xl border px-4 py-3",
                change.sign === "up" && "border-emerald-500/30 bg-emerald-500/10",
                change.sign === "down" && "border-rose-500/30 bg-rose-500/10",
                change.sign === "flat" && "border-slate-700 bg-slate-900/40",
              )}
            >
              {change.sign === "up" ? (
                <TrendingUp className="h-5 w-5 text-emerald-300" aria-hidden />
              ) : change.sign === "down" ? (
                <TrendingDown className="h-5 w-5 text-rose-300" aria-hidden />
              ) : null}
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-400">{t.percentages.resultChange}</p>
                <p className="text-2xl font-semibold tabular-nums text-white">{change.percent}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {change.sign === "up"
                    ? t.percentages.labelIncrease
                    : change.sign === "down"
                      ? t.percentages.labelDecrease
                      : t.percentages.unchanged}
                </p>
              </div>
              <button
                type="button"
                disabled={!change.percent}
                onClick={() => copyText("res-change", change.percent)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-700/80"
                aria-label={copiedKey === "res-change" ? t.converter.copied : t.converter.copy}
              >
                {copiedKey === "res-change" ? <Check className="h-4 w-4 text-sky-300" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          ) : (
            <ResultBox label={t.percentages.resultChange} value="" />
          )}
          <ResultRow
            label={t.percentages.absoluteDiff}
            value={change && change !== "zeroBase" ? change.diff : ""}
            copyKey="res-diff"
            copiedKey={copiedKey}
            onCopy={copyText}
          />
        </div>
      )}

      {copyError ? <p className="text-xs text-rose-400/90">{t.percentages.copyFailed}</p> : null}
    </div>
  );
}

function FieldGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2">{children}</div>;
}

function ActionBar({ onSample, onClear }: { onSample: () => void; onClear: () => void }) {
  const { t } = useI18n();
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={onSample}
        className="min-h-10 rounded-full border border-sky-500/35 bg-sky-500/10 px-4 py-2 text-sm text-sky-100"
      >
        {t.converter.sample}
      </button>
      <button type="button" onClick={onClear} className="min-h-10 rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-400">
        {t.converter.clear}
      </button>
    </div>
  );
}

function NumField({
  label,
  value,
  onChange,
  inputKey,
  invalidMessage,
  analyticsSubcategory = "percentages",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  inputKey?: string;
  invalidMessage?: string;
  analyticsSubcategory?: SubcategoryId;
}) {
  const { t } = useI18n();
  const invalid = value.trim() !== "" && isInvalidInputRaw(value);
  const invalidText = invalidMessage ?? t.percentages.invalidInput;
  return (
    <label className="block rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-2">
      <span className="text-xs text-slate-400">{label}</span>
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          if (inputKey) pushKixtDataLayer(kixtConvertEvent("input", analyticsSubcategory, { field: inputKey }));
        }}
        placeholder={t.converter.enterValue}
        aria-invalid={invalid}
        className={cn(
          "mt-1 min-h-11 w-full bg-transparent text-lg tabular-nums text-white outline-none",
          invalid && "text-rose-200",
        )}
      />
      {invalid ? <span className="text-xs text-rose-400/90">{invalidText}</span> : null}
    </label>
  );
}

function ResultBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-3">
      <p className="text-xs text-sky-200/80">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-white">{value || "—"}</p>
    </div>
  );
}

function ResultRow({
  label,
  value,
  copyKey,
  copiedKey,
  onCopy,
  icon: Icon,
}: {
  label: string;
  value: string;
  copyKey: string;
  copiedKey: string | null;
  onCopy: (key: string, text: string) => void;
  icon?: typeof Plus;
}) {
  const { t } = useI18n();
  return (
    <div className="flex items-center gap-3 rounded-xl border border-sky-500/25 bg-sky-500/5 px-4 py-3">
      {Icon ? <Icon className="h-4 w-4 shrink-0 text-sky-300/80" aria-hidden /> : null}
      <div className="min-w-0 flex-1">
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-xl font-semibold tabular-nums text-white">{value || "—"}</p>
      </div>
      <button
        type="button"
        disabled={!value}
        onClick={() => onCopy(copyKey, value)}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-700/80 disabled:opacity-40"
        aria-label={copiedKey === copyKey ? t.converter.copied : t.converter.copy}
      >
        {copiedKey === copyKey ? <Check className="h-4 w-4 text-sky-300" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}

export { NumField, ResultBox, ActionBar, ResultRow };