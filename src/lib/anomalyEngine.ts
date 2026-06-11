/**
 * Signal Guardian Tactical — Anomaly Detection Engine
 * 
 * Weighted heuristic scoring model for cellular signal anomaly detection.
 * Analyzes signal behavior, temporal patterns, and geo-spatial anomalies.
 */

import type { CellTower } from '@/types/signal';
import { DEFAULT_COUNTRY, getRandomOperator, type CountryOperators } from './worldOperators';

// ─── Types ───────────────────────────────────────────────────────────────────

export type ThreatLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'CLEAN';

export interface AnomalyFactors {
  mccMncAnomaly: number;       // Unknown or mismatched MCC/MNC
  encryptionMissing: number;    // No encryption detected
  powerSpike: number;           // Abnormal signal strength
  downgradeAttack: number;      // Forced technology downgrade
  geoMismatch: number;          // Tower outside expected region
  rapidSwitch: number;          // Rapid cell switching pattern
  duplicateCellId: number;      // Overlapping identical Cell IDs
  shortLived: number;           // Tower appeared briefly
}

export interface AnomalyReport {
  towerId: string;
  score: number;
  threatLevel: ThreatLevel;
  factors: AnomalyFactors;
  details: string[];
  timestamp: Date;
}

export interface TacticalTower extends CellTower {
  anomalyReport: AnomalyReport;
  encryption: boolean;
  broadcastPower: number;
  firstSeen: Date;
  sectorAngle: number;
  sectorSpan: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const WEIGHTS = {
  mccMncAnomaly: 0.20,
  encryptionMissing: 0.20,
  powerSpike: 0.15,
  downgradeAttack: 0.15,
  geoMismatch: 0.15,
  rapidSwitch: 0.15,
} as const;

// Known MCC/MNCs for the user's current country. Updated at runtime via
// setKnownCountry() so anomaly detection adapts to wherever the user is.
let KNOWN_MCC: string[] = [DEFAULT_COUNTRY.mcc];
let KNOWN_MNCS: string[] = DEFAULT_COUNTRY.operators.map(op => op.mnc);

/** Update the anomaly engine's expected operators based on the user's country. */
export function setKnownCountry(country: CountryOperators) {
  KNOWN_MCC = [country.mcc];
  KNOWN_MNCS = country.operators.map(op => op.mnc);
}

// Expected signal range for legitimate towers (dBm)
const NORMAL_SIGNAL_MIN = -110;
const NORMAL_SIGNAL_MAX = -50;
const SUSPICIOUS_SIGNAL_THRESHOLD = -30; // Too strong = likely rogue

// Geo boundaries for Croatia (approximate bounding box)
const CROATIA_BOUNDS = {
  minLat: 42.3,
  maxLat: 46.6,
  minLng: 13.4,
  maxLng: 19.5,
};

// ─── Scoring Functions ───────────────────────────────────────────────────────

function scoreMccMnc(tower: CellTower): { score: number; detail?: string } {
  if (!KNOWN_MCC.includes(tower.mcc)) {
    return { score: 1.0, detail: `Unknown MCC: ${tower.mcc} (expected: ${KNOWN_MCC.join(', ')})` };
  }
  if (!KNOWN_MNCS.includes(tower.mnc as typeof KNOWN_MNCS[number])) {
    return { score: 0.8, detail: `Unknown MNC: ${tower.mnc} for MCC ${tower.mcc}` };
  }
  return { score: 0 };
}

function scoreEncryption(encryption: boolean): { score: number; detail?: string } {
  if (!encryption) {
    return { score: 1.0, detail: 'No encryption detected — open authentication broadcast' };
  }
  return { score: 0 };
}

function scorePowerSpike(signalStrength: number): { score: number; detail?: string } {
  if (signalStrength > SUSPICIOUS_SIGNAL_THRESHOLD) {
    return { score: 1.0, detail: `Abnormal signal strength: ${signalStrength} dBm (threshold: ${SUSPICIOUS_SIGNAL_THRESHOLD} dBm)` };
  }
  if (signalStrength > NORMAL_SIGNAL_MAX) {
    const severity = (signalStrength - NORMAL_SIGNAL_MAX) / (SUSPICIOUS_SIGNAL_THRESHOLD - NORMAL_SIGNAL_MAX);
    return { score: Math.min(severity, 0.9), detail: `Elevated signal strength: ${signalStrength} dBm` };
  }
  return { score: 0 };
}

function scoreDowngrade(technology: CellTower['technology'], signalStrength: number): { score: number; detail?: string } {
  // 2G with strong signal = suspicious (real 2G towers are usually weak/distant)
  if (technology === '2G' && signalStrength > -70) {
    return { score: 1.0, detail: `Strong 2G signal (${signalStrength} dBm) — possible downgrade attack` };
  }
  if (technology === '2G' && signalStrength > -85) {
    return { score: 0.6, detail: `Moderate 2G signal in 4G/5G area — potential forced downgrade` };
  }
  return { score: 0 };
}

function scoreGeoMismatch(tower: CellTower): { score: number; detail?: string } {
  const inBounds =
    tower.lat >= CROATIA_BOUNDS.minLat &&
    tower.lat <= CROATIA_BOUNDS.maxLat &&
    tower.lng >= CROATIA_BOUNDS.minLng &&
    tower.lng <= CROATIA_BOUNDS.maxLng;

  if (!inBounds) {
    return { score: 1.0, detail: `Tower at ${tower.lat.toFixed(4)}, ${tower.lng.toFixed(4)} is outside expected operator region` };
  }
  return { score: 0 };
}

function scoreRapidSwitch(tower: CellTower, allTowers: CellTower[]): { score: number; detail?: string } {
  // Check for towers with same Cell ID in different locations
  const duplicates = allTowers.filter(
    t => t.id !== tower.id && t.cellId === tower.cellId
  );
  
  if (duplicates.length > 0) {
    return { score: 1.0, detail: `Duplicate Cell ID ${tower.cellId} found in ${duplicates.length + 1} locations` };
  }

  // Check for very recently appeared towers (short-lived)
  const ageMs = Date.now() - tower.lastSeen.getTime();
  if (ageMs < 60000) { // Less than 1 minute
    return { score: 0.5, detail: 'Recently appeared tower — potentially short-lived rogue cell' };
  }

  return { score: 0 };
}

// ─── Main Scoring Engine ─────────────────────────────────────────────────────

export function analyzeTower(
  tower: CellTower,
  allTowers: CellTower[],
  encryption: boolean = Math.random() > 0.15
): AnomalyReport {
  const details: string[] = [];

  const mcc = scoreMccMnc(tower);
  const enc = scoreEncryption(encryption);
  const power = scorePowerSpike(tower.signalStrength);
  const downgrade = scoreDowngrade(tower.technology, tower.signalStrength);
  const geo = scoreGeoMismatch(tower);
  const rapid = scoreRapidSwitch(tower, allTowers);

  if (mcc.detail) details.push(mcc.detail);
  if (enc.detail) details.push(enc.detail);
  if (power.detail) details.push(power.detail);
  if (downgrade.detail) details.push(downgrade.detail);
  if (geo.detail) details.push(geo.detail);
  if (rapid.detail) details.push(rapid.detail);

  const factors: AnomalyFactors = {
    mccMncAnomaly: mcc.score,
    encryptionMissing: enc.score,
    powerSpike: power.score,
    downgradeAttack: downgrade.score,
    geoMismatch: geo.score,
    rapidSwitch: rapid.score,
    duplicateCellId: rapid.score > 0.8 ? 1 : 0,
    shortLived: rapid.score > 0.3 && rapid.score < 0.8 ? 1 : 0,
  };

  const score =
    factors.mccMncAnomaly * WEIGHTS.mccMncAnomaly +
    factors.encryptionMissing * WEIGHTS.encryptionMissing +
    factors.powerSpike * WEIGHTS.powerSpike +
    factors.downgradeAttack * WEIGHTS.downgradeAttack +
    factors.geoMismatch * WEIGHTS.geoMismatch +
    factors.rapidSwitch * WEIGHTS.rapidSwitch;

  const threatLevel = getThreatLevel(score);

  return {
    towerId: tower.id,
    score: Math.round(score * 1000) / 1000,
    threatLevel,
    factors,
    details,
    timestamp: new Date(),
  };
}

export function getThreatLevel(score: number): ThreatLevel {
  if (score > 0.8) return 'CRITICAL';
  if (score > 0.6) return 'HIGH';
  if (score > 0.4) return 'MEDIUM';
  if (score > 0.2) return 'LOW';
  return 'CLEAN';
}

export const THREAT_COLORS: Record<ThreatLevel, string> = {
  CRITICAL: 'hsl(0 72% 51%)',
  HIGH: 'hsl(25 95% 53%)',
  MEDIUM: 'hsl(45 93% 47%)',
  LOW: 'hsl(172 66% 50%)',
  CLEAN: 'hsl(142 76% 36%)',
};

export const THREAT_BG_CLASSES: Record<ThreatLevel, string> = {
  CRITICAL: 'bg-destructive/20 border-destructive/40 text-destructive',
  HIGH: 'bg-orange-500/20 border-orange-500/40 text-orange-400',
  MEDIUM: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400',
  LOW: 'bg-teal-500/20 border-teal-500/40 text-teal-400',
  CLEAN: 'bg-success/20 border-success/40 text-success',
};

// ─── Helper: Create Base Towers ──────────────────────────────────────────────

function createBaseTowers(baseLat: number, baseLng: number, count: number, country: CountryOperators = DEFAULT_COUNTRY): CellTower[] {
  return Array.from({ length: count }, (_, i) => {
    const op = getRandomOperator(country);
    const isSuspicious = Math.random() > 0.85;
    return {
      id: `tower-${i}-${Date.now()}`,
      mcc: op.mcc,
      mnc: op.mnc,
      lac: Math.floor(Math.random() * 65535).toString(),
      cellId: Math.floor(Math.random() * 65535).toString(),
      lat: baseLat + (Math.random() - 0.5) * 0.09,
      lng: baseLng + (Math.random() - 0.5) * 0.09,
      signalStrength: -50 - Math.floor(Math.random() * 60),
      operator: op.name,
      technology: (['2G', '3G', '4G', '5G'] as const)[Math.floor(Math.random() * 4)],
      lastSeen: new Date(Date.now() - Math.random() * 3600000),
      isSuspicious,
      suspiciousReason: isSuspicious ? 'Unknown Cell ID' : undefined,
    };
  });
}

// ─── Tactical Tower Generation ───────────────────────────────────────────────

export function generateTacticalTowers(
  baseLat: number,
  baseLng: number,
  count: number = 50,
  generateBaseTowers?: (lat: number, lng: number, count: number) => CellTower[]
): TacticalTower[] {
  // Use provided generator or create simple towers inline
  const baseTowers: CellTower[] = generateBaseTowers
    ? generateBaseTowers(baseLat, baseLng, count)
    : createBaseTowers(baseLat, baseLng, count);

  // Inject some deliberately suspicious towers
  const tacticalTowers: TacticalTower[] = baseTowers.map((tower, i) => {
    // Make ~20% intentionally suspicious for demo
    const forceRogue = i < count * 0.2;
    
    let modifiedTower = { ...tower };
    if (forceRogue) {
      const rogueType = i % 4;
      switch (rogueType) {
        case 0: // Unknown MCC
          modifiedTower.mcc = '999';
          modifiedTower.mnc = '99';
          modifiedTower.signalStrength = -25;
          break;
        case 1: // Strong 2G (downgrade)
          modifiedTower.technology = '2G';
          modifiedTower.signalStrength = -35;
          break;
        case 2: // Power spike
          modifiedTower.signalStrength = -20;
          break;
        case 3: // Duplicate cell ID
          modifiedTower.cellId = baseTowers[0].cellId;
          break;
      }
    }

    const encryption = forceRogue ? (i % 3 === 0 ? false : true) : Math.random() > 0.1;
    const anomalyReport = analyzeTower(modifiedTower, baseTowers, encryption);

    return {
      ...modifiedTower,
      isSuspicious: anomalyReport.score > 0.4,
      suspiciousReason: anomalyReport.details[0],
      anomalyReport,
      encryption,
      broadcastPower: forceRogue ? 40 + Math.random() * 20 : 10 + Math.random() * 25,
      firstSeen: new Date(Date.now() - Math.random() * 86400000 * 30),
      sectorAngle: Math.floor(Math.random() * 360),
      sectorSpan: 60 + Math.floor(Math.random() * 60),
    };
  });

  return tacticalTowers;
}

// ─── Aggregate Stats ─────────────────────────────────────────────────────────

export interface TacticalStats {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  clean: number;
  avgScore: number;
  topThreats: TacticalTower[];
  operatorBreakdown: { operator: string; count: number; avgScore: number }[];
  techBreakdown: { tech: string; count: number; suspiciousCount: number }[];
}

export function computeTacticalStats(towers: TacticalTower[]): TacticalStats {
  const byLevel = (level: ThreatLevel) =>
    towers.filter(t => t.anomalyReport.threatLevel === level).length;

  const avgScore =
    towers.length > 0
      ? towers.reduce((sum, t) => sum + t.anomalyReport.score, 0) / towers.length
      : 0;

  const topThreats = [...towers]
    .sort((a, b) => b.anomalyReport.score - a.anomalyReport.score)
    .slice(0, 10);

  // Operator breakdown
  const opMap = new Map<string, { count: number; totalScore: number }>();
  towers.forEach(t => {
    const entry = opMap.get(t.operator) || { count: 0, totalScore: 0 };
    entry.count++;
    entry.totalScore += t.anomalyReport.score;
    opMap.set(t.operator, entry);
  });
  const operatorBreakdown = Array.from(opMap.entries()).map(([operator, data]) => ({
    operator,
    count: data.count,
    avgScore: Math.round((data.totalScore / data.count) * 1000) / 1000,
  }));

  // Technology breakdown
  const techMap = new Map<string, { count: number; suspiciousCount: number }>();
  towers.forEach(t => {
    const entry = techMap.get(t.technology) || { count: 0, suspiciousCount: 0 };
    entry.count++;
    if (t.anomalyReport.score > 0.4) entry.suspiciousCount++;
    techMap.set(t.technology, entry);
  });
  const techBreakdown = Array.from(techMap.entries()).map(([tech, data]) => ({
    tech,
    count: data.count,
    suspiciousCount: data.suspiciousCount,
  }));

  return {
    total: towers.length,
    critical: byLevel('CRITICAL'),
    high: byLevel('HIGH'),
    medium: byLevel('MEDIUM'),
    low: byLevel('LOW'),
    clean: byLevel('CLEAN'),
    avgScore: Math.round(avgScore * 1000) / 1000,
    topThreats,
    operatorBreakdown,
    techBreakdown,
  };
}
