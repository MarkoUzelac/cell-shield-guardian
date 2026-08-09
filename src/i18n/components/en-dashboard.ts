/**
 * English copy for shared dashboard components. Merged into `components.dashboard`.
 */
export const dashboard = {
  alertsList: {
    acknowledgeAria: 'Acknowledge alert: {{title}}',
    dismissAria: 'Dismiss alert: {{title}}',
    acknowledged: 'Acknowledged',
    empty: 'No alerts at this time',
  },
  imsiTable: {
    title: 'Live IMSI/TMSI Records',
    unmuteAria: 'Unmute alerts',
    muteAria: 'Mute alerts',
    showAria: 'Show IMSI values',
    hideAria: 'Hide IMSI values',
    show: 'Show',
    hide: 'Hide',
    copyAria: 'Copy IMSI {{imsi}}',
    copiedToast: 'Copied to clipboard',
    cellLabel: 'Cell: {{cellId}}',
    alertBadges: {
      IMSI_CATCHER: 'IMSI Catcher',
      RAPID_HANDOVER: 'Rapid Handover',
      SILENT_SMS: 'Silent SMS',
      DOWNGRADE_ATTACK: 'Downgrade',
    },
    columns: {
      status: 'Status',
      imsi: 'IMSI',
      tmsi: 'TMSI',
      operator: 'Operator',
      signal: 'Signal',
      cellId: 'Cell ID',
      time: 'Time',
      alert: 'Alert',
    },
    showingCount: 'Showing {{shown, number}} of {{total, number}} records',
  },
  radarDisplay: {
    signals: 'Signals',
    threats: '{{count, number}} threats',
    active: 'ACTIVE',
    idle: 'IDLE',
  },
  signalStrengthMeter: {
    dbm: '{{strength, number}} dBm',
  },
  statsCard: {
    trendFromLastHour: '{{arrow}} {{value, number}}% from last hour',
  },
} as const;
