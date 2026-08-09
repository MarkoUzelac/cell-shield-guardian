import type { DiagnosticResult } from '@/lib/diagnostics/types';

interface ReportMeta {
  startedAt: number | null;
  durationMs?: number;
  overall: string;
}

/**
 * Builds an export payload. Deliberately excludes anything that could identify
 * the user beyond the environment values already visible on screen.
 */
export function buildReport(results: DiagnosticResult[], meta: ReportMeta) {
  return {
    tool: 'Cell Shield Guardian — browser diagnostics',
    generatedAt: new Date().toISOString(),
    scanStartedAt: meta.startedAt ? new Date(meta.startedAt).toISOString() : null,
    scanDurationMs: meta.durationMs ?? null,
    overallStatus: meta.overall,
    note: 'All values were produced inside the browser. Items marked "Not available" could not be determined and must not be interpreted as safe.',
    results: results.map((r) => ({
      id: r.id,
      label: r.label,
      category: r.category,
      status: r.status,
      value: r.value,
      unit: r.unit ?? null,
      source: r.source,
      confidence: r.confidence,
      capability: r.capability,
      measuredAt: new Date(r.timestamp).toISOString(),
      explanation: r.explanation,
    })),
  };
}

export function downloadReport(results: DiagnosticResult[], meta: ReportMeta) {
  const blob = new Blob([JSON.stringify(buildReport(results, meta), null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `diagnostics-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
