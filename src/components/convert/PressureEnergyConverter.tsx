"use client";

import { ArrowLeftRight, Check, Copy, Droplets, Zap } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

import { UnitSelect } from "@/components/convert/UnitSelect";
import { useCopyFeedback } from "@/components/convert/use-copy-feedback";
import { useI18n } from "@/i18n/context";
import { unitLabel, unitSymbol } from "@/i18n/tools/get-copy";
import { kixtConvertEvent, pushKixtDataLayer } from "@/lib/analytics/kixt-gtm";
import { cn } from "@/lib/cn";
import {
  ENERGY_PRESETS,
  ENERGY_UNIT_IDS,
  allEnergyFromJoules,
  convertEnergy,
  fromJoules,
  toJoules,
  type EnergyPresetId,
  type EnergyUnitId,
} from "@/lib/convert/energy";
import {
  formatConverted,
  isInvalidInputRaw,
  isNegativeOrInvalidInput,
  parseInputNumber,
  parseNonNegativeNumber,
} from "@/lib/convert/format";
import {
  PRESSURE_PRESETS,
  PRESSURE_UNIT_IDS,
  allPressureFromPascals,
  convertPressure,
  fromPascals,
  toPascals,
  type PressurePresetId,
  type PressureUnitId,
} from "@/lib/convert/pressure";

type ActiveGroup = "pressure" | "energy";
type EditSide = "from" | "to";

const PRESSURE_PRESET_KEYS: Record<PressurePresetId, keyof import("@/i18n/types").Dictionary["pressureEnergy"]["pressure"]> = {
  tireBar: "presetTireBar",
  tirePsi: "presetTirePsi",
  atmosphere: "presetAtmosphere",
  hydraulic: "presetHydraulic",
};

const ENERGY_PRESET_KEYS: Record<EnergyPresetId, keyof import("@/i18n/types").Dictionary["pressureEnergy"]["energy"]> = {
  kwh: "presetKwh",
  whDevice: "presetWhDevice",
  dailyKcal: "presetDailyKcal",
  kilojoule: "presetKilojoule",
  megajoule: "presetMegajoule",
};

export function PressureEnergyConverter() {
  const { t } = useI18n();
  const [group, setGroup] = useState<ActiveGroup>("pressure");

  const switchGroup = (next: ActiveGroup) => {
    setGroup(next);
    pushKixtDataLayer(kixtConvertEvent("group_switch", "pressure-energy", { group: next }));
  };

  return (
    <div className="space-y-6">
      <p className="text-xs leading-relaxed text-slate-400">{t.pressureEnergy.independenceNote}</p>

      <div
        className="flex gap-2 rounded-2xl border border-slate-800 bg-slate-900/40 p-1"
        role="tablist"
        aria-label={t.pressureEnergy.independenceNote}
      >
        <GroupTab
          active={group === "pressure"}
          onClick={() => switchGroup("pressure")}
          icon={Droplets}
          label={t.pressureEnergy.switchPressure}
        />
        <GroupTab
          active={group === "energy"}
          onClick={() => switchGroup("energy")}
          icon={Zap}
          label={t.pressureEnergy.switchEnergy}
        />
      </div>

      {group === "pressure" ? (
        <PressureGroupPanel key="pressure-isolated" />
      ) : (
        <EnergyGroupPanel key="energy-isolated" />
      )}
    </div>
  );
}

function GroupTab({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Droplets;
  label: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
        active ? "bg-sky-500/20 text-sky-100 ring-1 ring-sky-500/35" : "text-slate-400 hover:text-slate-200",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden />
      {label}
    </button>
  );
}

