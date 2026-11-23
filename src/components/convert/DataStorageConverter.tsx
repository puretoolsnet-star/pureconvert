"use client";

import { ArrowLeftRight, Check, Copy, HardDrive, Plus } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

import { UnitSelect } from "@/components/convert/UnitSelect";
import { useCopyFeedback } from "@/components/convert/use-copy-feedback";
import { useI18n } from "@/i18n/context";
import { unitLabel, unitSymbol } from "@/i18n/tools/get-copy";
import { kixtConvertEvent, pushKixtDataLayer } from "@/lib/analytics/kixt-gtm";
import { cn } from "@/lib/cn";
import {
  allDataStorageFromBytes,
  convertDataStorage,
  DATA_STORAGE_PRESETS,
  DATA_STORAGE_UNIT_IDS,
  dataStorageSum,
  fromBytes,
  toBytes,
  type DataStoragePresetId,
  type DataStorageUnitId,
} from "@/lib/convert/data-storage";
import {
  formatConverted,
  isInvalidInputRaw,
  isNegativeOrInvalidInput,
  parseInputNumber,
  parseNonNegativeNumber,
} from "@/lib/convert/format";

type EditSide = "from" | "to";

const PRESET_LABEL_KEY: Record<DataStoragePresetId, keyof import("@/i18n/types").Dictionary["dataStorage"]> = {
  document: "presetDocument",
  image: "presetImage",
  video: "presetVideo",
  drive: "presetDrive",
  warehouse: "presetWarehouse",
};

