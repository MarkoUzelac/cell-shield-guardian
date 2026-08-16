import { useCallback, useEffect, useMemo, useState } from 'react';
import type { DiagnosticResult } from '@/lib/diagnostics/types';
import {
  HANDOVER_WINDOW_MS,
  clearHandovers,
  readHandovers,
  sampleHandovers,
  startHandoverMonitor,
  subscribeHandovers,
  summarizeHandovers,
  type HandoverEvent,
  type HandoverSummary,
} from '@/lib/threat/handovers';
import { computeThreatScore, type ThreatFactor, type ThreatScore } from '@/lib/threat/threatScore';
import { useLiveEvent } from '@/hooks/useLiveStream';

interface UseThreatScoreResult {
  threat: ThreatScore;
  handovers: HandoverSummary;
  resetHandovers: () => Promise<void>;
}

/**
 * Keeps the observed handover log in sync and recomputes the Threat Score
 * whenever diagnostics change, a transition is observed, or the live stream
 * ticks.
 */
export const useThreatScore = (
  diagnostics: DiagnosticResult[],
  extraFactors: ThreatFactor[] = [],
): UseThreatScoreResult => {
  const [events, setEvents] = useState<HandoverEvent[]>([]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    startHandoverMonitor();
    let active = true;
    void readHandovers().then((stored) => {
      if (active) setEvents(stored);
    });
    const unsubscribe = subscribeHandovers((next) => {
      setEvents(next);
      setNow(Date.now());
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  // Re-sample on every live tick so a change that fired while the tab was
  // hidden is still recorded, and so the window slides forward.
  useLiveEvent('tick', () => {
    sampleHandovers();
    setNow(Date.now());
  });

  const handovers = useMemo(
    () => summarizeHandovers(events, HANDOVER_WINDOW_MS, now),
    [events, now],
  );

  const threat = useMemo(
    () => computeThreatScore({ diagnostics, handovers, extraFactors }),
    // `extraFactors` is rebuilt by callers with useMemo, so it is stable.
    [diagnostics, handovers, extraFactors],
  );

  const resetHandovers = useCallback(async () => {
    await clearHandovers();
    setEvents([]);
    setNow(Date.now());
  }, []);

  return { threat, handovers, resetHandovers };
};
