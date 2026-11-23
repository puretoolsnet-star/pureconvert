"use client";

import { ArrowLeftRight, Check, Copy, Radio, Timer } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

import { UnitSelect } from "@/components/convert/UnitSelect";
import { useCopyFeedback } from "@/components/convert/use-copy-feedback";
import { useI18n } from "@/i18n/context";
import { unitLabel, unitSymbol } from "@/i18n/tools/get-copy";
import { kixtConvertEvent, pushKixtDataLayer } from "@/lib/analytics/kixt-gtm";
import { cn } from "@/lib/cn";
import {
  allDataTransferFromBps,
  BYTE_RATE_KEYS,
  byteRatesFromBps,
  convertDataTransfer,
  DATA_TRANSFER_PRESETS,
  DATA_TRANSFER_UNIT_IDS,
  fileSizeToBytes,
  formatTransferDuration,
  fromBitsPerSecond,
  toBitsPerSecond,
  transferTimeSeconds,
  type ByteRateKey,
  type DataTransferPresetId,
  type DataTransferUnitId,
  type FileSizeUnit,
} from "@/lib/convert/data-transfer";
import {
  formatConverted,
  isInvalidInputRaw,
  isNegativeOrInvalidInput,
  parseInputNumber,
  parseNonNegativeNumber,
  parsePositiveNumber,
} from "@/lib/convert/format";

type EditSide = "from" | "to";

const PRESET_LABEL_KEY: Record<DataTransferPresetId, keyof import("@/i18n/types").Dictionary["dataTransfer"]> = {
  streaming: "presetStreaming",
  voice: "presetVoice",
  home: "presetHome",
  gigabit: "presetGigabit",
};

const BYTE_LABEL_KEY: Record<ByteRateKey, keyof import("@/i18n/types").Dictionary["dataTransfer"]> = {
  B_s: "rateB_s",
  KB_s: "rateKB_s",
  MB_s: "rateMB_s",
  GB_s: "rateGB_s",
};

