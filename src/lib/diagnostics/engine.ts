import { browserChecks } from './checks/browser';
import { connectionChecks } from './checks/connection';
import { networkChecks } from './checks/network';
import { privacyChecks } from './checks/privacy';
import { securityChecks } from './checks/security';
import { make } from './shared';
import type {
  DiagnosticCategory,
  DiagnosticDefinition,
  DiagnosticResult,
  DiagnosticStatus,
} from './types';

export const ALL_CHECKS: DiagnosticDefinition[] = [
  ...securityChecks,
  ...connectionChecks,
  ...networkChecks,
  ...privacyChecks,
  ...browserChecks,
];

export interface ScanSummary {
  overall: DiagnosticStatus;
  counts: Record<DiagnosticStatus, number>;
  startedAt: number;
  finishedAt?: number;
  durationMs?: number;
}

const STATUS_WEIGHT: Record<DiagnosticStatus, number> = {
  warning: 5,
  attention: 4,
  error: 3,
  unknown: 2,
  pending: 1,
  good: 0,
};

/**
 * Overall status is the worst *actionable* status. Unknown results never
 * upgrade the overall status to good on their own, and never trigger a
 * warning either — unknown is reported as unknown.
 */
export function summarize(results: DiagnosticResult[], startedAt: number): ScanSummary {
  const counts: Record<DiagnosticStatus, number> = {
    good: 0,
    attention: 0,
    warning: 0,
    unknown: 0,
    pending: 0,
    error: 0,
  };
  results.forEach((r) => {
    counts[r.status] += 1;
  });

  let overall: DiagnosticStatus = 'unknown';
  if (results.length > 0) {
    if (counts.warning > 0) overall = 'warning';
    else if (counts.attention > 0) overall = 'attention';
    else if (counts.pending > 0) overall = 'pending';
    else if (counts.good > 0) overall = 'good';
  }

  return { overall, counts, startedAt };
}

export function worstStatus(results: DiagnosticResult[]): DiagnosticStatus {
  return results.reduce<DiagnosticStatus>(
    (worst, r) => (STATUS_WEIGHT[r.status] > STATUS_WEIGHT[worst] ? r.status : worst),
    'good',
  );
}

export function groupByCategory(results: DiagnosticResult[]) {
  const map = new Map<DiagnosticCategory, DiagnosticResult[]>();
  results.forEach((result) => {
    const list = map.get(result.category) ?? [];
    list.push(result);
    map.set(result.category, list);
  });
  return map;
}

function pendingResult(def: DiagnosticDefinition): DiagnosticResult {
  return make({
    id: def.id,
    label: def.label,
    category: def.category,
    status: 'pending',
    value: 'Checking…',
    source: 'derived',
    confidence: 'not-available',
    explanation: 'This check is still running.',
  });
}

function errorResult(def: DiagnosticDefinition, error: unknown): DiagnosticResult {
  const message = error instanceof Error ? error.message : String(error);
  return make({
    id: def.id,
    label: def.label,
    category: def.category,
    status: 'error',
    value: 'Check failed',
    source: 'derived',
    confidence: 'not-available',
    explanation: `This check could not complete: ${message}. Other results are unaffected.`,
    recommendation: 'Run the scan again.',
    raw: { error: message },
  });
}

export interface RunOptions {
  signal: AbortSignal;
  /** Called every time an individual result lands, for progressive rendering. */
  onResult: (result: DiagnosticResult) => void;
}

/**
 * Runs every diagnostic. Instant checks resolve first so the UI has content
 * immediately; slower checks run in parallel and stream in. One failing check
 * can never reject the whole run.
 */
export async function runDiagnostics({ signal, onResult }: RunOptions): Promise<void> {
  ALL_CHECKS.forEach((def) => onResult(pendingResult(def)));

  const execute = async (def: DiagnosticDefinition) => {
    if (signal.aborted) return;
    const start = performance.now();
    try {
      const result = await def.run(signal);
      if (signal.aborted) return;
      onResult({ ...result, durationMs: result.durationMs ?? performance.now() - start });
    } catch (error) {
      if (signal.aborted) return;
      onResult(errorResult(def, error));
    }
  };

  const instant = ALL_CHECKS.filter((c) => c.instant);
  const deferred = ALL_CHECKS.filter((c) => !c.instant);

  await Promise.allSettled(instant.map(execute));
  await Promise.allSettled(deferred.map(execute));
}