function PressureGroupPanel() {
  const { lang, t } = useI18n();
  const copy = useCopyFeedback();
  const g = t.pressureEnergy.pressure;

  const [fromUnit, setFromUnit] = useState<PressureUnitId>("bar");
  const [toUnit, setToUnit] = useState<PressureUnitId>("psi");
  const [fromRaw, setFromRaw] = useState("");
  const [toRaw, setToRaw] = useState("");
  const [editSide, setEditSide] = useState<EditSide>("from");
  const [copyError, setCopyError] = useState(false);

  const pascals = useMemo(() => {
    const raw = editSide === "from" ? fromRaw : toRaw;
    const unit = editSide === "from" ? fromUnit : toUnit;
    if (raw.trim() === "") return null;
    const n = parseNonNegativeNumber(raw);
    if (n === null) return null;
    return toPascals(n, unit);
  }, [editSide, fromRaw, fromUnit, toRaw, toUnit]);

  const gridValues = useMemo(() => {
    if (pascals === null) return null;
    return allPressureFromPascals(pascals);
  }, [pascals]);

  const onFromValueChange = (raw: string) => {
    setFromRaw(raw);
    setEditSide("from");
    const n = parseNonNegativeNumber(raw);
    if (n === null) {
      if (raw.trim() === "") setToRaw("");
      return;
    }
    const converted = convertPressure(n, fromUnit, toUnit);
    if (converted !== null) setToRaw(formatConverted(converted));
    pushKixtDataLayer(kixtConvertEvent("input", "pressure-energy", { field: "from", group: "pressure" }));
  };

  const onToValueChange = (raw: string) => {
    setToRaw(raw);
    setEditSide("to");
    const n = parseNonNegativeNumber(raw);
    if (n === null) {
      if (raw.trim() === "") setFromRaw("");
      return;
    }
    const converted = convertPressure(n, toUnit, fromUnit);
    if (converted !== null) setFromRaw(formatConverted(converted));
    pushKixtDataLayer(kixtConvertEvent("input", "pressure-energy", { field: "to", group: "pressure" }));
  };

  const swap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromRaw(toRaw);
    setToRaw(fromRaw);
    setEditSide(editSide === "from" ? "to" : "from");
    pushKixtDataLayer(kixtConvertEvent("swap", "pressure-energy", { group: "pressure" }));
  };

  const clearAll = () => {
    setFromRaw("");
    setToRaw("");
    pushKixtDataLayer(kixtConvertEvent("clear", "pressure-energy", { group: "pressure" }));
  };

  const applyPreset = (id: PressurePresetId) => {
    const preset = PRESSURE_PRESETS[id];
    setFromUnit(preset.unit);
    setFromRaw(preset.value);
    setEditSide("from");
    const n = parseInputNumber(preset.value);
    if (n !== null) {
      const c = convertPressure(n, preset.unit, toUnit);
      if (c !== null) setToRaw(formatConverted(c));
    }
    pushKixtDataLayer(kixtConvertEvent("preset", "pressure-energy", { preset_id: id, group: "pressure" }));
  };

  const copyValue = async (key: string, text: string) => {
    setCopyError(!(await copy.copy(key, text)));
    pushKixtDataLayer(kixtConvertEvent("copy", "pressure-energy", { key, group: "pressure" }));
  };

  const useGridAsSource = (unitId: string, value: string) => {
    if (!value.trim()) return;
    setFromUnit(unitId as PressureUnitId);
    onFromValueChange(value);
  };

  const fromInvalid = fromRaw.trim() !== "" && (isInvalidInputRaw(fromRaw) || isNegativeOrInvalidInput(fromRaw));
  const toInvalid = toRaw.trim() !== "" && (isInvalidInputRaw(toRaw) || isNegativeOrInvalidInput(toRaw));

  return (
    <GroupPanelShell
      groupId="pressure"
      copy={copy}
      copyError={copyError}
      g={g}
      fromUnit={fromUnit}
      toUnit={toUnit}
      unitIds={PRESSURE_UNIT_IDS}
      fromRaw={fromRaw}
      toRaw={toRaw}
      fromInvalid={fromInvalid}
      toInvalid={toInvalid}
      invalidNeg={g.negativeNotAllowed}
      invalidFmt={g.invalidInput}
      gridValues={gridValues}
      editSide={editSide}
      lang={lang}
      onFromValueChange={onFromValueChange}
      onToValueChange={onToValueChange}
      onFromUnit={(id) => {
        const next = id as PressureUnitId;
        setFromUnit(next);
        if (pascals !== null) {
          const v = fromPascals(pascals, next);
          if (v !== null) setFromRaw(formatConverted(v));
          const toV = fromPascals(pascals, toUnit);
          if (toV !== null) setToRaw(formatConverted(toV));
        }
        pushKixtDataLayer(kixtConvertEvent("input", "pressure-energy", { unit_select: "from", group: "pressure" }));
      }}
      onToUnit={(id) => {
        const next = id as PressureUnitId;
        setToUnit(next);
        if (pascals !== null) {
          const v = fromPascals(pascals, next);
          if (v !== null) setToRaw(formatConverted(v));
        }
        pushKixtDataLayer(kixtConvertEvent("input", "pressure-energy", { unit_select: "to", group: "pressure" }));
      }}
      swap={swap}
      clearAll={clearAll}
      copyValue={copyValue}
      useGridAsSource={useGridAsSource}
      presets={
        <>
          {(Object.keys(PRESSURE_PRESETS) as PressurePresetId[]).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => applyPreset(id)}
              className="min-h-10 rounded-full border border-slate-700 bg-slate-900/50 px-3 py-2 text-xs text-slate-300 hover:border-sky-500/40 sm:text-sm"
            >
              {g[PRESSURE_PRESET_KEYS[id]]}
            </button>
          ))}
        </>
      }
    />
  );
}