export function DataTransferConverter() {
  const { lang, t } = useI18n();
  const { copiedKey, copy } = useCopyFeedback();

  const [fromUnit, setFromUnit] = useState<DataTransferUnitId>("Mbps");
  const [toUnit, setToUnit] = useState<DataTransferUnitId>("Kbps");
  const [fromRaw, setFromRaw] = useState("");
  const [toRaw, setToRaw] = useState("");
  const [editSide, setEditSide] = useState<EditSide>("from");
  const [copyError, setCopyError] = useState(false);

  const [fileSizeRaw, setFileSizeRaw] = useState("");
  const [fileSizeUnit, setFileSizeUnit] = useState<FileSizeUnit>("GB");
  const [xferSpeedRaw, setXferSpeedRaw] = useState("");
  const [xferSpeedUnit, setXferSpeedUnit] = useState<DataTransferUnitId>("Mbps");

  const bps = useMemo(() => {
    const raw = editSide === "from" ? fromRaw : toRaw;
    const unit = editSide === "from" ? fromUnit : toUnit;
    if (raw.trim() === "") return null;
    const n = parseNonNegativeNumber(raw);
    if (n === null) return null;
    return toBitsPerSecond(n, unit);
  }, [editSide, fromRaw, fromUnit, toRaw, toUnit]);

  const gridValues = useMemo(() => {
    if (bps === null) return null;
    return allDataTransferFromBps(bps);
  }, [bps]);

  const byteRates = useMemo(() => {
    if (bps === null) return null;
    return byteRatesFromBps(bps);
  }, [bps]);

  const transferEstimate = useMemo(() => {
    const size = parseNonNegativeNumber(fileSizeRaw);
    const speed = parsePositiveNumber(xferSpeedRaw);
    if (size === null || speed === null) return null;
    const fileBytes = fileSizeToBytes(size, fileSizeUnit);
    const rateBps = toBitsPerSecond(speed, xferSpeedUnit);
    if (rateBps === null || rateBps <= 0) return null;
    const sec = transferTimeSeconds(fileBytes, rateBps);
    if (sec === null) return null;
    return sec;
  }, [fileSizeRaw, fileSizeUnit, xferSpeedRaw, xferSpeedUnit]);

  const onFromValueChange = (raw: string) => {
    setFromRaw(raw);
    setEditSide("from");
    const n = parseNonNegativeNumber(raw);
    if (n === null) {
      if (raw.trim() === "") setToRaw("");
      return;
    }
    const converted = convertDataTransfer(n, fromUnit, toUnit);
    if (converted !== null) setToRaw(formatConverted(converted));
    pushKixtDataLayer(kixtConvertEvent("input", "data-transfer", { field: "from" }));
  };

  const onToValueChange = (raw: string) => {
    setToRaw(raw);
    setEditSide("to");
    const n = parseNonNegativeNumber(raw);
    if (n === null) {
      if (raw.trim() === "") setFromRaw("");
      return;
    }
    const converted = convertDataTransfer(n, toUnit, fromUnit);
    if (converted !== null) setFromRaw(formatConverted(converted));
    pushKixtDataLayer(kixtConvertEvent("input", "data-transfer", { field: "to" }));
  };

  const swap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromRaw(toRaw);
    setToRaw(fromRaw);
    setEditSide(editSide === "from" ? "to" : "from");
    pushKixtDataLayer(kixtConvertEvent("swap", "data-transfer"));
  };

  const clearAll = () => {
    setFromRaw("");
    setToRaw("");
    pushKixtDataLayer(kixtConvertEvent("clear", "data-transfer"));
  };

  const applyPreset = (id: DataTransferPresetId) => {
    const preset = DATA_TRANSFER_PRESETS[id];
    setFromUnit(preset.unit);
    setFromRaw(preset.value);
    setEditSide("from");
    const n = parseInputNumber(preset.value);
    if (n !== null) {
      const c = convertDataTransfer(n, preset.unit, toUnit);
      if (c !== null) setToRaw(formatConverted(c));
    }
    pushKixtDataLayer(kixtConvertEvent("preset", "data-transfer", { preset_id: id }));
  };

  const copyValue = async (key: string, text: string) => {
    setCopyError(!(await copy(key, text)));
    pushKixtDataLayer(kixtConvertEvent("copy", "data-transfer", { key }));
  };

  const useGridAsSource = (unitId: string, value: string) => {
    if (!value.trim()) return;
    setFromUnit(unitId as DataTransferUnitId);
    onFromValueChange(value);
  };

  const useMainSpeedForXfer = () => {
    const raw = editSide === "from" ? fromRaw : toRaw;
    const unit = editSide === "from" ? fromUnit : toUnit;
    if (!raw.trim()) return;
    setXferSpeedRaw(raw);
    setXferSpeedUnit(unit);
    pushKixtDataLayer(kixtConvertEvent("input", "data-transfer", { field: "use_main_speed" }));
  };

  const fromInvalid = fromRaw.trim() !== "" && (isInvalidInputRaw(fromRaw) || isNegativeOrInvalidInput(fromRaw));
  const toInvalid = toRaw.trim() !== "" && (isInvalidInputRaw(toRaw) || isNegativeOrInvalidInput(toRaw));
  const xferSpeedInvalid =
    xferSpeedRaw.trim() !== "" && (isInvalidInputRaw(xferSpeedRaw) || parsePositiveNumber(xferSpeedRaw) === null);

  return (
    <div className="space-y-8">
      <section className="space-y-4" aria-labelledby="dt-main">
        <SectionBlock title={t.dataTransfer.mainTitle} id="dt-main">
          <p className="text-xs leading-relaxed text-slate-400">{t.dataTransfer.decimalStepNote}</p>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{t.dataTransfer.presetsTitle}</p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(DATA_TRANSFER_PRESETS) as DataTransferPresetId[]).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => applyPreset(id)}
                className="min-h-10 rounded-full border border-slate-700 bg-slate-900/50 px-3 py-2 text-xs text-slate-300 hover:border-sky-500/40 sm:text-sm"
              >
                {t.dataTransfer[PRESET_LABEL_KEY[id]]}
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
          <p className="text-xs text-slate-500">{t.dataTransfer.presetsHint}</p>
        </SectionBlock>

        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-end">
          <ValueField
            value={fromRaw}
            onChange={onFromValueChange}
            invalid={fromInvalid}
            invalidText={isNegativeOrInvalidInput(fromRaw) ? t.dataTransfer.negativeNotAllowed : t.dataTransfer.invalidInput}
            select={
              <UnitSelect
                label={t.dataTransfer.fromUnit}
                unitId={fromUnit}
                options={DATA_TRANSFER_UNIT_IDS}
                onChange={(id) => {
                  const next = id as DataTransferUnitId;
                  setFromUnit(next);
                  if (bps !== null) {
                    setFromRaw(formatConverted(fromBitsPerSecond(bps, next) ?? 0));
                    const toV = fromBitsPerSecond(bps, toUnit);
                    if (toV !== null) setToRaw(formatConverted(toV));
                  }
                  pushKixtDataLayer(kixtConvertEvent("input", "data-transfer", { unit_select: "from" }));
                }}
              />
            }
          />
          <button
            type="button"
            onClick={swap}
            aria-label={t.dataTransfer.swapAria}
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-sky-500/35 bg-sky-500/15 text-sky-200 md:mb-1"
          >
            <ArrowLeftRight className="h-5 w-5" />
          </button>
          <ValueField
            value={toRaw}
            onChange={onToValueChange}
            invalid={toInvalid}
            invalidText={isNegativeOrInvalidInput(toRaw) ? t.dataTransfer.negativeNotAllowed : t.dataTransfer.invalidInput}
            select={
              <UnitSelect
                label={t.dataTransfer.toUnit}
                unitId={toUnit}
                options={DATA_TRANSFER_UNIT_IDS}
                onChange={(id) => {
                  const next = id as DataTransferUnitId;
                  setToUnit(next);
                  if (bps !== null) {
                    const v = fromBitsPerSecond(bps, next);
                    if (v !== null) setToRaw(formatConverted(v));
                  }
                  pushKixtDataLayer(kixtConvertEvent("input", "data-transfer", { unit_select: "to" }));
                }}
              />
            }
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
                const lines = DATA_TRANSFER_UNIT_IDS.map((id) => {
                  const v = gridValues.get(id);
                  return v ? `${unitSymbol(lang, id)}: ${v}` : null;
                })
                  .filter(Boolean)
                  .join("\n");
                void copyValue("main-all", lines);
              }}
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-700 px-4 py-2 text-sm"
            >
              <Radio className="h-4 w-4" />
              {copiedKey === "main-all" ? t.converter.copied : t.converter.copyAll}
            </button>
          ) : null}
        </div>
        {copyError ? <p className="text-xs text-rose-400/90">{t.dataTransfer.copyFailed}</p> : null}
      </section>

      <section className="space-y-3" aria-labelledby="dt-grid">
        <SectionBlock title={t.dataTransfer.allUnitsTitle} id="dt-grid">
          <p className="text-xs text-slate-500">{t.dataTransfer.allUnitsHint}</p>
        </SectionBlock>
        <ul className="grid gap-2 sm:grid-cols-2">
          {DATA_TRANSFER_UNIT_IDS.map((id) => (
            <li key={id} className="min-w-0">
              <BitRateRow
                id={id}
                value={gridValues?.get(id) ?? ""}
                highlight={editSide === "from" ? id === fromUnit : id === toUnit}
                copiedKey={copiedKey}
                onUse={() => useGridAsSource(id, gridValues?.get(id) ?? "")}
                onCopy={() => copyValue(`grid-${id}`, gridValues?.get(id) ?? "")}
              />
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/30 p-4 sm:p-5" aria-labelledby="dt-bytes">
        <SectionBlock title={t.dataTransfer.bytesPerSecTitle} id="dt-bytes">
          <p className="text-xs text-slate-500">{t.dataTransfer.bytesPerSecHint}</p>
          <p className="text-xs leading-relaxed text-slate-400">{t.dataTransfer.bitsVsBytesNote}</p>
        </SectionBlock>
        <ul className="grid gap-2 sm:grid-cols-2">
          {BYTE_RATE_KEYS.map((key) => (
            <li key={key} className="min-w-0">
              <div
                className={cn(
                  "flex min-w-0 items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/50 px-3 py-2",
                  !byteRates?.get(key) && "opacity-60",
                )}
              >
                <div className="min-w-0 flex-1">
                  <span className="block text-[11px] text-slate-500">{t.dataTransfer[BYTE_LABEL_KEY[key]]}</span>
                  <span className="mt-0.5 block text-base font-semibold tabular-nums text-white">
                    {byteRates?.get(key) ?? "—"}
                  </span>
                </div>
                <button
                  type="button"
                  disabled={!byteRates?.get(key)}
                  onClick={() => copyValue(`byte-${key}`, byteRates?.get(key) ?? "")}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-700/80 text-slate-400 hover:border-sky-500/40 disabled:opacity-40"
                  aria-label={copiedKey === `byte-${key}` ? t.converter.copied : t.converter.copy}
                >
                  {copiedKey === `byte-${key}` ? <Check className="h-4 w-4 text-sky-300" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/30 p-4 sm:p-5" aria-labelledby="dt-xfer">
        <SectionBlock title={t.dataTransfer.transferTitle} id="dt-xfer">
          <p className="text-xs text-slate-500">{t.dataTransfer.transferHint}</p>
          <p className="text-xs leading-relaxed text-slate-400">{t.dataTransfer.idealConditionsNote}</p>
        </SectionBlock>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/40 p-3">
            <span className="text-xs font-medium text-slate-400">{t.dataTransfer.fileSizeLabel}</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFileSizeUnit("MB")}
                className={cn(
                  "min-h-10 flex-1 rounded-lg border px-2 text-sm",
                  fileSizeUnit === "MB" ? "border-sky-500/40 bg-sky-500/10 text-sky-100" : "border-slate-700 text-slate-400",
                )}
              >
                {t.dataTransfer.fileSizeMB}
              </button>
              <button
                type="button"
                onClick={() => setFileSizeUnit("GB")}
                className={cn(
                  "min-h-10 flex-1 rounded-lg border px-2 text-sm",
                  fileSizeUnit === "GB" ? "border-sky-500/40 bg-sky-500/10 text-sky-100" : "border-slate-700 text-slate-400",
                )}
              >
                {t.dataTransfer.fileSizeGB}
              </button>
            </div>
            <input
              type="text"
              inputMode="decimal"
              value={fileSizeRaw}
              onChange={(e) => setFileSizeRaw(e.target.value)}
              placeholder="5"
              className={cn(
                "min-h-11 w-full rounded-lg border bg-slate-950/60 px-3 text-lg tabular-nums text-white outline-none",
                fileSizeRaw.trim() !== "" && isNegativeOrInvalidInput(fileSizeRaw) ? "border-rose-500/50" : "border-slate-700",
              )}
            />
          </div>

          <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/40 p-3">
            <UnitSelect
              label={t.dataTransfer.speedForTransfer}
              unitId={xferSpeedUnit}
              options={DATA_TRANSFER_UNIT_IDS}
              onChange={(id) => setXferSpeedUnit(id as DataTransferUnitId)}
            />
            <input
              type="text"
              inputMode="decimal"
              value={xferSpeedRaw}
              onChange={(e) => setXferSpeedRaw(e.target.value)}
              placeholder="100"
              className={cn(
                "min-h-11 w-full rounded-lg border bg-slate-950/60 px-3 text-lg tabular-nums text-white outline-none",
                xferSpeedInvalid ? "border-rose-500/50" : "border-slate-700",
              )}
            />
            {xferSpeedInvalid ? (
              <p className="text-xs text-rose-400/90">
                {xferSpeedRaw.trim() !== "" && parseInputNumber(xferSpeedRaw) !== null && parseInputNumber(xferSpeedRaw)! <= 0
                  ? t.dataTransfer.zeroSpeed
                  : t.dataTransfer.invalidInput}
              </p>
            ) : null}
            {fromRaw.trim() ? (
              <button
                type="button"
                onClick={useMainSpeedForXfer}
                className="text-xs text-sky-400 hover:text-sky-300"
              >
                ← {t.dataTransfer.useAsSource}
              </button>
            ) : null}
          </div>
        </div>

        <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">{t.dataTransfer.resultTime}</p>
          <p className="mt-1 flex items-center gap-2 text-xl font-semibold tabular-nums text-white">
            <Timer className="h-5 w-5 shrink-0 text-sky-400/80" aria-hidden />
            {transferEstimate !== null
              ? formatTransferDuration(transferEstimate, {
                  hoursShort: t.dataTransfer.hoursShort,
                  minutesShort: t.dataTransfer.minutesShort,
                  secondsShort: t.dataTransfer.secondsShort,
                }) || "—"
              : "—"}
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

function BitRateRow({
  id,
  value,
  highlight,
  copiedKey,
  onUse,
  onCopy,
}: {
  id: DataTransferUnitId;
  value: string;
  highlight: boolean;
  copiedKey: string | null;
  onUse: () => void;
  onCopy: () => void;
}) {
  const { lang, t } = useI18n();
  const copyKey = `grid-${id}`;
  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-2 rounded-xl border px-3 py-2",
        highlight ? "border-sky-500/35 bg-sky-500/10" : "border-slate-800 bg-slate-900/50",
        !value && "opacity-60",
      )}
    >
      <button type="button" disabled={!value} onClick={onUse} className="min-w-0 flex-1 text-left" title={t.dataTransfer.useAsSource}>
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
        onClick={onCopy}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-700/80 text-slate-400 hover:border-sky-500/40 disabled:opacity-40"
        aria-label={copiedKey === copyKey ? t.converter.copied : t.converter.copy}
      >
        {copiedKey === copyKey ? <Check className="h-4 w-4 text-sky-300" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}