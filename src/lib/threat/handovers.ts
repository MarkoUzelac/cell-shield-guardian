/**
 * Handover observation.
 *
 * A web page cannot see real cellular handovers (cell ID, LAC/TAC, RRC state
 * are all below the browser sandbox). What it *can* observe is every
 * transition of the connection the browser is actually using: the Network
 * Information API fires `change` when the effective type, downlink or RTT
 * moves, and `online`/`offline` fire when the interface flaps.
 *
 * Those transitions are the browser-observable analogue of a handover, and
 * they are what the Threat Score reasons about. Nothing here is generated or
 * guessed — an event only exists because the browser reported a change.
 */

import { CACHE_KEYS, readEntry, writeEntry, deleteEntry } from '@/lib/offline/store';
import { getConnection } from '@/lib/diagnostics/checks/connection';

export type HandoverKind =
  | 'type-change'
  | 'downgrade'
  | 'upgrade'
  | 'offline'
  | 'online'
  | 'quality-shift';

export interface HandoverEvent {
  /** Epoch ms the transition was observed. */
  at: number;
  kind: HandoverKind;
  from: string | null;
  to: string | null;
  /** Round-trip time reported at the moment of the transition, when exposed. */
  rttMs: number | null;
  downlinkMbps: number | null;
}

/** Keeps the on-device log bounded. */
export const MAX_HANDOVERS = 120;

/** Ordering of effective types, used to tell a downgrade from an upgrade. */
const TYPE_RANK: Record<string, number> = {
  'slow-2g': 0,
  '2g': 1,
  '3g': 2,
  '4g': 3,
  '5g': 4,
};

const rank = (type: string | null): number | null => {
  if (!type) return null;
  const value = TYPE_RANK[type.toLowerCase()];
  return value === undefined ? null : value;
};

export const readHandovers = async (): Promise<HandoverEvent[]> => {
  const entry = await readEntry<HandoverEvent[]>(CACHE_KEYS.handovers);
  return entry?.value ?? [];
};

export const clearHandovers = async (): Promise<void> => {
  await deleteEntry(CACHE_KEYS.handovers);
};

const append = async (event: HandoverEvent): Promise<HandoverEvent[]> => {
  const history = await readHandovers();
  const next = [event, ...history].slice(0, MAX_HANDOVERS);
  await writeEntry(CACHE_KEYS.handovers, next);
  return next;
};

interface Snapshot {
  effectiveType: string | null;
  rttMs: number | null;
  downlinkMbps: number | null;
  online: boolean;
}

const snapshot = (): Snapshot => {
  const c = getConnection();
  return {
    effectiveType: c?.effectiveType ?? c?.type ?? null,
    rttMs: typeof c?.rtt === 'number' ? c.rtt : null,
    downlinkMbps: typeof c?.downlink === 'number' ? c.downlink : null,
    online: typeof navigator === 'undefined' ? true : navigator.onLine,
  };
};

/** A quality move only counts once it is large enough to not be jitter. */
const RTT_SHIFT_MS = 150;

const classify = (prev: Snapshot, now: Snapshot): HandoverEvent | null => {
  const base = { at: Date.now(), rttMs: now.rttMs, downlinkMbps: now.downlinkMbps };

  if (prev.online && !now.online) {
    return { ...base, kind: 'offline', from: prev.effectiveType, to: null };
  }
  if (!prev.online && now.online) {
    return { ...base, kind: 'online', from: null, to: now.effectiveType };
  }
  if (prev.effectiveType !== now.effectiveType) {
    const before = rank(prev.effectiveType);
    const after = rank(now.effectiveType);
    let kind: HandoverKind = 'type-change';
    if (before !== null && after !== null) kind = after < before ? 'downgrade' : 'upgrade';
    return { ...base, kind, from: prev.effectiveType, to: now.effectiveType };
  }
  if (
    prev.rttMs !== null &&
    now.rttMs !== null &&
    Math.abs(now.rttMs - prev.rttMs) >= RTT_SHIFT_MS
  ) {
    return {
      ...base,
      kind: 'quality-shift',
      from: `${prev.rttMs} ms`,
      to: `${now.rttMs} ms`,
    };
  }
  return null;
};

type Listener = (events: HandoverEvent[]) => void;

let previous: Snapshot | null = null;
let started = false;
const listeners = new Set<Listener>();

const emit = (events: HandoverEvent[]) => listeners.forEach((l) => l(events));

const handleChange = () => {
  const now = snapshot();
  if (!previous) {
    previous = now;
    return;
  }
  const event = classify(previous, now);
  previous = now;
  if (!event) return;
  void append(event).then(emit);
};

/**
 * Starts observing transitions. Safe to call from several components — the
 * listeners are attached once for the lifetime of the page.
 */
export const startHandoverMonitor = (): void => {
  if (started || typeof window === 'undefined') return;
  started = true;
  previous = snapshot();

  window.addEventListener('online', handleChange);
  window.addEventListener('offline', handleChange);

  const connection = getConnection() as (EventTarget & { addEventListener?: unknown }) | undefined;
  if (connection && typeof connection.addEventListener === 'function') {
    connection.addEventListener('change', handleChange);
  }
};

export const subscribeHandovers = (listener: Listener): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/** Forces a comparison against the current connection state (used on tick). */
export const sampleHandovers = (): void => {
  if (!started) startHandoverMonitor();
  else handleChange();
};

export interface HandoverSummary {
  /** Events inside the analysis window. */
  events: HandoverEvent[];
  windowMs: number;
  total: number;
  downgrades: number;
  flaps: number;
  qualityShifts: number;
  /** Transitions per minute across the window. */
  rate: number;
  /** Shortest gap between two consecutive transitions, in ms. */
  shortestGapMs: number | null;
  lastAt: number | null;
}

export const HANDOVER_WINDOW_MS = 15 * 60 * 1000;

/** Aggregates the raw log into the numbers the scoring engine consumes. */
export const summarizeHandovers = (
  events: HandoverEvent[],
  windowMs: number = HANDOVER_WINDOW_MS,
  now: number = Date.now(),
): HandoverSummary => {
  const inWindow = events
    .filter((e) => now - e.at <= windowMs)
    .sort((a, b) => b.at - a.at);

  let shortestGapMs: number | null = null;
  for (let i = 0; i < inWindow.length - 1; i += 1) {
    const gap = inWindow[i].at - inWindow[i + 1].at;
    if (shortestGapMs === null || gap < shortestGapMs) shortestGapMs = gap;
  }

  return {
    events: inWindow,
    windowMs,
    total: inWindow.length,
    downgrades: inWindow.filter((e) => e.kind === 'downgrade').length,
    flaps: inWindow.filter((e) => e.kind === 'offline' || e.kind === 'online').length,
    qualityShifts: inWindow.filter((e) => e.kind === 'quality-shift').length,
    rate: inWindow.length / (windowMs / 60000),
    shortestGapMs,
    lastAt: inWindow.length > 0 ? inWindow[0].at : null,
  };
};