function EnergyGroupPanel() {
  const { lang, t } = useI18n();
  const copy = useCopyFeedback();
  const g = t.pressureEnergy.energy;

  const [fromUnit, setFromUnit] = useState<EnergyUnitId>("kWh");
  const [toUnit, setToUnit] = useState<EnergyUnitId>("kJ");
  const [fromRaw, setFromRaw] = useState("");
  const [toRaw, setToRaw] = useState("");
  const [editSide, setEditSide] = useState<EditSide>("from");
  const [copyError, setCopyError] = useState(false);

  const joules = useMemo(() => {
    const raw = editSide === "from" ? fromRaw : toRaw;
    const unit = editSide === "from" ? fromUnit : toUnit;
    if (raw.trim() === "") return null;
    const n = parseNonNegativeNumber(raw);
    if (n === null) return null;
    return toJoules(n, unit);
  }, [editSide, fromRaw, fromUnit, toRaw, toUnit]);

  const gridValues = useMemo(() => {
    if (joules === null) return null;
    return allEnergyFromJoules(joules);
  }, [joules]);

  const onFromValueChange = (raw: string) => {
    setFromRaw(raw);
    setEditSide("from");
    const n = parseNonNegativeNumber(raw);
    if (n === null) {
      if (raw.trim() === "") setToRaw("");
      return;
    }
    const converted = convertEnergy(n, fromUnit, toUnit);
    if (converted !== null) setToRaw(formatConverted(converted));
    pushKixtDataLayer(kixtConvertEvent("input", "pressure-energy", { field: "from", group: "energy" }));
  };

  const onToValueChange = (raw: string) => {
    setToRaw(raw);
    setEditSide("to");
    const n = parseNonNegativeNumber(raw);
    if (n === null) {
      if (raw.trim() === "") setFromRaw("");
      return;
    }
    const converted = convertEnergy(n, toUnit, fromUnit);
    if (converted !== null) setFromRaw(formatConverted(converted));
    pushKixtDataLayer(kixtConvertEvent("input", "pressure-energy", { field: "to", group: "energy" }));
  };

  const swap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromRaw(toRaw);
    setToRaw(fromRaw);
    setEditSide(editSide === "from" ? "to" : "from");
    pushKixtDataLayer(kixtConvertEvent("swap", "pressure-energy", { group: "energy" }));
  };

  const clearAll = () => {
    setFromRaw("");
    setToRaw("");
    pushKixtDataLayer(kixtConvertEvent("clear", "pressure-energy", { group: "energy" }));
  };

  const applyPreset = (id: EnergyPresetId) => {
    const preset = ENERGY_PRESETS[id];
    setFromUnit(preset.unit);
    setFromRaw(preset.value);
    setEditSide("from");
    const n = parseInputNumber(preset.value);
    if (n !== null) {
      const c = convertEnergy(n, preset.unit, toUnit);
      if (c !== null) setToRaw(formatConverted(c));
    }
    pushKixtDataLayer(kixtConvertEvent("preset", "pressure-energy", { preset_id: id, group: "energy" }));
  };

  const copyValue = async (key: string, text: string) => {
    setCopyError(!(await copy.copy(key, text)));
    pushKixtDataLayer(kixtConvertEvent("copy", "pressure-energy", { key, group: "energy" }));
  };

  const useGridAsSource = (unitId: string, value: string) => {
    if (!value.trim()) return;
    setFromUnit(unitId as EnergyUnitId);
    onFromValueChange(value);
  };

  const fromInvalid = fromRaw.trim() !== "" && (isInvalidInputRaw(fromRaw) || isNegativeOrInvalidInput(fromRaw));
  const toInvalid = toRaw.trim() !== "" && (isInvalidInputRaw(toRaw) || isNegativeOrInvalidInput(toRaw));

  return (
    <GroupPanelShell
      groupId="energy"
      copy={copy}
      copyError={copyError}
      g={g}
      fromUnit={fromUnit}
      toUnit={toUnit}
      unitIds={ENERGY_UNIT_IDS}
      fromRaw={fromRaw}
      toRaw={toRaw}
      fromInvalid={fromInvalid}
      toInvalid={toInvalid}
      invalidNeg={g.negativeNotAllowed}
      invalidFmt={g.invalidInput}
      gridValues={gridValues}
      editSide={editSide}
      lang={lang}
      onFromValueChange={onFromValueChange}
      onToValueChange={onToValueChange}
      onFromUnit={(id) => {
        const next = id as EnergyUnitId;
        setFromUnit(next);
        if (joules !== null) {
          const v = fromJoules(joules, next);
          if (v !== null) setFromRaw(formatConverted(v));
          const toV = fromJoules(joules, toUnit);
          if (toV !== null) setToRaw(formatConverted(toV));
        }
        pushKixtDataLayer(kixtConvertEvent("input", "pressure-energy", { unit_select: "from", group: "energy" }));
      }}
      onToUnit={(id) => {
        const next = id as EnergyUnitId;
        setToUnit(next);
        if (joules !== null) {
          const v = fromJoules(joules, next);
          if (v !== null) setToRaw(formatConverted(v));
        }
        pushKixtDataLayer(kixtConvertEvent("input", "pressure-energy", { unit_select: "to", group: "energy" }));
      }}
      swap={swap}
      clearAll={clearAll}
      copyValue={copyValue}
      useGridAsSource={useGridAsSource}
      presets={
        <>
          {(Object.keys(ENERGY_PRESETS) as EnergyPresetId[]).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => applyPreset(id)}
              className="min-h-10 rounded-full border border-slate-700 bg-slate-900/50 px-3 py-2 text-xs text-slate-300 hover:border-sky-500/40 sm:text-sm"
            >
              {g[ENERGY_PRESET_KEYS[id]]}
            </button>
          ))}
        </>
      }
    />
  );
}

