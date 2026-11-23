"use client";

import { Check, Copy } from "lucide-react";
import { useMemo, useState } from "react";

import { ActionBar } from "@/components/convert/PercentCalculator";
import { useCopyFeedback } from "@/components/convert/use-copy-feedback";
import { useI18n } from "@/i18n/context";
import { kixtConvertEvent, pushKixtDataLayer } from "@/lib/analytics/kixt-gtm";
import { cn } from "@/lib/cn";
import {
  formatConverted,
  isInvalidInputRaw,
  parseInputNumber,
  parsePositiveNumber,
} from "@/lib/convert/format";
import {
  heightFromWidth as calcHeightFromWidth,
  RATIO_PRESETS,
  RATIO_SCALE_FACTORS,
  ratioDecimal,
  SAMPLE_RATIO,
  scaledResolutions,
  simplifyRatioParts,
  widthFromHeight as calcWidthFromHeight,
  type RatioPresetId,
} from "@/lib/convert/ratios-aspect";

type ScaleMode = "width" | "height";

const PRESET_KEY: Record<RatioPresetId, keyof import("@/i18n/types").Dictionary["ratios"]> = {
  widescreen: "presetWidescreen",
  classic: "presetClassic",
  square: "presetSquare",
  tall: "presetTall",
};

export function RatioAspectCalculator() {
  const { t } = useI18n();
  const { copiedKey, copy } = useCopyFeedback();

  const [ratioA, setRatioA] = useState("");
  const [ratioB, setRatioB] = useState("");
  const [scaleMode, setScaleMode] = useState<ScaleMode>("width");
  const [scaleWidth, setScaleWidth] = useState("");
  const [scaleHeight, setScaleHeight] = useState("");
  const [multRaw, setMultRaw] = useState("1");
  const [copyError, setCopyError] = useState(false);

  const a = useMemo(() => parsePositiveNumber(ratioA), [ratioA]);
  const b = useMemo(() => parsePositiveNumber(ratioB), [ratioB]);
  const ratioValid = a !== null && b !== null;

  const simplified = useMemo(() => {
    if (!ratioValid) return null;
    return simplifyRatioParts(a!, b!);
  }, [a, b, ratioValid]);

  const decimal = useMemo(() => {
    if (!ratioValid) return "";
    const d = ratioDecimal(a!, b!);
    return d !== null ? formatConverted(d) : "";
  }, [a, b, ratioValid]);

  const percentA = useMemo(() => {
    if (!ratioValid) return "";
    return `${formatConverted((a! / (a! + b!)) * 100)}%`;
  }, [a, b, ratioValid]);

  const derived = useMemo(() => {
    if (!ratioValid) return { heightFromWidth: "", widthFromHeight: "" };
    const w = parsePositiveNumber(scaleWidth);
    const h = parsePositiveNumber(scaleHeight);
    let heightFromWidth = "";
    let widthFromHeight = "";
    if (w !== null) {
      const out = calcHeightFromWidth(w, a!, b!);
      if (out !== null) heightFromWidth = formatConverted(out);
    }
    if (h !== null) {
      const out = calcWidthFromHeight(h, a!, b!);
      if (out !== null) widthFromHeight = formatConverted(out);
    }
    return { heightFromWidth, widthFromHeight };
  }, [a, b, ratioValid, scaleHeight, scaleWidth]);

  const mult = useMemo(() => parsePositiveNumber(multRaw), [multRaw]);

  const resolutionRows = useMemo(() => {
    if (!ratioValid) return [];
    return scaledResolutions(a!, b!, RATIO_SCALE_FACTORS);
  }, [a, b, ratioValid]);

  const customResolution = useMemo(() => {
    if (!ratioValid || mult === null) return null;
    const w = a! * mult;
    const h = b! * mult;
    return {
      width: formatConverted(w),
      height: formatConverted(h),
      label: `${formatConverted(w)}×${formatConverted(h)}`,
    };
  }, [a, b, mult, ratioValid]);

  const loadSample = () => {
    setRatioA(SAMPLE_RATIO.a);
    setRatioB(SAMPLE_RATIO.b);
    setScaleMode("width");
    setScaleWidth(SAMPLE_RATIO.width);
    setScaleHeight("");
    setMultRaw("120");
    pushKixtDataLayer(kixtConvertEvent("sample", "ratios-aspect"));
  };

  const clearAll = () => {
    setRatioA("");
    setRatioB("");
    setScaleWidth("");
    setScaleHeight("");
    setMultRaw("1");
    pushKixtDataLayer(kixtConvertEvent("clear", "ratios-aspect"));
  };

  const applyPreset = (id: RatioPresetId) => {
    const p = RATIO_PRESETS[id];
    setRatioA(p.a);
    setRatioB(p.b);
    setScaleWidth("");
    setScaleHeight("");
    pushKixtDataLayer(kixtConvertEvent("preset", "ratios-aspect", { preset_id: id }));
  };

  const copyText = async (key: string, text: string) => {
    setCopyError(!(await copy(key, text)));
    pushKixtDataLayer(kixtConvertEvent("copy", "ratios-aspect", { key }));
  };

  const aInvalid =
    ratioA.trim() !== "" && (isInvalidInputRaw(ratioA) || parsePositiveNumber(ratioA) === null);
  const bInvalid =
    ratioB.trim() !== "" && (isInvalidInputRaw(ratioB) || parsePositiveNumber(ratioB) === null);

  const simplifiedDisplay =
    simplified && ratioValid
      ? `${formatConverted(simplified.a)}∶${formatConverted(simplified.b)}`
      : "—";

  return (
    <div className="space-y-8">
      <ActionBar onSample={loadSample} onClear={clearAll} />
      <p className="text-xs text-slate-500">{t.ratios.sampleHint}</p>

      <section className="space-y-4" aria-labelledby="ratio-main">
        <h2 id="ratio-main" className="text-sm font-semibold text-white">
          {t.ratios.mainTitle}
        </h2>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{t.ratios.presetsTitle}</p>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(RATIO_PRESETS) as RatioPresetId[]).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => applyPreset(id)}
              className="min-h-10 rounded-full border border-slate-700 bg-slate-900/50 px-3 py-2 text-xs text-slate-300 hover:border-sky-500/40 sm:text-sm"
            >
              {t.ratios[PRESET_KEY[id]]}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500">{t.ratios.presetsHint}</p>

        <p className="text-sm text-slate-400">{t.ratios.ratioLabel}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <RatioField label={t.ratios.partA} value={ratioA} onChange={setRatioA} invalid={aInvalid} invalidText={t.ratios.nonPositiveA} />
          <RatioField label={t.ratios.partB} value={ratioB} onChange={setRatioB} invalid={bInvalid} invalidText={t.ratios.nonPositiveB} />
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <StatBox label={t.ratios.simplifiedLabel} value={simplifiedDisplay} />
          <StatBox label={t.ratios.decimalLabel} value={decimal || "—"} />
          <StatBox label={t.ratios.percentWidthLabel} value={percentA || "—"} />
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/30 p-4 sm:p-5" aria-labelledby="ratio-scale">
        <h2 id="ratio-scale" className="text-sm font-semibold text-white">
          {t.ratios.scaleLabel}
        </h2>
        <p className="text-xs text-slate-500">{t.ratios.scaleHint}</p>

        <div className="flex flex-wrap gap-2" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={scaleMode === "width"}
            onClick={() => {
              setScaleMode("width");
              setScaleHeight("");
              pushKixtDataLayer(kixtConvertEvent("scale_mode", "ratios-aspect", { mode: "width" }));
            }}
            className={cn(
              "min-h-11 rounded-full border px-4 py-2 text-sm",
              scaleMode === "width" ? "border-sky-400/45 bg-sky-500/15 text-sky-100" : "border-slate-800 text-slate-400",
            )}
          >
            {t.ratios.scaleFromWidth}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={scaleMode === "height"}
            onClick={() => {
              setScaleMode("height");
              setScaleWidth("");
              pushKixtDataLayer(kixtConvertEvent("scale_mode", "ratios-aspect", { mode: "height" }));
            }}
            className={cn(
              "min-h-11 rounded-full border px-4 py-2 text-sm",
              scaleMode === "height" ? "border-sky-400/45 bg-sky-500/15 text-sky-100" : "border-slate-800 text-slate-400",
            )}
          >
            {t.ratios.scaleFromHeight}
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {scaleMode === "width" ? (
            <>
              <RatioField
                label={t.ratios.width}
                value={scaleWidth}
                onChange={(v) => {
                  setScaleWidth(v);
                  pushKixtDataLayer(kixtConvertEvent("input", "ratios-aspect", { field: "width" }));
                }}
                invalid={scaleWidth.trim() !== "" && parsePositiveNumber(scaleWidth) === null}
                invalidText={t.ratios.invalidInput}
              />
              <StatBox label={t.ratios.computedHeight} value={derived.heightFromWidth || "—"} highlight />
            </>
          ) : (
            <>
              <RatioField
                label={t.ratios.height}
                value={scaleHeight}
                onChange={(v) => {
                  setScaleHeight(v);
                  pushKixtDataLayer(kixtConvertEvent("input", "ratios-aspect", { field: "height" }));
                }}
                invalid={scaleHeight.trim() !== "" && parsePositiveNumber(scaleHeight) === null}
                invalidText={t.ratios.invalidInput}
              />
              <StatBox label={t.ratios.computedWidth} value={derived.widthFromHeight || "—"} highlight />
            </>
          )}
        </div>
      </section>

      <section className="space-y-4" aria-labelledby="ratio-res">
        <h2 id="ratio-res" className="text-sm font-semibold text-white">
          {t.ratios.resolutionsTitle}
        </h2>
        <p className="text-xs text-slate-500">{t.ratios.resolutionsHint}</p>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {resolutionRows.map((row) => (
            <li key={row.label}>
              <ResolutionRow
                label={row.label}
                copied={copiedKey === `res-${row.label}`}
                onCopy={() => copyText(`res-${row.label}`, row.label)}
                onUseWidth={() => {
                  setScaleMode("width");
                  setScaleWidth(formatConverted(row.width));
                  setScaleHeight("");
                }}
                useTitle={t.ratios.useAsWidth}
              />
            </li>
          ))}
        </ul>

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3">
          <p className="text-xs font-medium text-slate-400">{t.ratios.multiplierTitle}</p>
          <p className="text-xs text-slate-500">{t.ratios.multiplierHint}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setMultRaw("0.5")}
              className="min-h-10 rounded-full border border-slate-700 px-3 text-sm text-slate-300"
            >
              {t.ratios.multHalf}
            </button>
            <button
              type="button"
              onClick={() => setMultRaw("1")}
              className="min-h-10 rounded-full border border-slate-700 px-3 text-sm text-slate-300"
            >
              1×
            </button>
            <button
              type="button"
              onClick={() => setMultRaw("2")}
              className="min-h-10 rounded-full border border-slate-700 px-3 text-sm text-slate-300"
            >
              {t.ratios.multDouble}
            </button>
          </div>
          <label className="mt-2 block text-xs text-slate-500">{t.ratios.multCustom}</label>
          <input
            type="text"
            inputMode="decimal"
            value={multRaw}
            onChange={(e) => setMultRaw(e.target.value)}
            className={cn(
              "mt-1 min-h-11 w-full max-w-xs rounded-lg border bg-slate-950/60 px-3 text-lg tabular-nums text-white",
              multRaw.trim() !== "" && parsePositiveNumber(multRaw) === null ? "border-rose-500/50" : "border-slate-700",
            )}
          />
          {customResolution ? (
            <div className="mt-3 flex items-center justify-between gap-2 rounded-lg border border-sky-500/25 bg-sky-500/10 px-3 py-2">
              <span className="font-semibold tabular-nums text-white">{customResolution.label}</span>
              <button
                type="button"
                onClick={() => copyText("custom-res", customResolution.label)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700/80"
                aria-label={t.ratios.copyDimensions}
              >
                {copiedKey === "custom-res" ? <Check className="h-4 w-4 text-sky-300" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          ) : null}
        </div>
      </section>
      {copyError ? <p className="text-xs text-rose-400/90">{t.ratios.copyFailed}</p> : null}
    </div>
  );
}

