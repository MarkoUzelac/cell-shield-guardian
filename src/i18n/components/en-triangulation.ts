/**
 * English copy for shared triangulation components. Merged into `components.triangulation`.
 */
export const triangulation = {
  title: 'Cell Tower Triangulation',
  description: 'Enter cell tower identifiers to estimate location using OpenCellID database.',
  mccLabel: 'MCC (Country Code)',
  mccPlaceholder: 'e.g. 310',
  mncLabel: 'MNC (Network Code)',
  mncPlaceholder: 'e.g. 410',
  lacLabel: 'LAC (Location Area Code)',
  lacPlaceholder: 'e.g. 12345',
  cellIdLabel: 'Cell ID',
  cellIdPlaceholder: 'e.g. 67890',
  lookupLocation: 'Lookup Location',
  aboutTitle: 'About Cell Tower Lookup',
  aboutDescription: "This uses the OpenCellID database to estimate tower locations. Accuracy varies by region. You can obtain cell info from your device's engineering mode or captured GSM data.",
} as const;
