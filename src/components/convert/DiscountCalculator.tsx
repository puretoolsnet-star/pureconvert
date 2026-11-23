"use client";

import { useMemo, useState } from "react";

import { ActionBar, NumField, ResultRow } from "@/components/convert/PercentCalculator";
import { useCopyFeedback } from "@/components/convert/use-copy-feedback";
import { useI18n } from "@/i18n/context";
import { kixtConvertEvent, pushKixtDataLayer } from "@/lib/analytics/kixt-gtm";
import { cn } from "@/lib/cn";
import {
  applyDiscount,
  applyMarkup,
  DISCOUNT_PERCENT_PRESETS,
  DISCOUNT_SAMPLES,
  recoverPriceBeforePercent,
  type DiscountMode,
  type FindBaseVariant,
} from "@/lib/convert/discounts";
import { formatConverted, parseInputNumber } from "@/lib/convert/format";

export function DiscountCalculator() {
  const { t } = useI18n();
  const { copiedKey, copy } = useCopyFeedback();
  const [copyError, setCopyError] = useState(false);
  const [mode, setMode] = useState<DiscountMode>("discount");
  const [findVariant, setFindVariant] = useState<FindBaseVariant>("afterDiscount");

  const [listPrice, setListPrice] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [percent, setPercent] = useState("");

  const discountResults = useMemo(() => {
    const p = parseInputNumber(listPrice);
    const pct = parseInputNumber(percent);
    if (p === null || pct === null) return null;
    const { discountAmount, finalPrice } = applyDiscount(p, pct);
    return {
      amount: formatConverted(discountAmount),
      final: formatConverted(finalPrice),
      savings: formatConverted(discountAmount),
    };
  }, [listPrice, percent]);

  const markupResults = useMemo(() => {
    const p = parseInputNumber(basePrice);
    const pct = parseInputNumber(percent);
    if (p === null || pct === null) return null;
    const { markupAmount, finalPrice } = applyMarkup(p, pct);
    return {
      amount: formatConverted(markupAmount),
      final: formatConverted(finalPrice),
    };
  }, [basePrice, percent]);

  const findResults = useMemo(() => {
    const p = parseInputNumber(currentPrice);
    const pct = parseInputNumber(percent);
    if (p === null || pct === null) return null;
    const recovered = recoverPriceBeforePercent(p, pct, findVariant);
    if (recovered === "invalid") return "invalid" as const;
    return { original: formatConverted(recovered) };
  }, [currentPrice, percent, findVariant]);

  const formula =
    mode === "discount"
      ? t.discounts.formulaDiscount
      : mode === "markup"
        ? t.discounts.formulaMarkup
        : findVariant === "afterDiscount"
          ? t.discounts.formulaFindDiscount
          : t.discounts.formulaFindMarkup;

  const loadSample = () => {
    const s = DISCOUNT_SAMPLES[mode];
    if (mode === "discount") {
      setListPrice(s.price ?? "");
      setPercent(s.percent ?? "");
    } else if (mode === "markup") {
      setBasePrice(s.price ?? "");
      setPercent(s.percent ?? "");
    } else {
      setCurrentPrice(s.price ?? "");
      setPercent(s.percent ?? "");
      setFindVariant("afterDiscount");
    }
    pushKixtDataLayer(kixtConvertEvent("sample", "discounts", { mode }));
  };

  const clearAll = () => {
    setListPrice("");
    setBasePrice("");
    setCurrentPrice("");
    setPercent("");
    pushKixtDataLayer(kixtConvertEvent("clear", "discounts"));
  };

  const setModeKeep = (next: DiscountMode) => {
    setMode(next);
    pushKixtDataLayer(kixtConvertEvent("mode_switch", "discounts", { mode: next }));
  };

  const applyPreset = (preset: number) => {
    setPercent(String(preset));
    pushKixtDataLayer(kixtConvertEvent("preset", "discounts", { percent: preset, mode }));
  };

  const copyText = async (key: string, text: string) => {
    if (!text) return;
    setCopyError(!(await copy(key, text)));
    pushKixtDataLayer(kixtConvertEvent("copy", "discounts", { key }));
  };

  const modes: { id: DiscountMode; label: string }[] = [
    { id: "discount", label: t.discounts.modeDiscount },
    { id: "markup", label: t.discounts.modeMarkup },
    { id: "findBase", label: t.discounts.modeFindBase },
  ];

  return (
    <div className="space-y-6">
      <ActionBar onSample={loadSample} onClear={clearAll} />
      <p className="text-xs text-slate-500">{t.discounts.sampleHint}</p>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label={t.converter.mode}>
        {modes.map((m) => (
          <button
            key={m.id}
            type="button"
            role="tab"
            aria-selected={mode === m.id}
            onClick={() => setModeKeep(m.id)}
            className={cn(
              "min-h-11 rounded-full border px-3 py-2 text-xs font-medium sm:text-sm",
              mode === m.id ? "border-sky-400/45 bg-sky-500/15 text-sky-100" : "border-slate-800 text-slate-400",
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      <p className="rounded-xl border border-slate-800/80 bg-slate-900/30 px-3 py-2 text-xs text-slate-400">{formula}</p>

      {mode === "discount" && (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <NumField
              label={t.discounts.labelOriginalPrice}
              value={listPrice}
              onChange={setListPrice}
              inputKey="disc-list"
              invalidMessage={t.discounts.invalidInput}
              analyticsSubcategory="discounts"
            />
            <NumField
              label={t.discounts.labelPercent}
              value={percent}
              onChange={setPercent}
              inputKey="disc-pct"
              invalidMessage={t.discounts.invalidInput}
              analyticsSubcategory="discounts"
            />
          </div>
          <div className="space-y-2">
            <p className="text-xs text-slate-500">{t.discounts.presets}</p>
            <div className="flex flex-wrap gap-2">
              {DISCOUNT_PERCENT_PRESETS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => applyPreset(n)}
                  className={cn(
                    "min-h-10 min-w-[3.25rem] rounded-full border px-3 py-2 text-sm tabular-nums",
                    percent === String(n)
                      ? "border-sky-400/45 bg-sky-500/15 text-sky-100"
                      : "border-slate-800 text-slate-400",
                  )}
                >
                  {n}%
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <ResultRow
              label={t.discounts.resultDiscountAmount}
              value={discountResults?.amount ?? ""}
              copyKey="disc-amt"
              copiedKey={copiedKey}
              onCopy={copyText}
            />
            <ResultRow
              label={t.discounts.resultFinalPrice}
              value={discountResults?.final ?? ""}
              copyKey="disc-final"
              copiedKey={copiedKey}
              onCopy={copyText}
            />
            {discountResults?.savings ? (
              <p className="text-sm text-emerald-300/90">
                {t.discounts.savings}: {discountResults.savings}
              </p>
            ) : null}
          </div>
        </>
      )}

      {mode === "markup" && (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <NumField
              label={t.discounts.labelBasePrice}
              value={basePrice}
              onChange={setBasePrice}
              inputKey="mark-base"
              invalidMessage={t.discounts.invalidInput}
              analyticsSubcategory="discounts"
            />
            <NumField
              label={t.discounts.labelPercent}
              value={percent}
              onChange={setPercent}
              inputKey="mark-pct"
              invalidMessage={t.discounts.invalidInput}
              analyticsSubcategory="discounts"
            />
          </div>
          <p className="text-xs leading-relaxed text-slate-400">{t.discounts.markupExplain}</p>
          <div className="space-y-3">
            <ResultRow
              label={t.discounts.resultMarkupAmount}
              value={markupResults?.amount ?? ""}
              copyKey="mark-amt"
              copiedKey={copiedKey}
              onCopy={copyText}
            />
            <ResultRow
              label={t.discounts.resultFinalPrice}
              value={markupResults?.final ?? ""}
              copyKey="mark-final"
              copiedKey={copiedKey}
              onCopy={copyText}
            />
          </div>
        </>
      )}

      {mode === "findBase" && (
        <>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setFindVariant("afterDiscount");
                pushKixtDataLayer(kixtConvertEvent("mode_switch", "discounts", { findVariant: "afterDiscount" }));
              }}
              className={cn(
                "min-h-11 rounded-full border px-3 py-2 text-xs sm:text-sm",
                findVariant === "afterDiscount"
                  ? "border-sky-400/45 bg-sky-500/15 text-sky-100"
                  : "border-slate-800 text-slate-400",
              )}
            >
              {t.discounts.findAfterDiscount}
            </button>
            <button
              type="button"
              onClick={() => {
                setFindVariant("afterMarkup");
                pushKixtDataLayer(kixtConvertEvent("mode_switch", "discounts", { findVariant: "afterMarkup" }));
              }}
              className={cn(
                "min-h-11 rounded-full border px-3 py-2 text-xs sm:text-sm",
                findVariant === "afterMarkup"
                  ? "border-sky-400/45 bg-sky-500/15 text-sky-100"
                  : "border-slate-800 text-slate-400",
              )}
            >
              {t.discounts.findAfterMarkup}
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <NumField
              label={t.discounts.labelCurrentPrice}
              value={currentPrice}
              onChange={setCurrentPrice}
              inputKey="find-cur"
              invalidMessage={t.discounts.invalidInput}
              analyticsSubcategory="discounts"
            />
            <NumField
              label={t.discounts.labelPercent}
              value={percent}
              onChange={setPercent}
              inputKey="find-pct"
              invalidMessage={t.discounts.invalidInput}
              analyticsSubcategory="discounts"
            />
          </div>
          {findResults === "invalid" ? (
            <p className="text-sm text-rose-400/90">
              {findVariant === "afterDiscount" ? t.discounts.errDiscount100 : t.discounts.errMarkupMinus100}
            </p>
          ) : (
            <ResultRow
              label={t.discounts.resultOriginalPrice}
              value={findResults?.original ?? ""}
              copyKey="find-orig"
              copiedKey={copiedKey}
              onCopy={copyText}
            />
          )}
        </>
      )}

      {copyError ? <p className="text-xs text-rose-400/90">{t.discounts.copyFailed}</p> : null}
    </div>
  );
}