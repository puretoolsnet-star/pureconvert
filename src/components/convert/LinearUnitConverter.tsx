"use client";

import { useCallback, useMemo, useState } from "react";

import { UnitRow } from "@/components/convert/UnitRow";
import { useCopyFeedback } from "@/components/convert/use-copy-feedback";
import { useI18n } from "@/i18n/context";
import { unitLabel } from "@/i18n/tools/get-copy";
import { kixtConvertEvent, pushKixtDataLayer } from "@/lib/analytics/kixt-gtm";
import { linearFromInput, type LinearUnitDef } from "@/lib/convert/linear";
import { SAMPLE_VALUES } from "@/lib/convert/samples";
import type { SubcategoryId, ToolRouteId } from "@/lib/tools/routes";

export function LinearUnitConverter({
  units,
  subcategory,
  routeId,
  defaultActiveUnit,
  sampleOverride,
}: {
  units: LinearUnitDef[];
  subcategory: SubcategoryId;
  routeId: ToolRouteId;
  defaultActiveUnit: string;
  sampleOverride?: Record<string, string>;
}) {
  const { lang, t } = useI18n();
  const { copiedKey, copy } = useCopyFeedback();
  const [activeUnit, setActiveUnit] = useState(defaultActiveUnit);
  const [rawValues, setRawValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const u of units) init[u.id] = "";
    return init;
  });

  const recompute = useCallback(
    (fromId: string, raw: string) => {
      const formatted = linearFromInput(units, fromId, raw);
      const next: Record<string, string> = {};
      for (const u of units) next[u.id] = formatted.get(u.id) ?? "";
      setRawValues(next);
    },
    [units],
  );

  const handleChange = useCallback(
    (unitId: string, raw: string) => {
      setActiveUnit(unitId);
      const next = { ...rawValues, [unitId]: raw };
      setRawValues(next);
      recompute(unitId, raw);
      pushKixtDataLayer(kixtConvertEvent("input", subcategory, { unit: unitId }));
    },
    [rawValues, recompute, subcategory],
  );

  const handleSample = useCallback(() => {
    const routeSample = sampleOverride ?? SAMPLE_VALUES[routeId];
    if (!routeSample || typeof routeSample !== "object") return;
    const entry = Object.entries(routeSample).find(([id]) => units.some((u) => u.id === id));
    if (!entry) return;
    const [unitId, val] = entry;
    setActiveUnit(unitId);
    handleChange(unitId, val);
    pushKixtDataLayer(kixtConvertEvent("sample", subcategory));
  }, [handleChange, routeId, sampleOverride, subcategory, units]);

  const handleClear = useCallback(() => {
    const empty: Record<string, string> = {};
    for (const u of units) empty[u.id] = "";
    setRawValues(empty);
  }, [units]);

  const copyAll = useCallback(async () => {
    const lines = units
      .map((u) => {
        const v = rawValues[u.id];
        if (!v) return null;
        return `${unitLabel(lang, u.id)}: ${v}`;
      })
      .filter(Boolean)
      .join("\n");
    if (lines) await copy("all", lines);
    pushKixtDataLayer(kixtConvertEvent("copy", subcategory, { scope: "all" }));
  }, [copy, lang, rawValues, subcategory, units]);

  const filledCount = useMemo(() => units.filter((u) => rawValues[u.id]?.trim()).length, [rawValues, units]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleSample}
          className="rounded-full border border-sky-500/35 bg-sky-500/10 px-4 py-2 text-sm font-medium text-sky-100 hover:bg-sky-500/20"
        >
          {t.converter.sample}
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-400 hover:border-slate-600 hover:text-slate-200"
        >
          {t.converter.clear}
        </button>
        {filledCount > 0 ? (
          <button
            type="button"
            onClick={copyAll}
            className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-400 hover:border-slate-600 hover:text-slate-200"
          >
            {copiedKey === "all" ? t.converter.copied : t.converter.copyAll}
          </button>
        ) : null}
      </div>
      <p className="text-xs text-slate-500">
        {t.converter.allUnits} · <span className="text-sky-300/90">{t.converter.activeUnit}</span>
      </p>
      <ul className="grid gap-2 sm:grid-cols-2">
        {units.map((u) => (
          <li key={u.id} className="min-w-0">
            <UnitRow
              unitId={u.id}
              value={rawValues[u.id] ?? ""}
              active={activeUnit === u.id}
              onFocus={() => setActiveUnit(u.id)}
              onChange={(v) => handleChange(u.id, v)}
              onCopy={() => {
                const v = rawValues[u.id];
                if (v) {
                  copy(u.id, v);
                  pushKixtDataLayer(kixtConvertEvent("copy", subcategory, { unit: u.id }));
                }
              }}
              copied={copiedKey === u.id}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}