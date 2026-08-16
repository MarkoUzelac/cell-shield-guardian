/**
 * English copy for shared metadata components. Merged into `components.metadata`.
 */
export const metadata = {
  uploadTitle: 'Upload File for Analysis',
  remove: 'Remove',
  dragDrop: 'Drag & drop a file here',
  orBrowse: 'or click to browse',
  browseFiles: 'Browse Files',
  supportedFormats: 'Supported formats: Images (JPEG, PNG, TIFF, RAW), Documents (PDF, DOC, XLS)',
  analysisDescription:
    'The file is read in your browser and never uploaded. EXIF data (GPS, device, timestamps) is extracted from JPEG and TIFF images; other formats report file attributes only.',
  resultsTitle: 'Analysis Results',
  exportJson: 'Export JSON',
  analyzing: 'Reading file…',
  privacyRisksDetected: 'Privacy Risks Detected',
  gpsLocationFound: 'GPS Location Found',
  extractedMetadata: 'Extracted Metadata',
  emptyState: 'Upload a file to see extracted metadata',
  noEmbedded: 'No embedded metadata was found in this file beyond its file attributes.',
  risks: {
    gps: 'Exact GPS coordinates are embedded in this file.',
    serial: 'A device or lens serial number is embedded, which links the file to specific hardware.',
    author: 'Author, owner or copyright details identify a person.',
    device: 'The capturing device make and model are embedded.',
    software: 'The software and version used to create or edit the file are embedded.',
    timestamp: 'Original capture timestamps reveal when the file was created.',
  },
} as const;
