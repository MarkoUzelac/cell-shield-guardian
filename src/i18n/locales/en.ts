/**
 * English source strings — the single source of truth for user-facing copy.
 *
 * Adding a language means copying this file, translating the values and
 * registering it in `src/i18n/index.ts`. Keys must never be translated.
 */
import { dashboard as dashboardComponents } from '../components/en-dashboard';
import { map as mapComponents } from '../components/en-map';
import { metadata as metadataComponents } from '../components/en-metadata';
import { network as networkComponents } from '../components/en-network';
import { triangulation as triangulationComponents } from '../components/en-triangulation';
import { misc as miscComponents } from '../components/en-misc';
import { about } from '../pages/en/about';
import { alerts } from '../pages/en/alerts';
import { map } from '../pages/en/map';
import { metadata } from '../pages/en/metadata';
import { network } from '../pages/en/network';
import { protection } from '../pages/en/protection';
import { settings } from '../pages/en/settings';

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
    jumpToSection: 'Jump to section',
    loading: 'Loading…',
    educationalUseOnly: 'Educational Use Only',
    proUpsell: {
      title: 'Upgrade to Pro',
      subtitle: 'Real-time tower data & advanced alerts',
      price: '€9.99/mo',
    },
    language: {
      label: 'Language',
      switchTo: 'Switch language to {{language}}',
      autoDetected: 'Language set from your region',
    },
  },

  a11y: {
    skipToContent: 'Skip to main content',
    primaryNav: 'Primary navigation',
    homeLink: 'Cell Shield Guardian — go to the home check',
    currentTime: 'Current time {{time}}',
    navigatedTo: 'Navigated to {{page}}',
    shortcuts: {
      title: 'Keyboard shortcuts',
      description: 'Press Shift + ? at any time to open or close this list.',
      help: 'Show keyboard shortcuts',
      sidebar: 'Collapse or expand the sidebar',
    },
  },

  live: {
    title: 'Live updates',
    intervalLabel: 'Refresh interval',
    interval_one: 'Every {{count}} second',
    interval_other: 'Every {{count}} seconds',
    refreshNow: 'Refresh now',
    streaming: 'Streaming — waiting for the first update.',
    lastUpdate_one: 'Updated {{count}} second ago.',
    lastUpdate_other: 'Updated {{count}} seconds ago.',
    pausedHidden: 'Paused while this tab is in the background. It resumes when you return.',
    offDescription: 'Off. Measurements only run when you press a refresh button.',
    badge: 'Live',
    note: 'Live updates re-take the same in-browser measurements on a timer. There is no server feed, and cellular identity such as IMSI or cell ID cannot be read from a web page.',
  },

  threat: {
    title: 'Threat Score',
    levels: {
      low: 'Low exposure',
      moderate: 'Moderate exposure',
      elevated: 'Elevated exposure',
      high: 'High exposure',
    },
    levelHint: {
      low: 'Nothing unusual in the measurements or in how your connection behaved.',
      moderate: 'A few findings or connection changes worth a look, but no strong pattern.',
      elevated: 'Several findings combine with an unstable connection pattern. Review the contributors below.',
      high: 'Multiple serious findings and frequent connection changes. Review the contributors and the alerts list.',
    },
    contributors: 'What raised the score',
    noContributors: 'Nothing raised the score in this session.',
    handovers: {
      transitions: 'Connection transitions',
      downgrades: 'Downgrades',
      flaps: 'Online/offline flaps',
      rate: 'Per minute',
    },
    factors: {
      criticalFindings_one: '{{count}} diagnostic raised a warning or error',
      criticalFindings_other: '{{count}} diagnostics raised a warning or error',
      attentionFindings_one: '{{count}} diagnostic needs attention',
      attentionFindings_other: '{{count}} diagnostics need attention',
      insecureTransport_one: '{{count}} security finding about how this page is delivered',
      insecureTransport_other: '{{count}} security findings about how this page is delivered',
      handoverRate: '{{rate}} connection transitions per minute',
      downgrades_one: '{{count}} downgrade to a slower connection class',
      downgrades_other: '{{count}} downgrades to a slower connection class',
      connectionFlaps_one: '{{count}} online/offline transition',
      connectionFlaps_other: '{{count}} online/offline transitions',
      unavailableVisibility: '{{count}} of {{total}} checks cannot be performed in this browser',
      fileGps: 'The file carries GPS coordinates',
      filePrivacyRisks_one: '{{count}} privacy risk found in the file',
      filePrivacyRisks_other: '{{count}} privacy risks found in the file',
      fileIdentifiers_one: '{{count}} identifying metadata field in the file',
      fileIdentifiers_other: '{{count}} identifying metadata fields in the file',
    },
    method:
      'Scored from diagnostics measured in this browser and from connection transitions observed over the last {{minutes}} minutes. A web page cannot see cellular handovers, cell identity or IMSI, so those are never part of this score.',
    log: {
      title: 'Observed connection transitions',
      empty: 'No connection transitions observed yet in this session.',
      reset: 'Clear transition log',
      kinds: {
        downgrade: 'Downgrade',
        upgrade: 'Upgrade',
        'type-change': 'Type change',
        'quality-shift': 'Quality shift',
        offline: 'Went offline',
        online: 'Came back online',
      },
    },
    metadataTitle: 'File + session Threat Score',
    metadataHint:
      'Combines the exposure found in this file with the diagnostics and connection behaviour measured on this device.',
  },




  offline: {
    offlineTitle: 'You are offline.',
    offlineDescription: 'Showing the last results stored on this device.',
    cachedTitle: 'Stored results.',
    cachedAt: 'Last measured {{timestamp}}.',
    log: {
      title: 'Scan log',
      description: 'The last {{count}} scans, stored on this device only.',
      empty: 'No stored scans yet. Run a check and it will be kept here for offline use.',
      export: 'Export log',
      clear: 'Clear stored data',
      cleared: 'Stored offline data cleared.',
      entry: '{{count}} checks',
      storage: '{{used}} of {{quota}} used on this device',
    },
  },

  header: {
    disclaimer:
      'Browser-observable signals only. Cellular and radio-layer data cannot be read from a web page.',
  },

  nav: {
    groups: {
      measure: 'Measure',
      analyse: 'Analyse',
      learn: 'Learn',
    },
    home: 'Privacy & Connection',

    homeLong: 'Privacy & Connection Check',
    homeShort: 'Check',
    homeDescription: 'Live browser measurements',
    capabilities: 'Capability Matrix',
    capabilitiesDescription: 'What your browser can measure',
    map: 'Tower Map',
    mapShort: 'Map',
    mapDescription: 'Nearby mast locations from OpenStreetMap',
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

    /**
     * Per-check copy. Keys resolve as
     *   diagnostics.checks.<id>.<variant>.<field>  →  diagnostics.checks.<id>.<field>
     * and fall back to the engine's English text when absent, so a locale only
     * needs to translate what it wants to change.
     *
     * Values are interpolated (never concatenated): numbers go through
     * `{{x, number}}` so decimal separators follow the locale, and `count`
     * drives real plural rules.
     */
    checks: {
      'connection.online': {
        online: {
          value: 'Online',
          explanation:
            'Your browser reports an active network connection. This flag only means a network interface is up, not that the internet is reachable.',
        },
        offline: {
          value: 'Offline',
          explanation:
            'Your browser reports no network connection. Results below may be stale or unavailable.',
        },
      },
      'connection.type': {
        'slow-2g': { value: 'Very slow (slow-2g)' },
        '2g': { value: 'Slow (2g)' },
        '3g': { value: 'Moderate (3g)' },
        '4g': { value: 'Fast (4g or better)' },
        raw: { value: '{{type}}' },
      },
      'connection.downlink': {
        value: '{{downlink, number}} Mbps',
      },
      'connection.savedata': {
        on: {
          value: 'Requested',
          explanation:
            'You have asked for reduced data usage. This app defers non-essential work while this is on.',
        },
        off: { value: 'Not requested' },
      },

      'browser.viewport': {
        value: '{{width, number}} × {{height, number}} px',
        explanation:
          'This page can see an area of {{width, number}} by {{height, number}} pixels at a density of {{density, number}}×. Websites use this for layout, but it also contributes to browser fingerprinting.',
      },
      'browser.language': {
        value: '{{language}}',
        explanation_one:
          'Your browser sends {{language}} as your preferred language with every request.',
        explanation_other:
          'Your browser sends {{language}} first out of {{count}} preferred languages with every request.',
      },
      'browser.hardware': {
        both: {
          value: '{{cores, number}} cores · {{memory, number}} GB memory class',
          explanation:
            'Your browser reports {{cores, number}} logical CPU cores and a memory class of {{memory, number}} GB. Both numbers are deliberately rounded, but they still add to fingerprinting surface.',
        },
        cores: {
          value: '{{cores, number}} cores',
          explanation:
            'Your browser reports {{cores, number}} logical CPU cores and withholds the memory hint.',
        },
        memory: {
          value: '{{memory, number}} GB memory class',
          explanation:
            'Your browser reports a memory class of {{memory, number}} GB and withholds the CPU hint.',
        },
      },

      'network.latency': {
        value: '{{ms, number}} ms',
        explanation_one:
          'Median of a single request round-trip to this site’s own server. It reflects the delay between your device and this server only.',
        explanation_other:
          'Median of {{count}} request round-trips to this site’s own server. It reflects the delay between your device and this server only — other destinations may differ.',
        slow: {
          recommendation:
            'A round trip of {{ms, number}} ms is high. This usually comes from a weak signal, a congested network, or a distant server.',
        },
        failed: { value: 'Measurement failed' },
      },
      'network.ttfb': {
        value: '{{ms, number}} ms',
        explanation:
          'Your browser recorded {{ms, number}} ms between requesting this page and the first byte arriving.',
      },
      'network.throughput': {
        value: '{{mbps, number}} Mbps',
        explanation_one:
          'A lower bound of {{mbps, number}} Mbps derived from one real download this page already made. Your actual maximum speed is likely higher — this is not a speed test.',
        explanation_other:
          'A lower bound of {{mbps, number}} Mbps derived from the fastest of {{count}} real downloads this page already made. Your actual maximum speed is likely higher — this is not a speed test.',
      },
      'network.reachability': {
        reachable: { value: 'Reachable' },
        status: {
          value: 'Responded {{status, number}}',
          explanation:
            'The server answered with status {{status, number}}. Connectivity exists, but something is interfering with the request.',
        },
        offline: { value: 'Offline' },
        unreachable: { value: 'Unreachable' },
      },

      'security.https': {
        https: { value: 'HTTPS' },
        localhost: {
          value: 'HTTP (local development)',
          explanation:
            'You are on {{host}}, a local development address where plain HTTP is expected and not a real risk.',
        },
        http: {
          value: 'HTTP',
          explanation:
            'This page loaded from {{host}} over plain HTTP. Anything you send can be read or altered by anyone on the network path.',
        },
      },
      'security.secure-context': {
        active: { value: 'Active' },
        inactive: { value: 'Inactive' },
      },
      'security.mixed-content': {
        clean: { value: 'None detected' },
        insecure: {
          value_one: '{{count}} insecure resource',
          value_other: '{{count}} insecure resources',
          explanation_one:
            'One resource on this page loaded over unencrypted HTTP, which weakens the protection of the whole page.',
          explanation_other:
            '{{count}} resources on this page loaded over unencrypted HTTP, which weakens the protection of the whole page.',
        },
      },

      'privacy.dnt': {
        enabled: { value: 'Signal sent' },
        disabled: { value: 'Not sent' },
      },
      'privacy.cookies': {
        enabled: { value: 'Enabled' },
        blocked: { value: 'Blocked' },
      },
      'privacy.storage': {
        available: { value: 'Available' },
        unavailable: { value: 'Unavailable' },
      },
      'privacy.permissions': {
        none: {
          value: 'None granted to this site',
        },
        granted: {
          value_one: '{{count}} granted to this site',
          value_other: '{{count}} granted to this site',
          explanation_one:
            'This site currently holds one permission ({{list}}). This app never uses it unless you start a feature that needs it.',
          explanation_other:
            'This site currently holds {{count}} permissions ({{list}}). This app never uses them unless you start a feature that needs them.',
          recommendation:
            'You can revoke these in your browser site settings at any time.',
        },
      },
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

  // Copy for shared feature components, kept separate from page copy because
  // the same component can appear on several screens.
  components: {
    dashboard: dashboardComponents,
    map: mapComponents,
    metadata: metadataComponents,
    network: networkComponents,
    triangulation: triangulationComponents,
    misc: miscComponents,
  },

  pages: {
    // Page copy lives in `src/i18n/pages/en/*` so each screen's strings can be
    // translated (and reviewed) independently of the shared vocabulary above.
    about,
    alerts,
    map,
    metadata,
    network,
    protection,
    settings,

    index: {
      title: 'Privacy & Connection Check',
      subtitle: 'Live measurements from your browser',
      technicalDetails: 'Technical details',
      exportReport: 'Export report',
      cannotTellTitle: 'What this tool cannot tell you',
      cannotTellBody:
        'A web page has no access to your mobile network. IMSI catchers, cell tower identity, SIM details, encryption downgrades, baseband state and VPN usage cannot be detected from a browser, and this dashboard will never guess at them. Checks that cannot be performed are reported as <strong>Not available</strong>, which is not the same as safe.',
      capabilityPointerBefore:
        'Every reading here comes from a browser API that runs on your device. To see exactly which of those APIs your browser supports, open the',
      capabilityPointerLink: 'capability matrix',
      capabilityPointerAfter: '— it lists each measurement and why some are unavailable.',

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
      permissions: {
        title: 'Live permission check',
        intro:
          'Some capabilities stay unknown until you ask the browser for them. Running a check opens your browser’s own permission prompt — the result updates the matrix immediately, and nothing measured here is stored or sent anywhere.',
        check: 'Check access',
        refresh: 'Re-read',
        footer:
          'You can change any answer later in your browser’s site settings. Denying a permission is respected: this page will not ask again unless you use the buttons above.',
        state: {
          prompt: 'Not asked yet — your browser will prompt you.',
          granted: 'Granted to this site.',
          denied: 'Blocked. Re-enable it in your browser site settings if you want it.',
          unsupported: 'This browser does not offer the API at all.',
          requesting: 'Waiting for your answer…',
          error: 'The request could not complete. Try again.',
        },
        probe: {
          geolocation: {
            label: 'Location',
            description:
              'Only the permission answer is used — coordinates are discarded and never leave your device.',
          },
          notifications: {
            label: 'Notifications',
            description:
              'Checks whether this site may show system notifications. No notification is sent.',
          },
          camera: {
            label: 'Camera',
            description:
              'Opens the camera just long enough to read the permission answer, then releases it immediately.',
          },
          microphone: {
            label: 'Microphone',
            description:
              'Opens the microphone just long enough to read the permission answer, then releases it immediately. No audio is recorded.',
          },
          'clipboard-read': {
            label: 'Clipboard read',
            description:
              'Checks whether this site could read your clipboard. Any content returned is discarded unread.',
          },
          'persistent-storage': {
            label: 'Persistent storage',
            description:
              'Asks the browser not to evict this app’s local data when storage runs low.',
          },
        },
      },
    },

    notFound: {
      title: '404',
      message: 'Oops! Page not found',
      backHome: 'Return to Home',
    },
  },
} as const;

export type Translations = typeof en;