export function DataStorageConverter() {
  const { lang, t } = useI18n();
  const { copiedKey, copy } = useCopyFeedback();

  const [fromUnit, setFromUnit] = useState<DataStorageUnitId>("MB");
  const [toUnit, setToUnit] = useState<DataStorageUnitId>("GB");
  const [fromRaw, setFromRaw] = useState("");
  const [toRaw, setToRaw] = useState("");
  const [editSide, setEditSide] = useState<EditSide>("from");
  const [copyError, setCopyError] = useState(false);

  const [aRaw, setARaw] = useState("");
  const [aUnit, setAUnit] = useState<DataStorageUnitId>("KB");
  const [bRaw, setBRaw] = useState("");
  const [bUnit, setBUnit] = useState<DataStorageUnitId>("MB");
  const [resultUnit, setResultUnit] = useState<DataStorageUnitId>("GB");

  const bytes = useMemo(() => {
    const raw = editSide === "from" ? fromRaw : toRaw;
    const unit = editSide === "from" ? fromUnit : toUnit;
    if (raw.trim() === "") return null;
    const n = parseNonNegativeNumber(raw);
    if (n === null) return null;
    return toBytes(n, unit);
  }, [editSide, fromRaw, fromUnit, toRaw, toUnit]);

  const gridValues = useMemo(() => {
    if (bytes === null) return null;
    return allDataStorageFromBytes(bytes);
  }, [bytes]);

  const sumResult = useMemo(() => {
    const na = parseNonNegativeNumber(aRaw);
    const nb = parseNonNegativeNumber(bRaw);
    if (na === null || nb === null) return "";
    const total = dataStorageSum(na, aUnit, nb, bUnit);
    if (total === null) return "";
    const out = fromBytes(total, resultUnit);
    return out !== null ? formatConverted(out) : "";
  }, [aRaw, aUnit, bRaw, bUnit, resultUnit]);

  const onFromValueChange = (raw: string) => {
    setFromRaw(raw);
    setEditSide("from");
    const n = parseNonNegativeNumber(raw);
    if (n === null) {
      if (raw.trim() === "") setToRaw("");
      return;
    }
    const converted = convertDataStorage(n, fromUnit, toUnit);
    if (converted !== null) setToRaw(formatConverted(converted));
    pushKixtDataLayer(kixtConvertEvent("input", "data-storage", { field: "from" }));
  };

  const onToValueChange = (raw: string) => {
    setToRaw(raw);
    setEditSide("to");
    const n = parseNonNegativeNumber(raw);
    if (n === null) {
      if (raw.trim() === "") setFromRaw("");
      return;
    }
    const converted = convertDataStorage(n, toUnit, fromUnit);
    if (converted !== null) setFromRaw(formatConverted(converted));
    pushKixtDataLayer(kixtConvertEvent("input", "data-storage", { field: "to" }));
  };

  const swap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromRaw(toRaw);
    setToRaw(fromRaw);
    setEditSide(editSide === "from" ? "to" : "from");
    pushKixtDataLayer(kixtConvertEvent("swap", "data-storage"));
  };

  const clearAll = () => {
    setFromRaw("");
    setToRaw("");
    pushKixtDataLayer(kixtConvertEvent("clear", "data-storage"));
  };

  const applyPreset = (id: DataStoragePresetId) => {
    const preset = DATA_STORAGE_PRESETS[id];
    setFromUnit(preset.unit);
    setFromRaw(preset.value);
    setEditSide("from");
    const n = parseInputNumber(preset.value);
    if (n !== null) {
      const c = convertDataStorage(n, preset.unit, toUnit);
      if (c !== null) setToRaw(formatConverted(c));
    }
    pushKixtDataLayer(kixtConvertEvent("preset", "data-storage", { preset_id: id }));
  };

  const copyValue = async (key: string, text: string) => {
    setCopyError(!(await copy(key, text)));
    pushKixtDataLayer(kixtConvertEvent("copy", "data-storage", { key }));
  };

  const useGridAsSource = (unitId: string, value: string) => {
    if (!value.trim()) return;
    setFromUnit(unitId as DataStorageUnitId);
    onFromValueChange(value);
  };

  const fromInvalid = fromRaw.trim() !== "" && (isInvalidInputRaw(fromRaw) || isNegativeOrInvalidInput(fromRaw));
  const toInvalid = toRaw.trim() !== "" && (isInvalidInputRaw(toRaw) || isNegativeOrInvalidInput(toRaw));

  return (
    <div className="space-y-8">
      <section className="space-y-4" aria-labelledby="ds-main">
        <SectionBlock title={t.dataStorage.mainTitle} id="ds-main">
          <p className="text-xs leading-relaxed text-slate-400">{t.dataStorage.binaryStepNote}</p>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{t.dataStorage.presetsTitle}</p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(DATA_STORAGE_PRESETS) as DataStoragePresetId[]).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => applyPreset(id)}
                className="min-h-10 rounded-full border border-slate-700 bg-slate-900/50 px-3 py-2 text-xs text-slate-300 hover:border-sky-500/40 sm:text-sm"
              >
                {t.dataStorage[PRESET_LABEL_KEY[id]]}
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
          <p className="text-xs text-slate-500">{t.dataStorage.presetsHint}</p>
        </SectionBlock>

        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-end">
          <ValueField
            value={fromRaw}
            onChange={onFromValueChange}
            invalid={fromInvalid}
            invalidText={isNegativeOrInvalidInput(fromRaw) ? t.dataStorage.negativeNotAllowed : t.dataStorage.invalidInput}
            select={
              <UnitSelect label={t.dataStorage.fromUnit} unitId={fromUnit} options={DATA_STORAGE_UNIT_IDS} onChange={(id) => {
                const next = id as DataStorageUnitId;
                setFromUnit(next);
                if (bytes !== null) {
                  setFromRaw(formatConverted(fromBytes(bytes, next) ?? 0));
                  const toV = fromBytes(bytes, toUnit);
                  if (toV !== null) setToRaw(formatConverted(toV));
                }
                pushKixtDataLayer(kixtConvertEvent("input", "data-storage", { unit_select: "from" }));
              }} />
            }
          />
          <button
            type="button"
            onClick={swap}
            aria-label={t.dataStorage.swapAria}
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-sky-500/35 bg-sky-500/15 text-sky-200 md:mb-1"
          >
            <ArrowLeftRight className="h-5 w-5" />
          </button>
          <ValueField
            value={toRaw}
            onChange={onToValueChange}
            invalid={toInvalid}
            invalidText={isNegativeOrInvalidInput(toRaw) ? t.dataStorage.negativeNotAllowed : t.dataStorage.invalidInput}
            select={
              <UnitSelect label={t.dataStorage.toUnit} unitId={toUnit} options={DATA_STORAGE_UNIT_IDS} onChange={(id) => {
                const next = id as DataStorageUnitId;
                setToUnit(next);
                if (bytes !== null) {
                  const v = fromBytes(bytes, next);
                  if (v !== null) setToRaw(formatConverted(v));
                }
                pushKixtDataLayer(kixtConvertEvent("input", "data-storage", { unit_select: "to" }));
              }} />
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
                const lines = DATA_STORAGE_UNIT_IDS.map((id) => {
                  const v = gridValues.get(id);
                  return v ? `${unitSymbol(lang, id)}: ${v}` : null;
                })
                  .filter(Boolean)
                  .join("\n");
                void copyValue("main-all", lines);
              }}
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-700 px-4 py-2 text-sm"
            >
              <HardDrive className="h-4 w-4" />
              {copiedKey === "main-all" ? t.converter.copied : t.converter.copyAll}
            </button>
          ) : null}
        </div>
        {copyError ? <p className="text-xs text-rose-400/90">{t.dataStorage.copyFailed}</p> : null}
      </section>

      <section className="space-y-3" aria-labelledby="ds-grid">
        <SectionBlock title={t.dataStorage.allUnitsTitle} id="ds-grid">
          <p className="text-xs text-slate-500">{t.dataStorage.allUnitsHint}</p>
        </SectionBlock>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {DATA_STORAGE_UNIT_IDS.map((id) => (
            <li key={id} className="min-w-0">
              <GridRow
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

      <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/30 p-4 sm:p-5" aria-labelledby="ds-sum">
        <SectionBlock title={t.dataStorage.sumTitle} id="ds-sum">
          <p className="text-xs text-slate-500">{t.dataStorage.sumHint}</p>
        </SectionBlock>
        <div className="grid gap-3 sm:grid-cols-2">
          <SumRow
            label={t.dataStorage.valueA}
            value={aRaw}
            onChange={setARaw}
            unit={aUnit}
            onUnit={setAUnit}
            invalidHint={t.dataStorage.negativeNotAllowed}
            invalidFmt={t.dataStorage.invalidInput}
          />
          <SumRow
            label={t.dataStorage.valueB}
            value={bRaw}
            onChange={setBRaw}
            unit={bUnit}
            onUnit={setBUnit}
            invalidHint={t.dataStorage.negativeNotAllowed}
            invalidFmt={t.dataStorage.invalidInput}
          />
        </div>
        <UnitSelect
          label={t.dataStorage.resultIn}
          unitId={resultUnit}
          options={DATA_STORAGE_UNIT_IDS}
          onChange={(id) => {
            setResultUnit(id as DataStorageUnitId);
            pushKixtDataLayer(kixtConvertEvent("arithmetic", "data-storage", { op: "sum" }));
          }}
        />
        <p className="flex items-center gap-2 text-xl font-semibold tabular-nums text-white">
          <Plus className="h-5 w-5 text-sky-400/80" aria-hidden />
          {sumResult ? (
            <>
              {sumResult} <span className="text-lg text-sky-200/90">{unitSymbol(lang, resultUnit)}</span>
            </>
          ) : (
            "—"
          )}
        </p>
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

function GridRow({
  id,
  value,
  highlight,
  copiedKey,
  onUse,
  onCopy,
}: {
  id: DataStorageUnitId;
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
      <button type="button" disabled={!value} onClick={onUse} className="min-w-0 flex-1 text-left" title={t.dataStorage.useAsSource}>
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

function SumRow({
  label,
  value,
  onChange,
  unit,
  onUnit,
  invalidHint,
  invalidFmt,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  unit: DataStorageUnitId;
  onUnit: (u: DataStorageUnitId) => void;
  invalidHint: string;
  invalidFmt: string;
}) {
  const { t } = useI18n();
  const invalid = value.trim() !== "" && (isInvalidInputRaw(value) || isNegativeOrInvalidInput(value));
  return (
    <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/40 p-3">
      <UnitSelect label={label} unitId={unit} options={DATA_STORAGE_UNIT_IDS} onChange={(id) => onUnit(id as DataStorageUnitId)} />
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
      {invalid ? (
        <p className="text-xs text-rose-400/90">{isNegativeOrInvalidInput(value) ? invalidHint : invalidFmt}</p>
      ) : null}
    </div>
  );
}