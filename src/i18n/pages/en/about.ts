/**
 * English copy for the about page. Filled per page; merged into
 * `pages.about` by src/i18n/locales/en.ts.
 */
export const about = {
  header: {
    title: 'About',
    subtitle: 'Privacy Signal Monitor - Educational security tool',
  },
  disclaimer: {
    title: 'Important Legal Disclaimer',
    intro:
      '<strong>Privacy Signal Monitor</strong> is designed exclusively for <strong>educational, research, and defensive privacy protection</strong> purposes. This tool is intended to help users:',
    purposes: {
      item1: 'Detect if they are being tracked via mobile networks',
      item2: 'Learn about mobile privacy risks and vulnerabilities',
      item3: 'Monitor their own devices and local GSM signals',
      item4: 'Analyze publicly available or self-captured data',
    },
    mustNotTitle: '⚠️ This tool must NOT be used for:',
    prohibited: {
      item1: 'Tracking or monitoring other people without consent',
      item2: 'Active signal interception or jamming',
      item3: 'Any activity that violates local telecommunications laws',
      item4: 'Unauthorized access to mobile networks',
    },
    responsibility:
      '<strong>Users are solely responsible</strong> for ensuring their use of this software complies with all applicable local, state, and federal laws. The developers assume no liability for misuse.',
  },
  aboutProject: {
    title: 'About This Project',
    intro:
      'Privacy Signal Monitor is an open-source dashboard that combines multiple privacy and security tools into a unified interface. It was created to help privacy-conscious individuals understand and protect themselves from mobile surveillance threats.',
    keyFeaturesTitle: 'Key Features:',
    features: {
      imsiCatcher: {
        label: 'IMSI Catcher Detection:',
        description: 'Passive monitoring of GSM signals to detect fake base stations',
      },
      cellTower: {
        label: 'Cell Tower Triangulation:',
        description: 'Map cell towers and estimate locations using OpenCellID',
      },
      metadata: {
        label: 'Metadata Analysis:',
        description: 'Extract hidden data from files using ExifTool integration',
      },
      alertSystem: {
        label: 'Alert System:',
        description: 'Real-time notifications for suspicious network activity',
      },
    },
  },
  technicalRequirements: {
    title: 'Technical Requirements',
    hardware: {
      title: 'Hardware',
      item1: 'RTL-SDR USB Dongle (v3 recommended)',
      item2: 'Suitable antenna for GSM frequencies',
      item3: 'Linux computer (Ubuntu 20.04+)',
    },
    software: {
      title: 'Software',
      item1: 'Python 3.8+',
      item2: 'gr-gsm, rtl-sdr, kalibrate-rtl',
      item3: 'ExifTool',
      item4: 'Flask backend (optional)',
    },
  },
  resources: {
    title: 'Resources & Documentation',
    sourceCode: {
      title: 'Source Code',
      description: 'View on GitHub',
    },
    openCellId: {
      title: 'OpenCellID',
      description: 'Cell tower database',
    },
    grGsm: {
      title: 'gr-gsm',
      description: 'GSM receiver blocks',
    },
    exifTool: {
      title: 'ExifTool',
      description: 'Metadata extraction',
    },
  },
  version: {
    line1: 'Privacy Signal Monitor v1.0.0',
    line2: 'Built with React, TypeScript, and Tailwind CSS',
  },
} as const;
