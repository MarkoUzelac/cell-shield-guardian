/**
 * English copy for the tactical page. Filled per page; merged into
 * `pages.tactical` by src/i18n/locales/en.ts.
 */
export const tactical = {
  header: {
    title: 'Tactical Dashboard',
    subtitle: 'Signal anomaly detection & threat analysis',
  },
  stats: {
    totalTowers: 'Total Towers',
    critical: 'Critical',
    highRisk: 'High Risk',
    medium: 'Medium',
    low: 'Low',
    clean: 'Clean',
  },
  threatIndex: {
    title: 'Overall Threat Index',
    cleanLabel: '0% Clean',
    criticalLabel: '100% Critical',
  },
  controls: {
    filterPlaceholder: 'Filter level',
    allLevels: 'All Levels',
    critical: '🔴 Critical',
    high: '🟠 High',
    medium: '🟡 Medium',
    low: '🟢 Low',
    clean: '✅ Clean',
    rescan: 'Re-scan',
    exportCsv: 'Export CSV',
    liveMonitoring: 'Live Monitoring',
    paused: 'Paused',
  },
  anomalyFeed: {
    title: 'Anomaly Feed ({{count}})',
    cellLabel: 'Cell: {{cellId}} · {{signal}} dBm',
  },
  detail: {
    selectPrompt: 'Select a tower to inspect',
    cellId: 'Cell ID',
    mccMnc: 'MCC/MNC',
    signal: 'Signal',
    encrypted: 'Encrypted',
    scoreBreakdown: 'Score Breakdown',
    overallScore: 'Overall Score',
    findings: 'Findings',
  },
  factors: {
    mccMncAnomaly: 'MCC/MNC Anomaly',
    encryptionMissing: 'Encryption Missing',
    powerSpike: 'Power Spike',
    downgradeAttack: 'Downgrade Attack',
    geoMismatch: 'Geo Mismatch',
    rapidSwitch: 'Rapid Switch',
  },
  charts: {
    threatDistribution: 'Threat Distribution',
    technologyAnalysis: 'Technology Analysis',
    legendItem: '{{name}} ({{value}})',
    total: 'Total',
    suspicious: 'Suspicious',
  },
} as const;
