/**
 * Croatian copy for the alerts page. Filled per page; merged into
 * `pages.alerts` by src/i18n/locales/hr.ts.
 */
export const alerts = {
  header: {
    title: 'Upozorenja i zapisnici',
    subtitle: 'Sigurnosna upozorenja, obavijesti i povijest sistemskih događaja',
  },
  toast: {
    exportSuccess: 'Upozorenja su uspješno izvezena',
    clearedAcknowledged: 'Potvrđena upozorenja su obrisana',
    newAlerts_one: '{{count}} novo upozorenje iz zadnjeg mjerenja',
    newAlerts_few: '{{count}} nova upozorenja iz zadnjeg mjerenja',
    newAlerts_other: '{{count}} novih upozorenja iz zadnjeg mjerenja',
  },
  stats: {
    total: 'Ukupno',
    critical: 'Kritično',
    warnings: 'Upozorenja',
    info: 'Informacije',
    unread: 'Nepročitano',
  },
  filters: {
    searchPlaceholder: 'Pretraži upozorenja...',
    types: {
      all: 'Sve vrste',
      critical: 'Kritično',
      warning: 'Upozorenje',
      info: 'Informacija',
    },
  },
  actions: {
    clearRead: 'Očisti pročitano',
    export: 'Izvezi',
  },
  history: {
    title: 'Povijest upozorenja ({{count}})',
  },
} as const;
