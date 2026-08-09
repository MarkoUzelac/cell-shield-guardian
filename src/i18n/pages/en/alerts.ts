/**
 * English copy for the alerts page. Filled per page; merged into
 * `pages.alerts` by src/i18n/locales/en.ts.
 */
export const alerts = {
  header: {
    title: 'Alerts & Logs',
    subtitle: 'Security alerts, warnings, and system event history',
  },
  toast: {
    exportSuccess: 'Alerts exported successfully',
    clearedAcknowledged: 'Cleared acknowledged alerts',
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
  },
  history: {
    title: 'Alert History ({{count}})',
  },
} as const;
