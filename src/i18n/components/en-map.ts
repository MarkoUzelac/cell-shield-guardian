/**
 * English copy for shared map components. Merged into `components.map`.
 */
export const map = {
  fakeStationDetector: {
    title: 'Fake Base Station Detector',
    scan: 'Scan',
    threats: 'Threats',
    suspicious: 'Suspicious',
    clean: 'Clean',
    activeThreats: 'Active Threats',
    underInvestigation: 'Under Investigation',
    riskPercent: '{{value}}% risk',
    empty: 'No fake base stations detected in your area',
    threatBadges: {
      CRITICAL: 'CRITICAL',
      HIGH: 'HIGH',
      MEDIUM: 'MEDIUM',
      LOW: 'LOW',
      CLEAN: 'CLEAN',
    },
  },
  towerMap: {
    yourLocationAria: 'Your location details',
    towerDetailsAria: 'Tower {{cellId}} details',
    yourLocation: 'Your Location',
    lat: 'Lat',
    lng: 'Lng',
    operator: 'Operator',
    cellId: 'Cell ID',
    mccMnc: 'MCC/MNC',
    lac: 'LAC',
    technology: 'Technology',
    signal: 'Signal',
    suspicious: 'SUSPICIOUS',
    verified: 'Verified',
  },
} as const;
