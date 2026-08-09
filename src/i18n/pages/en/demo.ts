/**
 * English copy for the demo page. Filled per page; merged into
 * `pages.demo` by src/i18n/locales/en.ts.
 */
export const demo = {
  header: {
    title: 'Cellular Simulation (Demo)',
    subtitle: 'Synthetic data — not from your device',
  },
  banner: {
    title: 'Simulated data — nothing here is real',
    body: 'Web browsers cannot read IMSI, IMEI, cell tower identity, encryption state or baseband information. Every signal, tower and alert on this page is generated locally to illustrate what a native Android companion app could show. For measurements taken from your actual device, use the {{link}}.',
    linkText: 'live diagnostics dashboard',
  },
  premiumBanner: {
    title: 'Upgrade to Pro',
    subtitle: 'Real-time tower data & advanced alerts',
    price: '€9.99/mo',
  },
  stats: {
    signals: 'Signals',
    signalsSubtitle: 'Last hour',
    suspicious: 'Suspicious',
    suspiciousSubtitle: 'Attention',
    critical: 'Critical',
    criticalSubtitle: 'Unacked',
    status: 'Status',
    statusValue: 'Active',
    statusSubtitle: 'Protected',
  },
  scanControl: {
    title: 'Scan Control',
    frequency: 'Frequency:',
    status: 'Status:',
    scanning: 'Scanning',
    idle: 'Idle',
    location: 'Location:',
    defaultLocation: 'Croatia',
    stop: 'Stop',
    start: 'Start',
  },
  recentAlerts: {
    title: 'Recent Alerts',
  },
  frequencyBands: {
    title: 'Croatian LTE/5G Bands',
  },
} as const;
