/**
 * English copy for the metadata page. Filled per page; merged into
 * `pages.metadata` by src/i18n/locales/en.ts.
 */
export const metadata = {
  title: 'Metadata Analyzer',
  subtitle: 'Extract and analyze hidden metadata from files using ExifTool',
  infoCards: {
    images: {
      title: 'Images',
      description: 'JPEG, PNG, TIFF, RAW files',
    },
    documents: {
      title: 'Documents',
      description: 'PDF, DOC, XLS, PPT files',
    },
    media: {
      title: 'Media',
      description: 'Audio, video, and other formats',
    },
  },
  commonMetadata: {
    title: 'Common Privacy-Sensitive Metadata',
    riskLabel: '{{risk}} risk',
    riskLevels: {
      high: 'high',
      medium: 'medium',
      low: 'low',
    },
    items: {
      gpsCoordinates: {
        title: 'GPS Coordinates',
        description: 'Exact location where photo/document was created',
      },
      deviceSerialNumbers: {
        title: 'Device Serial Numbers',
        description: 'Unique identifiers linking to specific devices',
      },
      timestamps: {
        title: 'Timestamps',
        description: 'Creation, modification, and access times',
      },
      authorInformation: {
        title: 'Author Information',
        description: 'Names, usernames, or account details',
      },
      softwareVersions: {
        title: 'Software Versions',
        description: 'Apps and OS versions used to create file',
      },
      cameraSettings: {
        title: 'Camera Settings',
        description: 'Lens, aperture, ISO, and focal length',
      },
      networkInfo: {
        title: 'Network Info',
        description: 'WiFi names, IP addresses in some files',
      },
      editingHistory: {
        title: 'Editing History',
        description: 'Track changes, revision history',
      },
    },
  },
} as const;
