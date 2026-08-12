/**
 * English copy for the map page. Filled per page; merged into
 * `pages.map` by src/i18n/locales/en.ts.
 *
 * All towers shown come from the OpenStreetMap Overpass API — a real,
 * community-mapped dataset — never from randomly generated data.
 */
export const map = {
  headerTitle: 'Cell Tower Map',
  headerSubtitle: 'Real communication masts mapped by OpenStreetMap near your location',
  locationStatus: {
    detecting: 'Detecting...',
    exactLocation: 'Your Exact Location',
    defaultLocation: 'Default (Zagreb)',
    locate: 'Locate',
    refresh: 'Refresh',
  },
  towerStats: {
    title: 'Mapped Towers',
    total: 'Total',
    named: 'Named',
    withOperator: 'With operator tag',
  },
  operators: {
    detecting: 'Detecting Operators…',
    title: '{{country}} Operators',
    mccLabel: 'MCC {{mcc}}',
    mnc: 'MNC',
  },
  selectedTower: {
    title: 'Tower Details',
    name: 'Name',
    operator: 'Operator',
    technology: 'Technology tags',
    type: 'OSM type',
    id: 'OSM id',
    unknownName: 'Unnamed mast',
    unknownOperator: 'Not tagged',
    unknownTechnology: 'Not tagged',
  },
  emptyState: 'Tap a tower on the map to view details',
  towersEmpty: {
    title: 'No mapped towers nearby',
    body: 'OpenStreetMap contributors have not mapped any communication masts within this radius yet. This does not mean no towers exist here — only that none have been surveyed into OSM.',
  },
  loading: 'Loading real tower data from OpenStreetMap…',
  loadError: 'Could not load tower data from OpenStreetMap: {{error}}',
  attribution: 'Source: OpenStreetMap contributors (Overpass API)',
} as const;
