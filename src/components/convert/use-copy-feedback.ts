"use client";

import { useCallback, useState } from "react";

export function useCopyFeedback() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copy = useCallback(async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1500);
      return true;
    } catch {
      return false;
    }
  }, []);

  return { copiedKey, copy };
}