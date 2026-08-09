/**
 * Centralized diagnostic contract.
 *
 * Every check in the engine returns this shape so that UI components never
 * need to know how a value was obtained.
 */

export type DiagnosticCategory =
  | 'connection'
  | 'browser'
  | 'privacy'
  | 'security'
  | 'network';

/** Outcome of a single diagnostic. `unknown` is never treated as `good`. */
export type DiagnosticStatus =
  | 'good'
  | 'attention'
  | 'warning'
  | 'unknown'
  | 'pending'
  | 'error';

/** How the value was obtained. Displayed to the user verbatim. */
export type DiagnosticSource =
  | 'browser-api'
  | 'measured'
  | 'derived'
  | 'unavailable';

/** Transparency about how much the reported value can be trusted. */
export type Confidence =
  | 'confirmed'
  | 'measured'
  | 'estimated'
  | 'not-available';

export type CapabilitySupport =
  | 'SUPPORTED'
  | 'PARTIALLY_SUPPORTED'
  | 'UNSUPPORTED'
  | 'PERMISSION_REQUIRED'
  | 'NOT_APPLICABLE';

export interface DiagnosticResult {
  id: string;
  label: string;
  category: DiagnosticCategory;
  status: DiagnosticStatus;
  /** Short, human-readable value, e.g. "HTTPS" or "42 ms". */
  value: string;
  unit?: string;
  source: DiagnosticSource;
  confidence: Confidence;
  capability: CapabilitySupport;
  /** Timestamp (epoch ms) at which the result was produced. */
  timestamp: number;
  /** Duration of the check in ms, when meaningful. */
  durationMs?: number;
  /** Plain-language explanation of what was found and why it matters. */
  explanation: string;
  /** Optional next step for the user. */
  recommendation?: string;
  /** Raw payload shown only in Technical Details. */
  raw?: Record<string, unknown>;
}

export interface DiagnosticDefinition {
  id: string;
  label: string;
  category: DiagnosticCategory;
  /** Checks marked instant run synchronously before any network work. */
  instant: boolean;
  run: (signal: AbortSignal) => Promise<DiagnosticResult> | DiagnosticResult;
}

export interface CategoryMeta {
  id: DiagnosticCategory;
  label: string;
  description: string;
}

export const CATEGORY_META: Record<DiagnosticCategory, CategoryMeta> = {
  connection: {
    id: 'connection',
    label: 'Connection',
    description: 'What your browser reports about how you are connected.',
  },
  browser: {
    id: 'browser',
    label: 'Browser',
    description: 'Environment details your browser exposes to every website.',
  },
  privacy: {
    id: 'privacy',
    label: 'Privacy',
    description: 'Browser-observable privacy signals. Nothing leaves your device.',
  },
  security: {
    id: 'security',
    label: 'Security',
    description: 'Transport and context security checks for this page.',
  },
  network: {
    id: 'network',
    label: 'Network',
    description: 'Values actively measured from your device right now.',
  },
};

export const CONFIDENCE_LABEL: Record<Confidence, string> = {
  confirmed: 'Confirmed',
  measured: 'Measured',
  estimated: 'Estimated',
  'not-available': 'Not available',
};

export const CONFIDENCE_HELP: Record<Confidence, string> = {
  confirmed: 'The browser exposed this value directly.',
  measured: 'This app measured the value on your device just now.',
  estimated: 'Inferred from available signals; may be inaccurate.',
  'not-available': 'Your browser does not expose the information needed.',
};

export const STATUS_LABEL: Record<DiagnosticStatus, string> = {
  good: 'Good',
  attention: 'Attention',
  warning: 'Warning',
  unknown: 'Unknown',
  pending: 'Checking',
  error: 'Check failed',
};
