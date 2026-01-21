// src/lib/exportHistory.ts
export type ExportFormat = "Excel";

export type ExportHistoryItem = {
  id: string;
  dateIso: string;
  format: ExportFormat;
  url: string;
  maxItems?: 10;
};

const HISTORY_KEY = "export_history_v1";
const HISTORY_EVENT = "export_history_updated";

function isBrowser() {
  return typeof window !== "undefined";
}

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function uuid() {
  // crypto.randomUUID is modern; fallback for older browsers
  if (isBrowser() && "crypto" in window && "randomUUID" in crypto)
    return crypto.randomUUID();
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function emitUpdated() {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event(HISTORY_EVENT));
}

export function getExportHistory(): ExportHistoryItem[] {
  if (!isBrowser()) return [];
  return safeParse<ExportHistoryItem[]>(localStorage.getItem(HISTORY_KEY), []);
}

export function addExportHistoryItem(input: {
  format: ExportFormat;
  url: string;
  date?: Date; // optioneel
  maxItems?: number; // optioneel, default 20
}): ExportHistoryItem {
  if (!isBrowser()) {
    // In practice wordt dit enkel client-side gebruikt.
    return {
      id: "server",
      dateIso: new Date().toISOString(),
      format: input.format,
      url: input.url,
      maxItems: 10,
    };
  }

  const item: ExportHistoryItem = {
    id: uuid(),
    dateIso: (input.date ?? new Date()).toISOString(),
    format: input.format,
    url: input.url,
  };

  const prev = getExportHistory();
  const maxItems = input.maxItems ?? 10;

  const next = [item, ...prev].slice(0, maxItems);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  emitUpdated();

  return item;
}

export function clearExportHistory() {
  if (!isBrowser()) return;
  localStorage.removeItem(HISTORY_KEY);
  emitUpdated();
}

/**
 * Handig voor components die live willen updaten als ergens anders gelogd wordt.
 * Returnt een unsubscribe functie.
 */
export function subscribeExportHistoryUpdated(cb: () => void) {
  if (!isBrowser()) return () => {};
  const handler = () => cb();
  window.addEventListener(HISTORY_EVENT, handler);
  return () => window.removeEventListener(HISTORY_EVENT, handler);
}

export function formatExportHistoryDate(iso: string, locale = "nl-BE") {
  return new Date(iso).toLocaleString(locale);
}
