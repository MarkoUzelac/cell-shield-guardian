/**
 * English copy for the alerts page. Filled per page; merged into
 * `pages.alerts` by src/i18n/locales/en.ts.
 *
 * Alerts on this page are derived directly from the real-time diagnostics
 * engine (src/lib/diagnostics) — nothing here is randomly generated.
 */
export const alerts = {
  header: {
    title: 'Alerts & Logs',
    subtitle: 'Alerts derived from real, on-device diagnostic measurements',
  },
  toast: {
    exportSuccess: 'Alerts exported successfully',
    clearedAcknowledged: 'Cleared acknowledged alerts',
    newAlerts_one: '{{count}} new alert from the latest measurement',
    newAlerts_other: '{{count}} new alerts from the latest measurement',
  },
  stats: {
    total: 'Total',
    critical: 'Critical',
    warnings: 'Warnings',
    info: 'Info',
    unread: 'Unread',
  },
  filters: {
    searchPlaceholder: 'Search alerts...',
    types: {
      all: 'All Types',
      critical: 'Critical',
      warning: 'Warning',
      info: 'Info',
    },
  },
  actions: {
    clearRead: 'Clear Read',
    export: 'Export',
    rescan: 'Re-scan',
  },
  history: {
    title: 'Alert History ({{count}})',
  },
  source: {
    label: 'Source: on-device diagnostics engine (browser-observable signals only)',
  },
  empty: 'No alerts. Every diagnostic check currently reports a healthy status.',
  scanning: 'Running diagnostics…',
  diagnosticSource: 'Diagnostic: {{id}}',
  measuredValue: 'Measured value: {{value}}',
  recommendationLabel: 'Recommendation',
} as const;
