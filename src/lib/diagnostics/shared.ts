import type {
  CapabilitySupport,
  Confidence,
  DiagnosticCategory,
  DiagnosticParams,
  DiagnosticResult,
  DiagnosticSource,
  DiagnosticStatus,
} from './types';


interface MakeArgs {
  id: string;
  label: string;
  category: DiagnosticCategory;
  status: DiagnosticStatus;
  value: string;
  unit?: string;
  source: DiagnosticSource;
  confidence: Confidence;
  capability?: CapabilitySupport;
  explanation: string;
  recommendation?: string;
  durationMs?: number;
  raw?: Record<string, unknown>;
  variant?: string;
  params?: DiagnosticParams;

}

export function make(args: MakeArgs): DiagnosticResult {
  return {
    capability: args.capability ?? 'SUPPORTED',
    timestamp: Date.now(),
    ...args,
  };
}

/**
 * Standard result for an API the current browser does not implement.
 * The `unavailable` variant lets locales phrase the "why" per check while
 * still falling back to the engine's English reason.
 */
export function unavailable(
  id: string,
  label: string,
  category: DiagnosticCategory,
  reason: string,
  capability: CapabilitySupport = 'UNSUPPORTED',
  params?: DiagnosticParams,
): DiagnosticResult {
  return make({
    id,
    label,
    category,
    status: 'unknown',
    value: 'Not available',
    source: 'unavailable',
    confidence: 'not-available',
    capability,
    explanation: reason,
    variant: 'unavailable',
    params,
  });
}


/** Rejects with an AbortError-like timeout, and aborts the passed controller. */
export function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  controller: AbortController,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      controller.abort();
      reject(new Error(`Timed out after ${ms} ms`));
    }, ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

/** Links an outer abort signal to a locally created controller. */
export function linkSignal(outer: AbortSignal, inner: AbortController) {
  if (outer.aborted) {
    inner.abort();
    return () => undefined;
  }
  const onAbort = () => inner.abort();
  outer.addEventListener('abort', onAbort);
  return () => outer.removeEventListener('abort', onAbort);
}
