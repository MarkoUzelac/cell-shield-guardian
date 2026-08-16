import { useCallback, useEffect, useRef, useState } from 'react';
import {
  liveStream,
  type LiveEvent,
  type LiveEventType,
  type LiveInterval,
} from '@/lib/live/liveBus';

export type LiveStreamState = {
  enabled: boolean;
  paused: boolean;
  intervalMs: number;
  lastTick: number | null;
  setEnabled: (enabled: boolean) => void;
  setIntervalMs: (intervalMs: LiveInterval) => void;
  refreshNow: () => void;
  /** Publish an event onto the stream (used by views reporting a result). */
  publish: (event: LiveEvent) => void;
};

/** Connection + controls for the local live stream. */
export function useLiveStream(): LiveStreamState {
  const [enabled, setEnabledState] = useState(liveStream.enabled);
  const [paused, setPaused] = useState(liveStream.isPaused);
  const [intervalMs, setIntervalState] = useState(liveStream.intervalMs);
  const [lastTick, setLastTick] = useState<number | null>(liveStream.lastTick);

  useEffect(
    () =>
      liveStream.subscribe((event) => {
        if (event.type === 'state') {
          setEnabledState(event.enabled);
          setIntervalState(event.intervalMs);
        } else if (event.type === 'paused') {
          setPaused(event.paused);
        } else if (event.type === 'tick') {
          setLastTick(event.at);
        }
      }),
    [],
  );

  return {
    enabled,
    paused,
    intervalMs,
    lastTick,
    setEnabled: useCallback((next: boolean) => liveStream.setEnabled(next), []),
    setIntervalMs: useCallback((next: LiveInterval) => liveStream.setInterval(next), []),
    refreshNow: useCallback(() => liveStream.emitTick(), []),
    publish: useCallback((event: LiveEvent) => liveStream.publish(event), []),
  };
}

/**
 * Run `handler` whenever the stream emits `type`. The handler is kept in a ref
 * so callers don't need to memoise it.
 */
export function useLiveEvent<T extends LiveEventType>(
  type: T,
  handler: (event: Extract<LiveEvent, { type: T }>) => void,
): void {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(
    () =>
      liveStream.subscribe((event) => {
        if (event.type === type) {
          handlerRef.current(event as Extract<LiveEvent, { type: T }>);
        }
      }),
    [type],
  );
}
