/**
 * Threat Score.
 *
 * A single 0–100 number summarising how exposed this session looks, derived
 * from two inputs that are both real measurements taken on this device:
 *
 *  1. Handover patterns — connection transitions the browser reported
 *     (see `src/lib/threat/handovers.ts`): downgrades, interface flaps,
 *     transition rate and the shortest gap between transitions.
 *  2. Diagnostic anomalies — the outcome of the in-browser diagnostic run
 *     (warnings, errors and attention items, weighted by category).
 *
 * The score is deliberately *not* a claim about IMSI catchers or rogue base
 * stations: nothing in a browser can observe the radio layer. It scores what
 * is observable, and every factor exposes its own contribution so the number
 * can always be explained.
 */

import type { DiagnosticResult } from '@/lib/diagnostics/types';
import type { HandoverSummary } from './handovers';

export type ThreatLevel = 'low' | 'moderate' | 'elevated' | 'high';

export interface ThreatFactor {
  /** i18n key suffix under `threat.factors`. */
  id: string;
  /** 0–1 normalised severity for this factor. */
  ratio: number;
  /** Share of the total score this factor can contribute (0–1). */
  weight: number;
  /** Points this factor added to the final score. */
  points: number;
  /** Values interpolated into the factor's translated description. */
  params: Record<string, string | number>;
}

export interface ThreatScore {
  /** 0–100, rounded. */
  score: number;
  level: ThreatLevel;
  factors: ThreatFactor[];
  /** Factors sorted by contribution, highest first. */
  topFactors: ThreatFactor[];
  /** Epoch ms the score was computed. */
  at: number;
  /** True when there is not enough observed data to be meaningful yet. */
  sparse: boolean;
}

/**
 * Weights sum to 1. Diagnostics carry more weight than handovers because they
 * are direct measurements, while handover patterns are contextual signals.
 */
export const THREAT_WEIGHTS = {
  criticalFindings: 0.24,
  attentionFindings: 0.11,
  insecureTransport: 0.15,
  handoverRate: 0.14,
  downgrades: 0.16,
  connectionFlaps: 0.12,
  unavailableVisibility: 0.08,
} as const;

const clamp01 = (n: number): number => Math.min(1, Math.max(0, n));

/** Saturating curve: `value` reaches 1 at `full`, with diminishing returns. */
const saturate = (value: number, full: number): number =>
  full <= 0 ? 0 : clamp01(Math.sqrt(clamp01(value / full)));

export const levelForScore = (score: number): ThreatLevel => {
  if (score >= 75) return 'high';
  if (score >= 50) return 'elevated';
  if (score >= 25) return 'moderate';
  return 'low';
};

/** Diagnostics that describe how exposed the transport itself is. */
const INSECURE_IDS = ['security.https', 'security.tls', 'privacy.dns', 'security.mixed-content'];

export interface ThreatInput {
  diagnostics: DiagnosticResult[];
  handovers: HandoverSummary;
  /** Extra factors contributed by another surface, e.g. file metadata. */
  extraFactors?: ThreatFactor[];
}

export const computeThreatScore = ({
  diagnostics,
  handovers,
  extraFactors = [],
}: ThreatInput): ThreatScore => {
  const critical = diagnostics.filter((d) => d.status === 'warning' || d.status === 'error');
  const attention = diagnostics.filter((d) => d.status === 'attention');
  const unavailable = diagnostics.filter(
    (d) => d.confidence === 'not-available' || d.capability === 'UNSUPPORTED',
  );
  const insecure = critical.filter((d) =>
    INSECURE_IDS.some((id) => d.id.startsWith(id)) || d.category === 'security',
  );

  const factors: ThreatFactor[] = [
    {
      id: 'criticalFindings',
      ratio: saturate(critical.length, 6),
      weight: THREAT_WEIGHTS.criticalFindings,
      points: 0,
      params: { count: critical.length },
    },
    {
      id: 'attentionFindings',
      ratio: saturate(attention.length, 8),
      weight: THREAT_WEIGHTS.attentionFindings,
      points: 0,
      params: { count: attention.length },
    },
    {
      id: 'insecureTransport',
      ratio: saturate(insecure.length, 3),
      weight: THREAT_WEIGHTS.insecureTransport,
      points: 0,
      params: { count: insecure.length },
    },
    {
      id: 'handoverRate',
      // Two or more transitions per minute is an unusually unstable session.
      ratio: saturate(handovers.rate, 2),
      weight: THREAT_WEIGHTS.handoverRate,
      points: 0,
      params: { rate: Math.round(handovers.rate * 10) / 10, count: handovers.total },
    },
    {
      id: 'downgrades',
      ratio: saturate(handovers.downgrades, 3),
      weight: THREAT_WEIGHTS.downgrades,
      points: 0,
      params: { count: handovers.downgrades },
    },
    {
      id: 'connectionFlaps',
      ratio: saturate(handovers.flaps, 4),
      weight: THREAT_WEIGHTS.connectionFlaps,
      points: 0,
      params: { count: handovers.flaps },
    },
    {
      id: 'unavailableVisibility',
      ratio: diagnostics.length > 0 ? clamp01(unavailable.length / diagnostics.length) : 0,
      weight: THREAT_WEIGHTS.unavailableVisibility,
      points: 0,
      params: { count: unavailable.length, total: diagnostics.length },
    },
    ...extraFactors,
  ];

  const totalWeight = factors.reduce((sum, f) => sum + f.weight, 0) || 1;
  const scored = factors.map((f) => ({
    ...f,
    points: Math.round(((f.ratio * f.weight) / totalWeight) * 100 * 10) / 10,
  }));

  const score = Math.round(scored.reduce((sum, f) => sum + f.points, 0));

  return {
    score,
    level: levelForScore(score),
    factors: scored,
    topFactors: [...scored].filter((f) => f.points > 0).sort((a, b) => b.points - a.points),
    at: Date.now(),
    sparse: diagnostics.length === 0,
  };
};

/**
 * Turns an analysed file into scoring factors, so the Metadata Analyzer can
 * show a Threat Score that blends the file's own exposure with the session's.
 */
export const metadataFactors = (input: {
  privacyRiskCount: number;
  hasGps: boolean;
  identifyingFieldCount: number;
}): ThreatFactor[] => [
  {
    id: 'fileGps',
    ratio: input.hasGps ? 1 : 0,
    weight: 0.2,
    points: 0,
    params: { count: input.hasGps ? 1 : 0 },
  },
  {
    id: 'filePrivacyRisks',
    ratio: saturate(input.privacyRiskCount, 4),
    weight: 0.18,
    points: 0,
    params: { count: input.privacyRiskCount },
  },
  {
    id: 'fileIdentifiers',
    ratio: saturate(input.identifyingFieldCount, 5),
    weight: 0.12,
    points: 0,
    params: { count: input.identifyingFieldCount },
  },
];
