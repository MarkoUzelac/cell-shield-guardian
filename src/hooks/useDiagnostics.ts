import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { runDiagnostics, summarize, ALL_CHECKS } from '@/lib/diagnostics/engine';
import type { DiagnosticResult } from '@/lib/diagnostics/types';

export type ScanPhase = 'idle' | 'running' | 'complete' | 'cancelled';

export function useDiagnostics(autoStart = true) {
  const [results, setResults] = useState<Record<string, DiagnosticResult>>({});
  const [phase, setPhase] = useState<ScanPhase>('idle');
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [finishedAt, setFinishedAt] = useState<number | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const scan = useCallback(async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setResults({});
    setFinishedAt(null);
    setStartedAt(Date.now());
    setPhase('running');

    await runDiagnostics({
      signal: controller.signal,
      onResult: (result) => {
        setResults((prev) => ({ ...prev, [result.id]: result }));
      },
    });

    if (!controller.signal.aborted) {
      setFinishedAt(Date.now());
      setPhase('complete');
    }
  }, []);

  const cancel = useCallback(() => {
    controllerRef.current?.abort();
    setPhase('cancelled');
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
    durationMs: startedAt && finishedAt ? finishedAt - startedAt : undefined,
    scan,
    cancel,
  };
}
