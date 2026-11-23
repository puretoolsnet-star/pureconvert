"use client";

import { useMemo, useState } from "react";

import { ActionBar, NumField, ResultRow } from "@/components/convert/PercentCalculator";
import { useCopyFeedback } from "@/components/convert/use-copy-feedback";
import { useI18n } from "@/i18n/context";
import { kixtConvertEvent, pushKixtDataLayer } from "@/lib/analytics/kixt-gtm";
import { cn } from "@/lib/cn";
import { formatConverted, parseInputNumber } from "@/lib/convert/format";
import { PROPORTION_SAMPLE, solveProportionX } from "@/lib/convert/proportions";

export function ProportionCalculator() {
  const { t } = useI18n();
  const { copiedKey, copy } = useCopyFeedback();
  const [copyError, setCopyError] = useState(false);
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");

  const computed = useMemo(() => {
    const hasA = a.trim() !== "";
    const na = parseInputNumber(a);
    const nb = parseInputNumber(b);
    const nc = parseInputNumber(c);
    if (hasA && na === 0) return { kind: "zeroA" as const };
    if (na === null || nb === null || nc === null) return { kind: "incomplete" as const };
    const raw = solveProportionX(na, nb, nc);
    if (raw === "zeroA") return { kind: "zeroA" as const };
    const xFormatted = formatConverted(raw);
    return {
      kind: "ok" as const,
      na,
      nb,
      nc,
      x: xFormatted,
      crossLine: `${formatConverted(na)} × x = ${formatConverted(nb)} × ${formatConverted(nc)}`,
      solveLine: `x = (${formatConverted(nb)} × ${formatConverted(nc)}) ÷ ${formatConverted(na)} = ${xFormatted}`,
    };
  }, [a, b, c]);

  const loadSample = () => {
    setA(PROPORTION_SAMPLE.a);
    setB(PROPORTION_SAMPLE.b);
    setC(PROPORTION_SAMPLE.c);
    pushKixtDataLayer(kixtConvertEvent("sample", "proportions"));
  };

  const clearAll = () => {
    setA("");
    setB("");
    setC("");
    setCopyError(false);
    pushKixtDataLayer(kixtConvertEvent("clear", "proportions"));
  };

  const copyText = async (key: string, text: string) => {
    if (!text) return;
    setCopyError(!(await copy(key, text)));
    pushKixtDataLayer(kixtConvertEvent("copy", "proportions", { key }));
  };

  const fieldProps = {
    invalidMessage: t.proportions.invalidInput,
    analyticsSubcategory: "proportions" as const,
  };

  return (
    <div className="space-y-6">
      <ActionBar onSample={loadSample} onClear={clearAll} />
      <p className="text-xs text-slate-500">{t.proportions.sampleHint}</p>

      <div
        className="rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3 text-center text-lg font-medium tabular-nums text-sky-100 sm:text-xl"
        aria-live="polite"
      >
        {t.proportions.equation}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <NumField label={t.proportions.labelA} value={a} onChange={setA} inputKey="prop-a" {...fieldProps} />
        <NumField label={t.proportions.labelB} value={b} onChange={setB} inputKey="prop-b" {...fieldProps} />
        <NumField label={t.proportions.labelC} value={c} onChange={setC} inputKey="prop-c" {...fieldProps} />
      </div>

      <ol className="space-y-3 text-sm">
        <li className="rounded-xl border border-slate-800/80 bg-slate-900/30 px-3 py-3">
          <p className="text-xs font-medium text-slate-400">{t.proportions.stepCrossTitle}</p>
          <p className="mt-1 tabular-nums text-slate-200">{t.proportions.stepCrossFormula}</p>
        </li>
        <li
          className={cn(
            "rounded-xl border px-3 py-3",
            computed.kind === "ok"
              ? "border-sky-500/25 bg-sky-500/5"
              : "border-slate-800/80 bg-slate-900/30",
          )}
        >
          <p className="text-xs font-medium text-slate-400">{t.proportions.stepSubstituteTitle}</p>
          <p className="mt-1 tabular-nums text-slate-200">
            {computed.kind === "ok" ? computed.crossLine : "—"}
          </p>
        </li>
        <li
          className={cn(
            "rounded-xl border px-3 py-3",
            computed.kind === "ok"
              ? "border-sky-500/25 bg-sky-500/5"
              : "border-slate-800/80 bg-slate-900/30",
          )}
        >
          <p className="text-xs font-medium text-slate-400">{t.proportions.stepSolveTitle}</p>
          <p className="mt-1 tabular-nums text-slate-300">{t.proportions.stepSolveFormula}</p>
          {computed.kind === "ok" ? (
            <p className="mt-2 tabular-nums text-white">{computed.solveLine}</p>
          ) : null}
        </li>
      </ol>

      {computed.kind === "zeroA" ? (
        <p className="text-sm text-rose-400/90" role="alert">
          {t.proportions.errDivideByZero}
        </p>
      ) : null}

      <ResultRow
        label={t.proportions.labelX}
        value={computed.kind === "ok" ? computed.x : ""}
        copyKey="prop-x"
        copiedKey={copiedKey}
        onCopy={copyText}
      />

      {copyError ? <p className="text-xs text-rose-400/90">{t.proportions.copyFailed}</p> : null}
    </div>
  );
}