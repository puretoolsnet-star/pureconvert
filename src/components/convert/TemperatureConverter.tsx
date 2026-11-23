"use client";

import { ArrowLeftRight, Check, Copy, Minus, Plus, Thermometer } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

import { UnitSelect } from "@/components/convert/UnitSelect";
import { useCopyFeedback } from "@/components/convert/use-copy-feedback";
import { useI18n } from "@/i18n/context";
import { unitLabel, unitSymbol } from "@/i18n/tools/get-copy";
import { kixtConvertEvent, pushKixtDataLayer } from "@/lib/analytics/kixt-gtm";
import { cn } from "@/lib/cn";
import { formatConverted, isInvalidInputRaw, parseInputNumber } from "@/lib/convert/format";
import {
  allDeltasFromUnit,
  allTempsFromKelvin,
  combineTemperatureDeltas,
  convertTemperaturePoint,
  deltaFromCelsius,
  fromKelvin,
  isBelowAbsoluteZero,
  TEMP_PRESETS,
  TEMP_UNIT_IDS,
  temperaturePointDifferenceC,
  toKelvin,
  type TempPresetId,
  type TempUnitId,
} from "@/lib/convert/temperature";

type EditSide = "from" | "to";
type DeltaCombineOp = "sum" | "diff";

const PRESET_LABEL_KEY: Record<TempPresetId, keyof import("@/i18n/types").Dictionary["temperature"]> = {
  absoluteZero: "presetAbsoluteZero",
  freezing: "presetFreezing",
  room: "presetRoom",
  body: "presetBody",
  boiling: "presetBoiling",
};

