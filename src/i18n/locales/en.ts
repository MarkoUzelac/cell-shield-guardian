/**
 * English source strings — the single source of truth for user-facing copy.
 *
 * Adding a language means copying this file, translating the values and
 * registering it in `src/i18n/index.ts`. Keys must never be translated.
 */
export const en = {
  common: {
    appName: 'Cell Shield Guardian',
    appShortName: 'Privacy Signal',
    appVersion: 'Monitor v1.0',
    online: 'Online',
    offline: 'Offline',
    more: 'More',
    close: 'Close',
    all: 'All',
    localAnalysis: 'Local analysis',
    localAnalysisHint: 'Runs in your browser',
    expandSidebar: 'Expand sidebar',
    collapseSidebar: 'Collapse sidebar',
    moreNavigation: 'More navigation options',
    loading: 'Loading…',
  },

  header: {
    disclaimer:
      'Browser-observable signals only. Cellular and radio-layer data cannot be read from a web page.',
  },

  nav: {
    home: 'Privacy & Connection',
    homeLong: 'Privacy & Connection Check',
    homeShort: 'Check',
    homeDescription: 'Live browser measurements',
    capabilities: 'Capability Matrix',
    capabilitiesDescription: 'What your browser can measure',
    demo: 'Cellular Simulation',
    demoDescription: 'Demo data — not from your device',
    map: 'Triangulation Map',
    mapShort: 'Map',
    mapDescription: 'Simulated cell tower mapping',
    network: 'Network Intelligence',
    networkShort: 'Network',
    networkDescription: 'Network security analysis',
    protection: 'Protection Guide',
    protectionDescription: 'Threats & countermeasures',
    metadata: 'Metadata Analyzer',
    metadataDescription: 'Analyze file metadata',
    alerts: 'Alerts & Logs',
    alertsShort: 'Alerts',
    alertsDescription: 'View all alerts',
    settings: 'Settings',
    settingsDescription: 'App preferences',
    about: 'About',
    aboutDescription: 'App information',
  },

  diagnostics: {
    status: {
      good: 'Good',
      attention: 'Attention',
      warning: 'Warning',
      unknown: 'Unknown',
      pending: 'Checking',
      error: 'Check failed',
    },
    confidence: {
      confirmed: 'Confirmed',
      measured: 'Measured',
      estimated: 'Estimated',
      'not-available': 'Not available',
    },
    confidenceHelp: {
      confirmed: 'The browser exposed this value directly.',
      measured: 'This app measured the value on your device just now.',
      estimated: 'Inferred from available signals; may be inaccurate.',
      'not-available': 'Your browser does not expose the information needed.',
    },
    capability: {
      SUPPORTED: 'Supported',
      PARTIALLY_SUPPORTED: 'Partially supported',
      PERMISSION_REQUIRED: 'Permission required',
      UNSUPPORTED: 'Unsupported',
      NOT_APPLICABLE: 'Not applicable',
    },
    capabilityHelp: {
      SUPPORTED:
        'Your browser fully exposes what this check needs, so the result is reliable.',
      PARTIALLY_SUPPORTED:
        'Your browser exposes only part of what this check needs. The result is indicative rather than exact.',
      PERMISSION_REQUIRED:
        'This check needs your explicit permission before the browser will share the data. Until you grant it, nothing is measured.',
      UNSUPPORTED:
        'Your browser does not offer the API this check needs, so no value can be produced. Unsupported is not the same as safe.',
      NOT_APPLICABLE:
        'This information lives outside the browser sandbox (for example in the phone radio or operating system) and no web page can ever read it.',
    },
    category: {
      connection: 'Connection',
      browser: 'Browser',
      privacy: 'Privacy',
      security: 'Security',
      network: 'Network',
    },
    categoryDescription: {
      connection: 'What your browser reports about how you are connected.',
      browser: 'Environment details your browser exposes to every website.',
      privacy: 'Browser-observable privacy signals. Nothing leaves your device.',
      security: 'Transport and context security checks for this page.',
      network: 'Values actively measured from your device right now.',
    },
    row: {
      whatYouCanDo: 'What you can do:',
      id: 'id',
      source: 'source',
      capability: 'capability',
      measured: 'measured',
      raw: 'raw',
    },
    overall: {
      label: 'Overall: {{status}}',
      scanProgress: 'Scan progress',
      percentComplete: '{{progress}}% complete',
      lastScan: 'Last scan {{time}}',
      noScanYet: 'No scan yet',
      took: ' · took {{seconds}}s',
      scanning: 'Scanning…',
      scanAgain: 'Scan again',
      countGood: 'Good:',
      countAttention: 'Attention:',
      countWarning: 'Warning:',
      countUnknown: 'Not available:',
      headline: {
        good: 'No issues found by the available checks',
        attention: 'A few things are worth reviewing',
        warning: 'Something needs your attention',
        unknown: 'Not enough information yet',
        pending: 'Checking your browser and connection',
        error: 'Some checks could not complete',
      },
      subline: {
        good: 'This covers what a web page can observe. It is not a guarantee that your device or network is secure.',
        attention: 'Nothing here is dangerous by itself, but the items below are worth a look.',
        warning: 'One or more checks found a real problem. Open the item below for details.',
        unknown: 'Your browser withheld the information these checks need. Unknown does not mean safe.',
        pending: 'Results appear as each check finishes.',
        error: 'Individual checks failed. Everything else on this page is still valid.',
      },
    },
  },

  pages: {
    index: {
      title: 'Privacy & Connection Check',
      subtitle: 'Live measurements from your browser',
      technicalDetails: 'Technical details',
      exportReport: 'Export report',
      cannotTellTitle: 'What this tool cannot tell you',
      cannotTellBody:
        'A web page has no access to your mobile network. IMSI catchers, cell tower identity, SIM details, encryption downgrades, baseband state and VPN usage cannot be detected from a browser, and this dashboard will never guess at them. Checks that cannot be performed are reported as <strong>Not available</strong>, which is not the same as safe.',
      demoPointerBefore:
        'A simulation of what a privileged native Android app could show is available on the',
      demoPointerLink: 'demo dashboard',
      demoPointerAfter: '— its data is generated locally and clearly labelled as synthetic.',
    },
    capabilities: {
      title: 'Browser Capability Matrix',
      subtitle: 'What your browser can and cannot measure',
      intro:
        'Every diagnostic in this app depends on a browser API. This matrix shows, for your current browser, whether each one can actually run — and when it cannot, why.',
      detecting: 'Detecting capabilities…',
      filterCount: '{{label}} ({{count}})',
      empty: 'No diagnostics in this state on your browser.',
      footerBefore:
        'Capability describes whether a measurement is possible, not whether you are safe. See the',
      footerLink: 'privacy & connection check',
      footerAfter: 'for actual results.',
    },
    notFound: {
      title: '404',
      message: 'Oops! Page not found',
      backHome: 'Return to Home',
    },
  },
} as const;

export type Translations = typeof en;
