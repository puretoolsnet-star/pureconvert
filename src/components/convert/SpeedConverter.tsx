"use client";

import { ArrowLeftRight, Check, Copy, Gauge, MapPin, Timer } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

import { UnitSelect } from "@/components/convert/UnitSelect";
import { useCopyFeedback } from "@/components/convert/use-copy-feedback";
import { useI18n } from "@/i18n/context";
import { unitLabel, unitSymbol } from "@/i18n/tools/get-copy";
import { kixtConvertEvent, pushKixtDataLayer } from "@/lib/analytics/kixt-gtm";
import { cn } from "@/lib/cn";
import {
  formatConverted,
  isInvalidInputRaw,
  isNegativeOrInvalidInput,
  parseInputNumber,
  parseNonNegativeNumber,
  parsePositiveNumber,
} from "@/lib/convert/format";
import {
  allSpeedFromMps,
  convertSpeed,
  distanceFromKm,
  distanceToKm,
  formatDurationHours,
  fromMetersPerSecond,
  SPEED_PRESETS,
  SPEED_UNIT_IDS,
  toMetersPerSecond,
  travelDistanceKm,
  travelSpeedMps,
  travelTimeHours,
  type SpeedPresetId,
  type SpeedUnitId,
} from "@/lib/convert/speed";

type EditSide = "from" | "to";
type TravelMode = "time" | "distance" | "speed";
type DistanceUnit = "km" | "mi";

const PRESET_LABEL_KEY: Record<SpeedPresetId, keyof import("@/i18n/types").Dictionary["speed"]> = {
  urban: "presetUrban",
  highway: "presetHighway",
  usHighway: "presetUsHighway",
  vessel: "presetVessel",
  sprint: "presetSprint",
  skydive: "presetSkydive",
};

