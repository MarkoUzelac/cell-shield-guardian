/**
 * Croatian copy for shared map components. Merged into `components.map`.
 */
export const map = {
  fakeStationDetector: {
    title: 'Detektor lažnih baznih stanica',
    scan: 'Skeniraj',
    threats: 'Prijetnje',
    suspicious: 'Sumnjivo',
    clean: 'Čisto',
    activeThreats: 'Aktivne prijetnje',
    underInvestigation: 'U istrazi',
    riskPercent: '{{value}}% rizika',
    empty: 'Nisu otkrivene lažne bazne stanice u vašem području',
    threatBadges: {
      CRITICAL: 'KRITIČNO',
      HIGH: 'VISOKO',
      MEDIUM: 'SREDNJE',
      LOW: 'NISKO',
      CLEAN: 'ČISTO',
    },
  },
  towerMap: {
    yourLocationAria: 'Detalji vaše lokacije',
    towerDetailsAria: 'Detalji tornja {{cellId}}',
    yourLocation: 'Vaša lokacija',
    lat: 'Geo. šir.',
    lng: 'Geo. duž.',
    operator: 'Operater',
    cellId: 'ID ćelije',
    mccMnc: 'MCC/MNC',
    lac: 'LAC',
    technology: 'Tehnologija',
    signal: 'Signal',
    suspicious: 'SUMNJIVO',
    verified: 'Potvrđeno',
  },
} as const;