export function TemperatureConverter() {
  const { lang, t } = useI18n();
  const { copiedKey, copy } = useCopyFeedback();

  const [fromUnit, setFromUnit] = useState<TempUnitId>("C");
  const [toUnit, setToUnit] = useState<TempUnitId>("F");
  const [fromRaw, setFromRaw] = useState("");
  const [toRaw, setToRaw] = useState("");
  const [editSide, setEditSide] = useState<EditSide>("from");
  const [copyError, setCopyError] = useState(false);

  const [deltaRaw, setDeltaRaw] = useState("");
  const [deltaUnit, setDeltaUnit] = useState<TempUnitId>("C");

  const [aRaw, setARaw] = useState("");
  const [aUnit, setAUnit] = useState<TempUnitId>("C");
  const [bRaw, setBRaw] = useState("");
  const [bUnit, setBUnit] = useState<TempUnitId>("F");

  const [d1Raw, setD1Raw] = useState("");
  const [d1Unit, setD1Unit] = useState<TempUnitId>("C");
  const [d2Raw, setD2Raw] = useState("");
  const [d2Unit, setD2Unit] = useState<TempUnitId>("F");
  const [combineOp, setCombineOp] = useState<DeltaCombineOp>("sum");
  const [combineResultUnit, setCombineResultUnit] = useState<TempUnitId>("C");

  const kelvin = useMemo(() => {
    const raw = editSide === "from" ? fromRaw : toRaw;
    const unit = editSide === "from" ? fromUnit : toUnit;
    if (raw.trim() === "") return null;
    const n = parseInputNumber(raw);
    if (n === null) return null;
    const k = toKelvin(n, unit);
    if (k < 0) return "invalid" as const;
    return k;
  }, [editSide, fromRaw, fromUnit, toRaw, toUnit]);

  const gridValues = useMemo(() => {
    if (kelvin === null || kelvin === "invalid") return null;
    return allTempsFromKelvin(kelvin);
  }, [kelvin]);

  const deltaGrid = useMemo(() => {
    if (deltaRaw.trim() === "") return null;
    const n = parseInputNumber(deltaRaw);
    if (n === null) return null;
    return allDeltasFromUnit(n, deltaUnit);
  }, [deltaRaw, deltaUnit]);

  const twoPointDelta = useMemo(() => {
    const na = parseInputNumber(aRaw);
    const nb = parseInputNumber(bRaw);
    if (na === null || nb === null) return null;
    const dc = temperaturePointDifferenceC(na, aUnit, nb, bUnit);
    if (dc === null) return "below" as const;
    return allDeltasFromUnit(dc, "C");
  }, [aRaw, aUnit, bRaw, bUnit]);

  const combinedDelta = useMemo(() => {
    const n1 = parseInputNumber(d1Raw);
    const n2 = parseInputNumber(d2Raw);
    if (n1 === null || n2 === null) return "";
    const dc = combineTemperatureDeltas(n1, d1Unit, n2, d2Unit, combineOp);
    return formatConverted(deltaFromCelsius(dc, combineResultUnit));
  }, [combineOp, combineResultUnit, d1Raw, d1Unit, d2Raw, d2Unit]);

  const syncToFromKelvin = (k: number, targetTo: TempUnitId) => {
    const v = fromKelvin(k, targetTo);
    setToRaw(formatConverted(v));
  };

  const onFromValueChange = (raw: string) => {
    setFromRaw(raw);
    setEditSide("from");
    if (raw.trim() === "") {
      setToRaw("");
      return;
    }
    const n = parseInputNumber(raw);
    if (n === null) return;
    if (isBelowAbsoluteZero(n, fromUnit)) {
      setToRaw("");
      return;
    }
    const converted = convertTemperaturePoint(n, fromUnit, toUnit);
    if (converted !== null) setToRaw(formatConverted(converted));
    pushKixtDataLayer(kixtConvertEvent("input", "temperature", { field: "from" }));
  };

  const onToValueChange = (raw: string) => {
    setToRaw(raw);
    setEditSide("to");
    if (raw.trim() === "") {
      setFromRaw("");
      return;
    }
    const n = parseInputNumber(raw);
    if (n === null) return;
    if (isBelowAbsoluteZero(n, toUnit)) {
      setFromRaw("");
      return;
    }
    const converted = convertTemperaturePoint(n, toUnit, fromUnit);
    if (converted !== null) setFromRaw(formatConverted(converted));
    pushKixtDataLayer(kixtConvertEvent("input", "temperature", { field: "to" }));
  };

  const onFromUnitChange = (id: string) => {
    const next = id as TempUnitId;
    setFromUnit(next);
    if (kelvin !== null && kelvin !== "invalid") {
      setFromRaw(formatConverted(fromKelvin(kelvin, next)));
    }
    if (typeof kelvin === "number") syncToFromKelvin(kelvin, toUnit);
    pushKixtDataLayer(kixtConvertEvent("input", "temperature", { unit_select: "from" }));
  };

  const onToUnitChange = (id: string) => {
    const next = id as TempUnitId;
    setToUnit(next);
    if (typeof kelvin === "number") syncToFromKelvin(kelvin, next);
    pushKixtDataLayer(kixtConvertEvent("input", "temperature", { unit_select: "to" }));
  };

  const swap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromRaw(toRaw);
    setToRaw(fromRaw);
    setEditSide(editSide === "from" ? "to" : "from");
    pushKixtDataLayer(kixtConvertEvent("swap", "temperature"));
  };

  const clearAll = () => {
    setFromRaw("");
    setToRaw("");
    pushKixtDataLayer(kixtConvertEvent("clear", "temperature"));
  };

  const applyPreset = (id: TempPresetId) => {
    const preset = TEMP_PRESETS[id];
    setFromUnit(preset.unit);
    setFromRaw(preset.value);
    setEditSide("from");
    const n = parseInputNumber(preset.value);
    if (n !== null && !isBelowAbsoluteZero(n, preset.unit)) {
      const c = convertTemperaturePoint(n, preset.unit, toUnit);
      if (c !== null) setToRaw(formatConverted(c));
    } else {
      setToRaw("");
    }
    pushKixtDataLayer(kixtConvertEvent("preset", "temperature", { preset_id: id }));
  };

  const copyValue = async (key: string, text: string) => {
    setCopyError(!(await copy(key, text)));
    pushKixtDataLayer(kixtConvertEvent("copy", "temperature", { key }));
  };

  const useGridAsSource = (unitId: TempUnitId, value: string) => {
    if (!value.trim()) return;
    setFromUnit(unitId);
    onFromValueChange(value);
  };

  const fromBelowZero =
    fromRaw.trim() !== "" && parseInputNumber(fromRaw) !== null && isBelowAbsoluteZero(parseInputNumber(fromRaw)!, fromUnit);
  const toBelowZero =
    toRaw.trim() !== "" && parseInputNumber(toRaw) !== null && isBelowAbsoluteZero(parseInputNumber(toRaw)!, toUnit);
  const fromInvalid = fromRaw.trim() !== "" && (isInvalidInputRaw(fromRaw) || fromBelowZero);
  const toInvalid = toRaw.trim() !== "" && (isInvalidInputRaw(toRaw) || toBelowZero);
  const fromInvalidText = fromBelowZero ? t.temperature.absoluteZeroWarning : t.temperature.invalidInput;
  const toInvalidText = toBelowZero ? t.temperature.absoluteZeroWarning : t.temperature.invalidInput;

  const aBelow =
    aRaw.trim() !== "" && parseInputNumber(aRaw) !== null && isBelowAbsoluteZero(parseInputNumber(aRaw)!, aUnit);
  const bBelow =
    bRaw.trim() !== "" && parseInputNumber(bRaw) !== null && isBelowAbsoluteZero(parseInputNumber(bRaw)!, bUnit);

  const renderScaleRow = (id: TempUnitId, value: string, highlight: boolean, keyPrefix: string) => (
    <li key={`${keyPrefix}-${id}`} className="min-w-0">
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
          onClick={() => keyPrefix === "main" && useGridAsSource(id, value)}
          className="min-w-0 flex-1 text-left"
          title={keyPrefix === "main" ? t.temperature.useAsSource : undefined}
        >
          <span className="block truncate text-[11px] text-slate-500">
            <span className="text-sky-300/90">{unitSymbol(lang, id)}</span>
            <span className="mx-1 text-slate-600">·</span>
            <span className="truncate">{unitLabel(lang, id)}</span>
          </span>
          <span className="mt-0.5 block text-base font-semibold tabular-nums text-white">
            {value ? `Δ ${value}` : "—"}
          </span>
        </button>
        <button
          type="button"
          disabled={!value}
          onClick={() => copyValue(`${keyPrefix}-${id}`, value)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-700/80 text-slate-400 hover:border-sky-500/40 disabled:opacity-40"
          aria-label={copiedKey === `${keyPrefix}-${id}` ? t.converter.copied : t.converter.copy}
        >
          {copiedKey === `${keyPrefix}-${id}` ? <Check className="h-4 w-4 text-sky-300" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
    </li>
  );

  const renderPointRow = (id: TempUnitId, value: string, highlight: boolean) => (
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
          title={t.temperature.useAsSource}
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
      <section className="space-y-4" aria-labelledby="temp-main">
        <SectionBlock title={t.temperature.mainTitle} id="temp-main">
          <p className="text-xs text-slate-500">{t.temperature.absoluteZeroRef}</p>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{t.temperature.presetsTitle}</p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(TEMP_PRESETS) as TempPresetId[]).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => applyPreset(id)}
                className="min-h-10 rounded-full border border-slate-700 bg-slate-900/50 px-3 py-2 text-xs text-slate-300 hover:border-sky-500/40 sm:text-sm"
              >
                {t.temperature[PRESET_LABEL_KEY[id]]}
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
          <p className="text-xs text-slate-500">{t.temperature.presetsHint}</p>
        </SectionBlock>

        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-end">
          <ValueField
            value={fromRaw}
            onChange={onFromValueChange}
            invalid={fromInvalid}
            invalidText={fromInvalidText}
            select={
              <UnitSelect
                label={t.temperature.fromScale}
                unitId={fromUnit}
                options={TEMP_UNIT_IDS}
                onChange={onFromUnitChange}
              />
            }
          />
          <button
            type="button"
            onClick={swap}
            aria-label={t.temperature.swapAria}
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-sky-500/35 bg-sky-500/15 text-sky-200 md:mb-1"
          >
            <ArrowLeftRight className="h-5 w-5" />
          </button>
          <ValueField
            value={toRaw}
            onChange={onToValueChange}
            invalid={toInvalid}
            invalidText={toInvalidText}
            select={
              <UnitSelect label={t.temperature.toScale} unitId={toUnit} options={TEMP_UNIT_IDS} onChange={onToUnitChange} />
            }
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={!toRaw || kelvin === "invalid"}
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
                const lines = TEMP_UNIT_IDS.map((id) => {
                  const v = gridValues.get(id);
                  return v ? `${unitSymbol(lang, id)}: ${v}` : null;
                })
                  .filter(Boolean)
                  .join("\n");
                void copyValue("main-all", lines);
              }}
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-700 px-4 py-2 text-sm"
            >
              <Thermometer className="h-4 w-4" />
              {copiedKey === "main-all" ? t.converter.copied : t.converter.copy}
            </button>
          ) : null}
        </div>
        {copyError ? <p className="text-xs text-rose-400/90">{t.temperature.copyFailed}</p> : null}
      </section>

      <section className="space-y-3" aria-labelledby="temp-grid">
        <SectionBlock title={t.temperature.allScalesTitle} id="temp-grid">
          <p className="text-xs text-slate-500">{t.temperature.allScalesHint}</p>
        </SectionBlock>
        <ul className="grid gap-2 sm:grid-cols-3">
          {TEMP_UNIT_IDS.map((id) =>
            renderPointRow(id, kelvin === "invalid" ? "" : (gridValues?.get(id) ?? ""), editSide === "from" ? id === fromUnit : id === toUnit),
          )}
        </ul>
      </section>

      <section className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/30 p-4 sm:p-5" aria-labelledby="temp-delta">
        <SectionBlock title={t.temperature.deltaTitle} id="temp-delta">
          <p className="text-xs text-slate-500">{t.temperature.deltaHint}</p>
          <p className="text-xs leading-relaxed text-slate-400">{t.temperature.pointVsDeltaNote}</p>
        </SectionBlock>

        <div className="space-y-3 rounded-xl border border-slate-800/80 bg-slate-950/40 p-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">{t.temperature.deltaDirectTitle}</h3>
          <p className="text-xs text-slate-500">{t.temperature.deltaDirectHint}</p>
          <UnitSelect
            label={t.temperature.deltaInputLabel}
            unitId={deltaUnit}
            options={TEMP_UNIT_IDS}
            onChange={(id) => setDeltaUnit(id as TempUnitId)}
          />
          <input
            type="text"
            inputMode="decimal"
            value={deltaRaw}
            onChange={(e) => {
              setDeltaRaw(e.target.value);
              pushKixtDataLayer(kixtConvertEvent("input", "temperature", { field: "delta" }));
            }}
            placeholder="Δ"
            className={cn(
              "min-h-11 w-full rounded-lg border bg-slate-950/60 px-3 text-lg tabular-nums text-white outline-none",
              deltaRaw.trim() !== "" && isInvalidInputRaw(deltaRaw) ? "border-rose-500/50" : "border-slate-700",
            )}
          />
          <ul className="grid gap-2 sm:grid-cols-3">
            {TEMP_UNIT_IDS.map((id) =>
              renderScaleRow(id, deltaGrid?.get(id) ?? "", id === deltaUnit, "delta"),
            )}
          </ul>
        </div>

        <div className="space-y-3 rounded-xl border border-slate-800/80 bg-slate-950/40 p-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">{t.temperature.twoPointTitle}</h3>
          <p className="text-xs text-slate-500">{t.temperature.twoPointHint}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <TempRow
              label={t.temperature.tempA}
              value={aRaw}
              onChange={setARaw}
              unit={aUnit}
              onUnit={setAUnit}
              invalid={aBelow || (aRaw.trim() !== "" && isInvalidInputRaw(aRaw))}
              invalidText={aBelow ? t.temperature.absoluteZeroWarning : t.temperature.invalidInput}
            />
            <TempRow
              label={t.temperature.tempB}
              value={bRaw}
              onChange={setBRaw}
              unit={bUnit}
              onUnit={setBUnit}
              invalid={bBelow || (bRaw.trim() !== "" && isInvalidInputRaw(bRaw))}
              invalidText={bBelow ? t.temperature.absoluteZeroWarning : t.temperature.invalidInput}
            />
          </div>
          {twoPointDelta === "below" ? (
            <p className="text-xs text-rose-400/90" role="alert">
              {t.temperature.absoluteZeroWarning}
            </p>
          ) : null}
          <ul className="grid gap-2 sm:grid-cols-3">
            {TEMP_UNIT_IDS.map((id) =>
              renderScaleRow(
                id,
                twoPointDelta && twoPointDelta !== "below" ? (twoPointDelta.get(id) ?? "") : "",
                false,
                "two",
              ),
            )}
          </ul>
        </div>

        <div className="space-y-3 rounded-xl border border-slate-800/80 bg-slate-950/40 p-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">{t.temperature.combineDeltaTitle}</h3>
          <p className="text-xs text-slate-500">{t.temperature.combineDeltaHint}</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setCombineOp("sum");
                pushKixtDataLayer(kixtConvertEvent("arithmetic", "temperature", { op: "sum" }));
              }}
              className={cn(
                "inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 py-2 text-sm",
                combineOp === "sum" ? "border-sky-400/45 bg-sky-500/15 text-sky-100" : "border-slate-800 text-slate-400",
              )}
            >
              <Plus className="h-4 w-4" />
              {t.temperature.sum}
            </button>
            <button
              type="button"
              onClick={() => {
                setCombineOp("diff");
                pushKixtDataLayer(kixtConvertEvent("arithmetic", "temperature", { op: "diff" }));
              }}
              className={cn(
                "inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 py-2 text-sm",
                combineOp === "diff" ? "border-sky-400/45 bg-sky-500/15 text-sky-100" : "border-slate-800 text-slate-400",
              )}
            >
              <Minus className="h-4 w-4" />
              {t.temperature.difference}
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <DeltaRow label={t.temperature.deltaA} value={d1Raw} onChange={setD1Raw} unit={d1Unit} onUnit={setD1Unit} />
            <DeltaRow label={t.temperature.deltaB} value={d2Raw} onChange={setD2Raw} unit={d2Unit} onUnit={setD2Unit} />
          </div>
          <UnitSelect
            label={t.temperature.resultIn}
            unitId={combineResultUnit}
            options={TEMP_UNIT_IDS}
            onChange={(id) => setCombineResultUnit(id as TempUnitId)}
          />
          <p className="text-xl font-semibold tabular-nums text-white">
            {combinedDelta ? (
              <>
                Δ {combinedDelta}{" "}
                <span className="text-lg text-sky-200/90">{unitSymbol(lang, combineResultUnit)}</span>
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

function TempRow({
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
  unit: TempUnitId;
  onUnit: (u: TempUnitId) => void;
  invalid: boolean;
  invalidText: string;
}) {
  const { t } = useI18n();
  return (
    <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/40 p-3">
      <UnitSelect label={label} unitId={unit} options={TEMP_UNIT_IDS} onChange={(id) => onUnit(id as TempUnitId)} />
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
      {invalid ? <p className="text-xs text-rose-400/90">{invalidText}</p> : null}
    </div>
  );
}

function DeltaRow({
  label,
  value,
  onChange,
  unit,
  onUnit,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  unit: TempUnitId;
  onUnit: (u: TempUnitId) => void;
}) {
  const { t } = useI18n();
  const invalid = value.trim() !== "" && isInvalidInputRaw(value);
  return (
    <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/40 p-3">
      <UnitSelect label={label} unitId={unit} options={TEMP_UNIT_IDS} onChange={(id) => onUnit(id as TempUnitId)} />
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Δ"
        className={cn(
          "min-h-11 w-full rounded-lg border bg-slate-950/60 px-3 text-lg tabular-nums text-white outline-none",
          invalid ? "border-rose-500/50" : "border-slate-700",
        )}
      />
      {invalid ? <p className="text-xs text-rose-400/90">{t.temperature.invalidInput}</p> : null}
    </div>
  );
}