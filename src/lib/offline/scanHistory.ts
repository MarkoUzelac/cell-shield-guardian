import type { DiagnosticResult } from '@/lib/diagnostics/types';
import { CACHE_KEYS, readEntry, writeEntry, deleteEntry } from './store';

export interface ScanRecord {
  /** Epoch ms the scan started — also the record id. */
  startedAt: number;
  finishedAt: number;
  results: DiagnosticResult[];
}

/** Keeps the log bounded so the cache can't grow without limit. */
export const MAX_HISTORY = 25;

export const readLastScan = async (): Promise<{ record: ScanRecord; cachedAt: number } | null> => {
  const entry = await readEntry<ScanRecord>(CACHE_KEYS.lastScan);
  return entry ? { record: entry.value, cachedAt: entry.cachedAt } : null;
};

export const readHistory = async (): Promise<ScanRecord[]> => {
  const entry = await readEntry<ScanRecord[]>(CACHE_KEYS.scanHistory);
  return entry?.value ?? [];
};

/** Persists a completed run as both "last scan" and a history entry. */
export const saveScan = async (record: ScanRecord): Promise<void> => {
  await writeEntry(CACHE_KEYS.lastScan, record);
  const history = await readHistory();
  const next = [record, ...history.filter((r) => r.startedAt !== record.startedAt)].slice(
    0,
    MAX_HISTORY,
  );
  await writeEntry(CACHE_KEYS.scanHistory, next);
};

export const clearHistory = async (): Promise<void> => {
  await Promise.all([deleteEntry(CACHE_KEYS.scanHistory), deleteEntry(CACHE_KEYS.lastScan)]);
};

/** Newline-delimited JSON export so a log can be inspected offline. */
export const historyToNdjson = (history: ScanRecord[]): string =>
  history.map((record) => JSON.stringify(record)).join('\n');
