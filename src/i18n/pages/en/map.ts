/**
 * English copy for the map page. Filled per page; merged into
 * `pages.map` by src/i18n/locales/en.ts.
 */
export const map = {
  headerTitle: 'Cell Tower Map',
  headerSubtitle: 'Real-time tower mapping near your location',
  locationStatus: {
    detecting: 'Detecting...',
    exactLocation: 'Your Exact Location',
    defaultLocation: 'Default (Zagreb)',
    locate: 'Locate',
    refresh: 'Refresh',
  },
  towerStats: {
    title: 'Detected Towers',
    total: 'Total',
    verified: 'Verified',
    suspicious: 'Suspicious',
  },
  operators: {
    detecting: 'Detecting Operators…',
    title: '{{country}} Operators',
    mccLabel: 'MCC {{mcc}}',
    mnc: 'MNC',
  },
  selectedTower: {
    suspicious: 'Suspicious Tower',
    verified: 'Verified Tower',
    operator: 'Operator',
    cellId: 'Cell ID',
    mccMnc: 'MCC/MNC',
    technology: 'Technology',
    signal: 'Signal',
  },
  emptyState: 'Tap a tower on the map to view details',
} as const;
