/**
 * English source strings — the single source of truth for user-facing copy.
 *
 * Adding a language means copying this file, translating the values and
 * registering it in `src/i18n/index.ts`. Keys must never be translated.
 */
import { about } from '../pages/en/about';
import { alerts } from '../pages/en/alerts';
import { demo } from '../pages/en/demo';
import { map } from '../pages/en/map';
import { metadata } from '../pages/en/metadata';
import { network } from '../pages/en/network';
import { protection } from '../pages/en/protection';
import { settings } from '../pages/en/settings';
import { tactical } from '../pages/en/tactical';

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

  pages: {
    // Page copy lives in `src/i18n/pages/en/*` so each screen's strings can be
    // translated (and reviewed) independently of the shared vocabulary above.
    about,
    alerts,
    demo,
    map,
    metadata,
    network,
    protection,
    settings,
    tactical,

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
