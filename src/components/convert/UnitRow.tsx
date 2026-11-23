"use client";

import { Check, Copy } from "lucide-react";

import { useI18n } from "@/i18n/context";
import { unitLabel } from "@/i18n/tools/get-copy";
import { cn } from "@/lib/cn";

export function UnitRow({
  unitId,
  value,
  active,
  onFocus,
  onChange,
  onCopy,
  copied,
}: {
  unitId: string;
  value: string;
  active: boolean;
  onFocus: () => void;
  onChange: (v: string) => void;
  onCopy: () => void;
  copied: boolean;
}) {
  const { lang, t } = useI18n();

  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-2 rounded-xl border px-3 py-2 transition-colors sm:gap-3",
        active
          ? "border-sky-400/50 bg-sky-500/10 ring-1 ring-sky-400/25"
          : "border-slate-800/90 bg-slate-900/40",
      )}
    >
      <label className="min-w-0 flex-1">
        <span className="block truncate text-xs font-medium text-slate-400">{unitLabel(lang, unitId)}</span>
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onFocus={onFocus}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t.converter.enterValue}
          className="mt-0.5 w-full min-w-0 bg-transparent text-base font-medium text-white outline-none placeholder:text-slate-600"
          aria-label={unitLabel(lang, unitId)}
        />
      </label>
      <button
        type="button"
        onClick={onCopy}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-700/80 text-slate-400 transition-colors hover:border-sky-500/40 hover:text-sky-200"
        aria-label={copied ? t.converter.copied : t.converter.copy}
      >
        {copied ? <Check className="h-4 w-4 text-sky-300" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}