type GroupCopy = Pick<
  import("@/i18n/types").Dictionary["pressureEnergy"]["pressure"],
  | "mainTitle"
  | "fromUnit"
  | "toUnit"
  | "swapAria"
  | "allUnitsTitle"
  | "allUnitsHint"
  | "presetsTitle"
  | "presetsHint"
  | "invalidInput"
  | "negativeNotAllowed"
  | "copyFailed"
  | "useAsSource"
>;

function GroupPanelShell({
  groupId,
  copy,
  copyError,
  g,
  fromUnit,
  toUnit,
  unitIds,
  fromRaw,
  toRaw,
  fromInvalid,
  toInvalid,
  invalidNeg,
  invalidFmt,
  gridValues,
  editSide,
  lang,
  onFromValueChange,
  onToValueChange,
  onFromUnit,
  onToUnit,
  swap,
  clearAll,
  copyValue,
  useGridAsSource,
  presets,
}: {
  groupId: string;
  copy: ReturnType<typeof useCopyFeedback>;
  copyError: boolean;
  g: GroupCopy;
  fromUnit: string;
  toUnit: string;
  unitIds: readonly string[];
  fromRaw: string;
  toRaw: string;
  fromInvalid: boolean;
  toInvalid: boolean;
  invalidNeg: string;
  invalidFmt: string;
  gridValues: Map<string, string> | null;
  editSide: EditSide;
  lang: import("@/i18n/locales").Lang;
  onFromValueChange: (v: string) => void;
  onToValueChange: (v: string) => void;
  onFromUnit: (id: string) => void;
  onToUnit: (id: string) => void;
  swap: () => void;
  clearAll: () => void;
  copyValue: (key: string, text: string) => void;
  useGridAsSource: (unitId: string, value: string) => void;
  presets: ReactNode;
}) {
  const { t } = useI18n();

  return (
    <div className="space-y-8" role="tabpanel" id={`panel-${groupId}`} aria-labelledby={`tab-${groupId}`}>
      <section className="space-y-4">
        <SectionBlock title={g.mainTitle}>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{g.presetsTitle}</p>
          <div className="flex flex-wrap gap-2">
            {presets}
            <button
              type="button"
              onClick={clearAll}
              className="min-h-10 rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-400"
            >
              {t.converter.clear}
            </button>
          </div>
          <p className="text-xs text-slate-500">{g.presetsHint}</p>
        </SectionBlock>

        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-end">
          <ValueField
            value={fromRaw}
            onChange={onFromValueChange}
            invalid={fromInvalid}
            invalidText={isNegativeOrInvalidInput(fromRaw) ? invalidNeg : invalidFmt}
            select={<UnitSelect label={g.fromUnit} unitId={fromUnit} options={[...unitIds]} onChange={onFromUnit} />}
          />
          <button
            type="button"
            onClick={swap}
            aria-label={g.swapAria}
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-sky-500/35 bg-sky-500/15 text-sky-200 md:mb-1"
          >
            <ArrowLeftRight className="h-5 w-5" />
          </button>
          <ValueField
            value={toRaw}
            onChange={onToValueChange}
            invalid={toInvalid}
            invalidText={isNegativeOrInvalidInput(toRaw) ? invalidNeg : invalidFmt}
            select={<UnitSelect label={g.toUnit} unitId={toUnit} options={[...unitIds]} onChange={onToUnit} />}
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
            {copy.copiedKey === "main-to" ? t.converter.copied : t.converter.copy}
          </button>
          {gridValues ? (
            <button
              type="button"
              onClick={() => {
                const lines = unitIds
                  .map((id) => {
                    const v = gridValues.get(id);
                    return v ? `${unitSymbol(lang, id)}: ${v}` : null;
                  })
                  .filter(Boolean)
                  .join("\n");
                void copyValue("main-all", lines);
              }}
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-700 px-4 py-2 text-sm"
            >
              <Copy className="h-4 w-4" />
              {copy.copiedKey === "main-all" ? t.converter.copied : t.converter.copyAll}
            </button>
          ) : null}
        </div>
        {copyError ? <p className="text-xs text-rose-400/90">{g.copyFailed}</p> : null}
      </section>

      <section className="space-y-3">
        <SectionBlock title={g.allUnitsTitle}>
          <p className="text-xs text-slate-500">{g.allUnitsHint}</p>
        </SectionBlock>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {unitIds.map((id) => (
            <li key={id} className="min-w-0">
              <div
                className={cn(
                  "flex min-w-0 items-center gap-2 rounded-xl border px-3 py-2",
                  editSide === "from" ? id === fromUnit : id === toUnit
                    ? "border-sky-500/35 bg-sky-500/10"
                    : "border-slate-800 bg-slate-900/50",
                  !gridValues?.get(id) && "opacity-60",
                )}
              >
                <button
                  type="button"
                  disabled={!gridValues?.get(id)}
                  onClick={() => useGridAsSource(id, gridValues?.get(id) ?? "")}
                  className="min-w-0 flex-1 text-left"
                  title={g.useAsSource}
                >
                  <span className="block truncate text-[11px] text-slate-500">
                    <span className="text-sky-300/90">{unitSymbol(lang, id)}</span>
                    <span className="mx-1 text-slate-600">·</span>
                    <span className="truncate">{unitLabel(lang, id)}</span>
                  </span>
                  <span className="mt-0.5 block text-base font-semibold tabular-nums text-white">
                    {gridValues?.get(id) ?? "—"}
                  </span>
                </button>
                <button
                  type="button"
                  disabled={!gridValues?.get(id)}
                  onClick={() => copyValue(`grid-${id}`, gridValues?.get(id) ?? "")}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-700/80 text-slate-400 hover:border-sky-500/40 disabled:opacity-40"
                  aria-label={copy.copiedKey === `grid-${id}` ? t.converter.copied : t.converter.copy}
                >
                  {copy.copiedKey === `grid-${id}` ? <Check className="h-4 w-4 text-sky-300" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function SectionBlock({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-white">{title}</h2>
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