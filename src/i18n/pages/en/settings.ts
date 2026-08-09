/**
 * English copy for the settings page. Filled per page; merged into
 * `pages.settings` by src/i18n/locales/en.ts.
 */
export const settings = {
  header: {
    title: 'Settings',
    subtitle: 'Configure scanner, API keys, and application preferences',
  },
  toast: {
    saved: 'Settings saved successfully',
  },
  api: {
    title: 'API Configuration',
    description: 'Configure external API keys for cell tower lookup services.',
    keyLabel: 'OpenCellID API Key',
    keyPlaceholder: 'Enter your OpenCellID API key',
    getKeyPrefix: 'Get a free API key at',
  },
  scanner: {
    title: 'Scanner Configuration',
    description: 'RTL-SDR device and frequency scanning settings.',
    frequencyLabel: 'Default Frequency (MHz)',
    gainLabel: 'Device Gain (dB)',
    autoScanLabel: 'Auto-start scanning',
    autoScanDescription: 'Automatically begin scanning when application starts',
  },
  alertPreferences: {
    title: 'Alert Preferences',
    description: 'Configure how and when you receive security alerts.',
    enableAlertsLabel: 'Enable alerts',
    enableAlertsDescription: 'Show notifications for suspicious activity',
    soundAlertsLabel: 'Sound alerts',
    soundAlertsDescription: 'Play audio notification for critical alerts',
  },
  dataManagement: {
    title: 'Data Management',
    description: 'Configure data storage and retention policies.',
    retentionLabel: 'Log retention period',
    retentionOptions: {
      d7: '7 days',
      d30: '30 days',
      d90: '90 days',
      d365: '1 year',
      forever: 'Forever',
    },
    exportAllData: 'Export All Data',
    clearAllData: 'Clear All Data',
  },
  securityNotice: {
    title: 'Security & Privacy Notice',
    description:
      'All captured data is stored locally on your device. No data is sent to external servers unless you explicitly configure API integrations. This tool is designed for passive, defensive monitoring of your own devices and networks only.',
  },
  saveButton: 'Save Settings',
} as const;