export function SpeedConverter() {
  const { lang, t } = useI18n();
  const { copiedKey, copy } = useCopyFeedback();

  const [fromUnit, setFromUnit] = useState<SpeedUnitId>("km_h");
  const [toUnit, setToUnit] = useState<SpeedUnitId>("mph");
  const [fromRaw, setFromRaw] = useState("");
  const [toRaw, setToRaw] = useState("");
  const [editSide, setEditSide] = useState<EditSide>("from");
  const [copyError, setCopyError] = useState(false);

  const [travelMode, setTravelMode] = useState<TravelMode>("time");
  const [distRaw, setDistRaw] = useState("");
  const [distUnit, setDistUnit] = useState<DistanceUnit>("km");
  const [timeRaw, setTimeRaw] = useState("");
  const [travelSpeedRaw, setTravelSpeedRaw] = useState("");
  const [travelSpeedUnit, setTravelSpeedUnit] = useState<SpeedUnitId>("km_h");
  const [travelResultUnit, setTravelResultUnit] = useState<SpeedUnitId>("km_h");

  const mps = useMemo(() => {
    const raw = editSide === "from" ? fromRaw : toRaw;
    const unit = editSide === "from" ? fromUnit : toUnit;
    if (raw.trim() === "") return null;
    const n = parseNonNegativeNumber(raw);
    if (n === null) return null;
    return toMetersPerSecond(n, unit);
  }, [editSide, fromRaw, fromUnit, toRaw, toUnit]);

  const gridValues = useMemo(() => {
    if (mps === null) return null;
    return allSpeedFromMps(mps);
  }, [mps]);

  const travelResult = useMemo(() => {
    const distN = parseNonNegativeNumber(distRaw);
    const timeN = parsePositiveNumber(timeRaw);
    const speedN = parsePositiveNumber(travelSpeedRaw);

    const distKm = distN !== null ? distanceToKm(distN, distUnit) : null;
    const speedMps = speedN !== null ? toMetersPerSecond(speedN, travelSpeedUnit) : null;

    if (travelMode === "time") {
      if (distKm === null || speedMps === null || speedMps <= 0) return null;
      const h = travelTimeHours(distKm, speedMps);
      if (h === null) return null;
      return { kind: "time" as const, hours: h };
    }
    if (travelMode === "distance") {
      if (timeN === null || speedMps === null || speedMps <= 0) return null;
      const km = travelDistanceKm(timeN, speedMps);
      if (km === null) return null;
      return { kind: "distance" as const, km };
    }
    if (distKm === null || timeN === null) return null;
    const mpsOut = travelSpeedMps(distKm, timeN);
    if (mpsOut === null) return null;
    const inUnit = fromMetersPerSecond(mpsOut, travelResultUnit);
    return { kind: "speed" as const, text: inUnit !== null ? formatConverted(inUnit) : "" };
  }, [distRaw, distUnit, timeRaw, travelMode, travelResultUnit, travelSpeedRaw, travelSpeedUnit]);

  const onFromValueChange = (raw: string) => {
    setFromRaw(raw);
    setEditSide("from");
    const n = parseNonNegativeNumber(raw);
    if (n === null) {
      if (raw.trim() === "") setToRaw("");
      return;
    }
    const converted = convertSpeed(n, fromUnit, toUnit);
    if (converted !== null) setToRaw(formatConverted(converted));
    pushKixtDataLayer(kixtConvertEvent("input", "speed", { field: "from" }));
  };

  const onToValueChange = (raw: string) => {
    setToRaw(raw);
    setEditSide("to");
    const n = parseNonNegativeNumber(raw);
    if (n === null) {
      if (raw.trim() === "") setFromRaw("");
      return;
    }
    const converted = convertSpeed(n, toUnit, fromUnit);
    if (converted !== null) setFromRaw(formatConverted(converted));
    pushKixtDataLayer(kixtConvertEvent("input", "speed", { field: "to" }));
  };

  const onFromUnitChange = (id: string) => {
    const next = id as SpeedUnitId;
    setFromUnit(next);
    if (mps !== null) {
      const v = fromMetersPerSecond(mps, next);
      if (v !== null) setFromRaw(formatConverted(v));
      const toV = fromMetersPerSecond(mps, toUnit);
      if (toV !== null) setToRaw(formatConverted(toV));
    }
    pushKixtDataLayer(kixtConvertEvent("input", "speed", { unit_select: "from" }));
  };

  const onToUnitChange = (id: string) => {
    const next = id as SpeedUnitId;
    setToUnit(next);
    if (mps !== null) {
      const v = fromMetersPerSecond(mps, next);
      if (v !== null) setToRaw(formatConverted(v));
    }
    pushKixtDataLayer(kixtConvertEvent("input", "speed", { unit_select: "to" }));
  };

  const swap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromRaw(toRaw);
    setToRaw(fromRaw);
    setEditSide(editSide === "from" ? "to" : "from");
    pushKixtDataLayer(kixtConvertEvent("swap", "speed"));
  };

  const clearAll = () => {
    setFromRaw("");
    setToRaw("");
    pushKixtDataLayer(kixtConvertEvent("clear", "speed"));
  };

  const applyPreset = (id: SpeedPresetId) => {
    const preset = SPEED_PRESETS[id];
    setFromUnit(preset.unit);
    setFromRaw(preset.value);
    setEditSide("from");
    const n = parseInputNumber(preset.value);
    if (n !== null) {
      const c = convertSpeed(n, preset.unit, toUnit);
      if (c !== null) setToRaw(formatConverted(c));
    }
    pushKixtDataLayer(kixtConvertEvent("preset", "speed", { preset_id: id }));
  };

  const copyValue = async (key: string, text: string) => {
    setCopyError(!(await copy(key, text)));
    pushKixtDataLayer(kixtConvertEvent("copy", "speed", { key }));
  };

  const useGridAsSource = (unitId: string, value: string) => {
    if (!value.trim()) return;
    setFromUnit(unitId as SpeedUnitId);
    onFromValueChange(value);
  };

  const fromInvalid = fromRaw.trim() !== "" && (isInvalidInputRaw(fromRaw) || isNegativeOrInvalidInput(fromRaw));
  const toInvalid = toRaw.trim() !== "" && (isInvalidInputRaw(toRaw) || isNegativeOrInvalidInput(toRaw));

  const distInvalid = distRaw.trim() !== "" && isNegativeOrInvalidInput(distRaw);
  const timeInvalid =
    timeRaw.trim() !== "" && (isInvalidInputRaw(timeRaw) || parsePositiveNumber(timeRaw) === null);
  const travelSpeedInvalid =
    travelSpeedRaw.trim() !== "" && (isInvalidInputRaw(travelSpeedRaw) || parsePositiveNumber(travelSpeedRaw) === null);

  const setTravelModeAndTrack = (mode: TravelMode) => {
    setTravelMode(mode);
    pushKixtDataLayer(kixtConvertEvent("travel_mode", "speed", { mode }));
  };

  return (
    <div className="space-y-8">
      <section className="space-y-4" aria-labelledby="spd-main">
        <SectionBlock title={t.speed.mainTitle} id="spd-main">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{t.speed.presetsTitle}</p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(SPEED_PRESETS) as SpeedPresetId[]).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => applyPreset(id)}
                className="min-h-10 rounded-full border border-slate-700 bg-slate-900/50 px-3 py-2 text-xs text-slate-300 hover:border-sky-500/40 sm:text-sm"
              >
                {t.speed[PRESET_LABEL_KEY[id]]}
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
          <p className="text-xs text-slate-500">{t.speed.presetsHint}</p>
        </SectionBlock>

        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-end">
          <ValueField
            value={fromRaw}
            onChange={onFromValueChange}
            invalid={fromInvalid}
            invalidText={isNegativeOrInvalidInput(fromRaw) ? t.speed.negativeNotAllowed : t.speed.invalidInput}
            select={
              <UnitSelect label={t.speed.fromUnit} unitId={fromUnit} options={SPEED_UNIT_IDS} onChange={onFromUnitChange} />
            }
          />
          <button
            type="button"
            onClick={swap}
            aria-label={t.speed.swapAria}
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-sky-500/35 bg-sky-500/15 text-sky-200 md:mb-1"
          >
            <ArrowLeftRight className="h-5 w-5" />
          </button>
          <ValueField
            value={toRaw}
            onChange={onToValueChange}
            invalid={toInvalid}
            invalidText={isNegativeOrInvalidInput(toRaw) ? t.speed.negativeNotAllowed : t.speed.invalidInput}
            select={
              <UnitSelect label={t.speed.toUnit} unitId={toUnit} options={SPEED_UNIT_IDS} onChange={onToUnitChange} />
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
                const lines = SPEED_UNIT_IDS.map((id) => {
                  const v = gridValues.get(id);
                  return v ? `${unitSymbol(lang, id)}: ${v}` : null;
                })
                  .filter(Boolean)
                  .join("\n");
                void copyValue("main-all", lines);
              }}
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-700 px-4 py-2 text-sm"
            >
              <Gauge className="h-4 w-4" />
              {copiedKey === "main-all" ? t.converter.copied : t.converter.copy}
            </button>
          ) : null}
        </div>
        {copyError ? <p className="text-xs text-rose-400/90">{t.speed.copyFailed}</p> : null}
      </section>

      <section className="space-y-3" aria-labelledby="spd-grid">
        <SectionBlock title={t.speed.allUnitsTitle} id="spd-grid">
          <p className="text-xs text-slate-500">{t.speed.allUnitsHint}</p>
        </SectionBlock>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {SPEED_UNIT_IDS.map((id) => (
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

      <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/30 p-4 sm:p-5" aria-labelledby="spd-travel">
        <SectionBlock title={t.speed.travelTitle} id="spd-travel">
          <p className="text-xs text-slate-500">{t.speed.travelHint}</p>
        </SectionBlock>

        <div className="flex flex-wrap gap-2">
          <TravelModeButton
            active={travelMode === "time"}
            onClick={() => setTravelModeAndTrack("time")}
            icon={Timer}
            label={t.speed.findTime}
          />
          <TravelModeButton
            active={travelMode === "distance"}
            onClick={() => setTravelModeAndTrack("distance")}
            icon={MapPin}
            label={t.speed.findDistance}
          />
          <TravelModeButton
            active={travelMode === "speed"}
            onClick={() => setTravelModeAndTrack("speed")}
            icon={Gauge}
            label={t.speed.findSpeed}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {(travelMode === "time" || travelMode === "speed") && (
            <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/40 p-3">
              <span className="text-xs font-medium text-slate-400">{t.speed.distanceLabel}</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setDistUnit("km")}
                  className={cn(
                    "min-h-10 flex-1 rounded-lg border px-2 text-sm",
                    distUnit === "km" ? "border-sky-500/40 bg-sky-500/10 text-sky-100" : "border-slate-700 text-slate-400",
                  )}
                >
                  {t.speed.distanceKm}
                </button>
                <button
                  type="button"
                  onClick={() => setDistUnit("mi")}
                  className={cn(
                    "min-h-10 flex-1 rounded-lg border px-2 text-sm",
                    distUnit === "mi" ? "border-sky-500/40 bg-sky-500/10 text-sky-100" : "border-slate-700 text-slate-400",
                  )}
                >
                  {t.speed.distanceMi}
                </button>
              </div>
              <input
                type="text"
                inputMode="decimal"
                value={distRaw}
                onChange={(e) => setDistRaw(e.target.value)}
                placeholder="0"
                className={cn(
                  "min-h-11 w-full rounded-lg border bg-slate-950/60 px-3 text-lg tabular-nums text-white outline-none",
                  distInvalid ? "border-rose-500/50" : "border-slate-700",
                )}
              />
              {distInvalid ? <p className="text-xs text-rose-400/90">{t.speed.negativeNotAllowed}</p> : null}
            </div>
          )}

          {(travelMode === "distance" || travelMode === "speed") && (
            <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/40 p-3">
              <span className="text-xs font-medium text-slate-400">{t.speed.timeLabel}</span>
              <p className="text-[11px] text-slate-500">{t.speed.timeHint}</p>
              <input
                type="text"
                inputMode="decimal"
                value={timeRaw}
                onChange={(e) => setTimeRaw(e.target.value)}
                placeholder="1"
                className={cn(
                  "min-h-11 w-full rounded-lg border bg-slate-950/60 px-3 text-lg tabular-nums text-white outline-none",
                  timeInvalid ? "border-rose-500/50" : "border-slate-700",
                )}
              />
              {timeInvalid ? (
                <p className="text-xs text-rose-400/90">
                  {timeRaw.trim() !== "" && parseInputNumber(timeRaw) !== null && parseInputNumber(timeRaw)! <= 0
                    ? t.speed.zeroTime
                    : t.speed.invalidInput}
                </p>
              ) : null}
            </div>
          )}

          {(travelMode === "time" || travelMode === "distance") && (
            <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/40 p-3 sm:col-span-2">
              <UnitSelect
                label={t.speed.speedForTravel}
                unitId={travelSpeedUnit}
                options={SPEED_UNIT_IDS}
                onChange={(id) => setTravelSpeedUnit(id as SpeedUnitId)}
              />
              <input
                type="text"
                inputMode="decimal"
                value={travelSpeedRaw}
                onChange={(e) => setTravelSpeedRaw(e.target.value)}
                placeholder="0"
                className={cn(
                  "min-h-11 w-full rounded-lg border bg-slate-950/60 px-3 text-lg tabular-nums text-white outline-none",
                  travelSpeedInvalid ? "border-rose-500/50" : "border-slate-700",
                )}
              />
              {travelSpeedInvalid ? (
                <p className="text-xs text-rose-400/90">
                  {travelSpeedRaw.trim() !== "" && parseInputNumber(travelSpeedRaw) !== null && parseInputNumber(travelSpeedRaw)! <= 0
                    ? t.speed.zeroSpeed
                    : t.speed.invalidInput}
                </p>
              ) : null}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            {travelMode === "time" ? t.speed.resultTime : travelMode === "distance" ? t.speed.resultDistance : t.speed.resultSpeed}
          </p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-white">
            {travelResult?.kind === "time"
              ? formatDurationHours(travelResult.hours, {
                  hoursShort: t.speed.hoursShort,
                  minutesShort: t.speed.minutesShort,
                }) || "—"
              : travelResult?.kind === "distance"
                ? `${formatConverted(distanceFromKm(travelResult.km, distUnit))} ${distUnit === "km" ? t.speed.distanceKm : t.speed.distanceMi}`
                : travelResult?.kind === "speed"
                  ? `${travelResult.text} ${unitSymbol(lang, travelResultUnit)}`
                  : "—"}
          </p>
          {travelMode === "speed" ? (
            <div className="mt-3 max-w-xs">
              <UnitSelect
                label={t.speed.toUnit}
                unitId={travelResultUnit}
                options={SPEED_UNIT_IDS}
                onChange={(id) => setTravelResultUnit(id as SpeedUnitId)}
              />
            </div>
          ) : null}
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

function GridRow({
  id,
  value,
  highlight,
  copiedKey,
  onUse,
  onCopy,
}: {
  id: SpeedUnitId;
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
      <button type="button" disabled={!value} onClick={onUse} className="min-w-0 flex-1 text-left" title={t.speed.useAsSource}>
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

function TravelModeButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Timer;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-full border px-3 py-2 text-sm sm:flex-none sm:px-4",
        active ? "border-sky-400/45 bg-sky-500/15 text-sky-100" : "border-slate-800 text-slate-400",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </button>
  );
}