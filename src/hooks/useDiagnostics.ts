import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { runDiagnostics, summarize, ALL_CHECKS } from '@/lib/diagnostics/engine';
import type { DiagnosticResult } from '@/lib/diagnostics/types';
import { readLastScan, saveScan } from '@/lib/offline/scanHistory';

export type ScanPhase = 'idle' | 'running' | 'complete' | 'cancelled';

export function useDiagnostics(autoStart = true) {
  const [results, setResults] = useState<Record<string, DiagnosticResult>>({});
  const [phase, setPhase] = useState<ScanPhase>('idle');
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [finishedAt, setFinishedAt] = useState<number | null>(null);
  /** True while the visible results come from the offline cache. */
  const [usingCache, setUsingCache] = useState(false);
  const [cachedAt, setCachedAt] = useState<number | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const scan = useCallback(async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    const runStartedAt = Date.now();
    setResults({});
    setFinishedAt(null);
    setStartedAt(runStartedAt);
    setUsingCache(false);
    setPhase('running');

    const collected: Record<string, DiagnosticResult> = {};
    await runDiagnostics({
      signal: controller.signal,
      onResult: (result) => {
        collected[result.id] = result;
        setResults((prev) => ({ ...prev, [result.id]: result }));
      },
    });

    if (!controller.signal.aborted) {
      const runFinishedAt = Date.now();
      setFinishedAt(runFinishedAt);
      setPhase('complete');
      setCachedAt(runFinishedAt);
      // Persist the run so the dashboard and log still work offline.
      void saveScan({
        startedAt: runStartedAt,
        finishedAt: runFinishedAt,
        results: Object.values(collected),
      });
    }
  }, []);

  const cancel = useCallback(() => {
    controllerRef.current?.abort();
    setPhase('cancelled');
  }, []);

  // Hydrate from the last stored run first, so the UI has content immediately
  // (and keeps working with no connection) while a fresh scan runs.
  useEffect(() => {
    let active = true;
    void (async () => {
      const stored = await readLastScan();
      if (!active || !stored) return;
      setResults((prev) => {
        if (Object.keys(prev).length > 0) return prev;
        setUsingCache(true);
        setCachedAt(stored.cachedAt);
        setStartedAt((current) => current ?? stored.record.startedAt);
        return Object.fromEntries(stored.record.results.map((r) => [r.id, r]));
      });
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (autoStart) void scan();
    return () => controllerRef.current?.abort();
  }, [autoStart, scan]);

  const list = useMemo(
    () =>
      ALL_CHECKS.map((def) => results[def.id]).filter(
        (r): r is DiagnosticResult => Boolean(r),
      ),
    [results],
  );

  const summary = useMemo(
    () => summarize(list, startedAt ?? Date.now()),
    [list, startedAt],
  );

  const progress = useMemo(() => {
    const settled = list.filter((r) => r.status !== 'pending').length;
    return ALL_CHECKS.length === 0 ? 0 : Math.round((settled / ALL_CHECKS.length) * 100);
  }, [list]);

  return {
    results: list,
    summary,
    phase,
    progress,
    startedAt,
    finishedAt,
    usingCache,
    cachedAt,
    durationMs: startedAt && finishedAt ? finishedAt - startedAt : undefined,
    scan,
    cancel,
  };
}
