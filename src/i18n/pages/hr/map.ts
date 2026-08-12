/**
 * Croatian copy for the map page. Filled per page; merged into
 * `pages.map` by src/i18n/locales/hr.ts.
 */
export const map = {
  headerTitle: 'Karta baznih stanica',
  headerSubtitle: 'Mapiranje tornjeva u stvarnom vremenu blizu vaše lokacije',
  locationStatus: {
    detecting: 'Otkrivanje...',
    exactLocation: 'Vaša točna lokacija',
    defaultLocation: 'Zadano (Zagreb)',
    locate: 'Pronađi',
    refresh: 'Osvježi',
  },
  towerStats: {
    title: 'Otkriveni tornjevi',
    total: 'Ukupno',
    verified: 'Potvrđeno',
    suspicious: 'Sumnjivo',
  },
  operators: {
    detecting: 'Otkrivanje operatera…',
    title: 'Operateri u zemlji {{country}}',
    mccLabel: 'MCC {{mcc}}',
    mnc: 'MNC',
  },
  selectedTower: {
    suspicious: 'Sumnjivi toranj',
    verified: 'Potvrđeni toranj',
    operator: 'Operater',
    cellId: 'ID ćelije',
    mccMnc: 'MCC/MNC',
    technology: 'Tehnologija',
    signal: 'Signal',
  },
  emptyState: 'Dodirnite toranj na karti za prikaz detalja',
} as const;
