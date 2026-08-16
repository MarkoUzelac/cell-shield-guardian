/**
 * Local live stream.
 *
 * This project has no server and a browser cannot read radio-layer data
 * (IMSI, cell identity, tower broadcasts) — there is no Web API for it. So
 * instead of a WebSocket carrying invented cell records, this module is an
 * in-app publish/subscribe bus driven by a ticker: real measurements are
 * re-taken on an interval and pushed to every subscribed view (dashboard,
 * alerts, map) as they land.
 *
 * Same ergonomics as a socket (subscribe / events / connection state), no
 * fabricated data and no network dependency.
 */

export type LiveEvent =
  /** The ticker fired; consumers should re-measure. */
  | { type: 'tick'; at: number; sequence: number }
  /** A consumer finished a diagnostics run. */
  | { type: 'diagnostics'; at: number; total: number; issues: number }
  /** A consumer produced new/changed alerts. */
  | { type: 'alerts'; at: number; total: number; unacknowledged: number }
  /** A consumer refreshed map data. */
  | { type: 'towers'; at: number; count: number; cached: boolean }
  /** Live mode was turned on or off. */
  | { type: 'state'; enabled: boolean; intervalMs: number }
  /** Ticker paused (tab hidden) or resumed. */
  | { type: 'paused'; paused: boolean };

export type LiveEventType = LiveEvent['type'];
type Listener = (event: LiveEvent) => void;

/** Selectable refresh intervals, in milliseconds. */
export const LIVE_INTERVALS = [15_000, 30_000, 60_000, 300_000] as const;
export type LiveInterval = (typeof LIVE_INTERVALS)[number];

const DEFAULT_INTERVAL: LiveInterval = 30_000;
const STORAGE_KEY = 'csg.live-stream';

type PersistedState = { enabled: boolean; intervalMs: number };

const readPersisted = (): PersistedState => {
  const fallback: PersistedState = { enabled: false, intervalMs: DEFAULT_INTERVAL };
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return fallback;
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    const intervalMs = LIVE_INTERVALS.includes(parsed.intervalMs as LiveInterval)
      ? (parsed.intervalMs as LiveInterval)
      : DEFAULT_INTERVAL;
    return { enabled: parsed.enabled === true, intervalMs };
  } catch {
    return fallback;
  }
};

class LiveStream {
  private listeners = new Set<Listener>();
  private timer: ReturnType<typeof setInterval> | null = null;
  private sequence = 0;
  private state: PersistedState = readPersisted();
  private paused = false;
  private lastTickAt: number | null = null;
  private visibilityBound = false;

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  publish(event: LiveEvent): void {
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch {
        // A broken subscriber must never stop the stream.
      }
    });
  }

  get enabled(): boolean {
    return this.state.enabled;
  }

  get intervalMs(): number {
    return this.state.intervalMs;
  }

  get isPaused(): boolean {
    return this.paused;
  }

  get lastTick(): number | null {
    return this.lastTickAt;
  }

  setEnabled(enabled: boolean): void {
    if (this.state.enabled === enabled) return;
    this.state = { ...this.state, enabled };
    this.persist();
    this.publish({ type: 'state', enabled, intervalMs: this.state.intervalMs });
    if (enabled) {
      this.start();
      // Fire immediately so turning it on has a visible effect.
      this.emitTick();
    } else {
      this.stop();
    }
  }

  setInterval(intervalMs: LiveInterval): void {
    if (this.state.intervalMs === intervalMs) return;
    this.state = { ...this.state, intervalMs };
    this.persist();
    this.publish({ type: 'state', enabled: this.state.enabled, intervalMs });
    if (this.state.enabled) this.start();
  }

  /** Manually push a tick without waiting for the interval. */
  emitTick(): void {
    this.sequence += 1;
    this.lastTickAt = Date.now();
    this.publish({ type: 'tick', at: this.lastTickAt, sequence: this.sequence });
  }

  private persist(): void {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // Private mode / storage disabled — live mode just won't be remembered.
    }
  }

  private start(): void {
    this.stop();
    if (typeof window === 'undefined') return;
    this.bindVisibility();
    if (document.visibilityState === 'hidden') {
      this.setPaused(true);
      return;
    }
    this.setPaused(false);
    this.timer = setInterval(() => this.emitTick(), this.state.intervalMs);
  }

  private stop(): void {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.setPaused(false);
  }

  private setPaused(paused: boolean): void {
    if (this.paused === paused) return;
    this.paused = paused;
    this.publish({ type: 'paused', paused });
  }

  /**
   * Background tabs are throttled and re-measuring there wastes battery, so the
   * ticker sleeps while the page is hidden and catches up on return.
   */
  private bindVisibility(): void {
    if (this.visibilityBound || typeof document === 'undefined') return;
    this.visibilityBound = true;
    document.addEventListener('visibilitychange', () => {
      if (!this.state.enabled) return;
      if (document.visibilityState === 'hidden') {
        if (this.timer !== null) {
          clearInterval(this.timer);
          this.timer = null;
        }
        this.setPaused(true);
      } else {
        this.start();
        this.emitTick();
      }
    });
  }
}

export const liveStream = new LiveStream();
