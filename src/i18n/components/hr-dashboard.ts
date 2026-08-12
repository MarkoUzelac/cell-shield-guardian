/**
 * Croatian copy for shared dashboard components. Merged into `components.dashboard`.
 */
export const dashboard = {
  alertsList: {
    acknowledgeAria: 'Potvrdi upozorenje: {{title}}',
    dismissAria: 'Odbaci upozorenje: {{title}}',
    acknowledged: 'Potvrđeno',
    empty: 'Trenutno nema upozorenja',
  },
  imsiTable: {
    title: 'Zapisi IMSI/TMSI uživo',
    unmuteAria: 'Uključi zvuk upozorenja',
    muteAria: 'Isključi zvuk upozorenja',
    showAria: 'Prikaži IMSI vrijednosti',
    hideAria: 'Sakrij IMSI vrijednosti',
    show: 'Prikaži',
    hide: 'Sakrij',
    copyAria: 'Kopiraj IMSI {{imsi}}',
    copiedToast: 'Kopirano u međuspremnik',
    cellLabel: 'Ćelija: {{cellId}}',
    alertBadges: {
      IMSI_CATCHER: 'IMSI hvatač',
      RAPID_HANDOVER: 'Brzi prijenos',
      SILENT_SMS: 'Tihi SMS',
      DOWNGRADE_ATTACK: 'Degradacija',
    },
    columns: {
      status: 'Status',
      imsi: 'IMSI',
      tmsi: 'TMSI',
      operator: 'Operater',
      signal: 'Signal',
      cellId: 'ID ćelije',
      time: 'Vrijeme',
      alert: 'Upozorenje',
    },
    showingCount: 'Prikazano {{shown, number}} od {{total, number}} zapisa',
  },
  radarDisplay: {
    signals: 'Signali',
    threats: '{{count, number}} prijetnji',
    active: 'AKTIVNO',
    idle: 'MIROVANJE',
  },
  signalStrengthMeter: {
    dbm: '{{strength, number}} dBm',
  },
  statsCard: {
    trendFromLastHour: '{{arrow}} {{value, number}}% od zadnjeg sata',
  },
} as const;
