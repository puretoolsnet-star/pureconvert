"use client";

import { useI18n } from "@/i18n/context";
import { unitLabel, unitSymbol } from "@/i18n/tools/get-copy";
import { cn } from "@/lib/cn";

export function UnitSelect({
  unitId,
  options,
  onChange,
  label,
  className,
}: {
  unitId: string;
  options: readonly string[];
  onChange: (id: string) => void;
  label: string;
  className?: string;
}) {
  const { lang } = useI18n();

  return (
    <label className={cn("block min-w-0", className)}>
      <span className="text-xs font-medium text-slate-400">{label}</span>
      <select
        value={unitId}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 min-h-11 w-full min-w-0 appearance-none rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2.5 text-sm text-white outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30"
      >
        {options.map((id) => (
          <option key={id} value={id}>
            {unitSymbol(lang, id)} — {unitLabel(lang, id)}
          </option>
        ))}
      </select>
    </label>
  );
}