function RatioField({
  label,
  value,
  onChange,
  invalid,
  invalidText,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  invalid?: boolean;
  invalidText?: string;
}) {
  const { t } = useI18n();
  return (
    <label className="block space-y-1">
      <span className="text-xs text-slate-400">{label}</span>
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t.converter.enterValue}
        aria-invalid={invalid}
        className={cn(
          "min-h-12 w-full rounded-xl border bg-slate-900/60 px-4 text-lg tabular-nums text-white outline-none",
          invalid ? "border-rose-500/50" : "border-slate-700 focus:border-sky-500/50",
        )}
      />
      {invalid && invalidText ? <span className="text-xs text-rose-400/90">{invalidText}</span> : null}
    </label>
  );
}

function StatBox({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-xl border px-3 py-2",
        highlight ? "border-sky-500/35 bg-sky-500/10" : "border-slate-800 bg-slate-900/50",
      )}
    >
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className="mt-0.5 text-lg font-semibold tabular-nums text-white">{value}</p>
    </div>
  );
}

function ResolutionRow({
  label,
  copied,
  onCopy,
  onUseWidth,
  useTitle,
}: {
  label: string;
  copied: boolean;
  onCopy: () => void;
  onUseWidth: () => void;
  useTitle: string;
}) {
  const { t } = useI18n();
  return (
    <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/50 px-3 py-2">
      <button type="button" onClick={onUseWidth} className="min-w-0 flex-1 text-left font-semibold tabular-nums text-white" title={useTitle}>
        {label}
      </button>
      <button
        type="button"
        onClick={onCopy}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-700/80"
        aria-label={copied ? t.converter.copied : t.ratios.copyDimensions}
      >
        {copied ? <Check className="h-4 w-4 text-sky-300" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}