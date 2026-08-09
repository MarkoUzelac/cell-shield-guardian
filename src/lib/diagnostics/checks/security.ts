import type { DiagnosticDefinition } from '../types';
import { make, unavailable } from '../shared';

export const securityChecks: DiagnosticDefinition[] = [
  {
    id: 'security.https',
    label: 'Transport encryption',
    category: 'security',
    instant: true,
    run: () => {
      const https = window.location.protocol === 'https:';
      const localhost = ['localhost', '127.0.0.1', '::1'].includes(
        window.location.hostname,
      );
      return make({
        id: 'security.https',
        label: 'Transport encryption',
        category: 'security',
        status: https ? 'good' : localhost ? 'unknown' : 'warning',
        value: https ? 'HTTPS' : localhost ? 'HTTP (local development)' : 'HTTP',
        source: 'browser-api',
        confidence: 'confirmed',
        explanation: https
          ? 'Traffic between your device and this site is encrypted, so it cannot be read or modified in transit by your network, your provider, or anyone on the same Wi-Fi.'
          : localhost
            ? 'You are on a local development address, where plain HTTP is expected and not a real risk.'
            : 'This page loaded over plain HTTP. Anything you send can be read or altered by anyone on the network path.',
        recommendation:
          !https && !localhost ? 'Do not enter sensitive information on this page.' : undefined,
        raw: { protocol: window.location.protocol, host: window.location.hostname },
      });
    },
  },
  {
    id: 'security.secure-context',
    label: 'Secure context',
    category: 'security',
    instant: true,
    run: () =>
      make({
        id: 'security.secure-context',
        label: 'Secure context',
        category: 'security',
        status: window.isSecureContext ? 'good' : 'attention',
        value: window.isSecureContext ? 'Active' : 'Inactive',
        source: 'browser-api',
        confidence: 'confirmed',
        explanation: window.isSecureContext
          ? 'Your browser considers this page trustworthy, which unlocks privacy-protected features such as secure storage and permission-gated APIs.'
          : 'This page is not a secure context, so the browser withholds several privacy and security protected features.',
        raw: { isSecureContext: window.isSecureContext },
      }),
  },
  {
    id: 'security.tls',
    label: 'TLS protocol version',
    category: 'security',
    instant: true,
    run: () =>
      unavailable(
        'security.tls',
        'TLS protocol version',
        'security',
        'Web pages cannot read the TLS version, cipher suite, or certificate chain of their own connection. Any tool claiming otherwise from a browser is guessing. Use your browser\'s padlock icon to inspect the certificate.',
        'NOT_APPLICABLE',
      ),
  },
  {
    id: 'security.mixed-content',
    label: 'Mixed content',
    category: 'security',
    instant: false,
    run: () => {
      if (window.location.protocol !== 'https:') {
        return unavailable(
          'security.mixed-content',
          'Mixed content',
          'security',
          'Mixed content only applies to pages served over HTTPS.',
          'NOT_APPLICABLE',
        );
      }
      const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const insecure = entries.filter((entry) => entry.name.startsWith('http://'));
      return make({
        id: 'security.mixed-content',
        label: 'Mixed content',
        category: 'security',
        status: insecure.length > 0 ? 'warning' : 'good',
        value:
          insecure.length > 0
            ? `${insecure.length} insecure resources`
            : 'None detected',
        source: 'measured',
        confidence: 'measured',
        explanation:
          insecure.length > 0
            ? 'Some resources on this page loaded over unencrypted HTTP, which weakens the protection of the whole page.'
            : 'Every resource this page loaded so far used an encrypted connection. This covers resources loaded up to now, not future ones.',
        raw: { insecureCount: insecure.length, sample: insecure.slice(0, 5).map((e) => e.name) },
      });
    },
  },
  {
    id: 'security.cellular',
    label: 'Cellular and radio-layer security',
    category: 'security',
    instant: true,
    run: () =>
      unavailable(
        'security.cellular',
        'Cellular and radio-layer security',
        'security',
        'IMSI, IMEI, cell tower identity, baseband state, SS7 exposure and 2G downgrade attacks are invisible to every web browser by design. Detecting them requires a native app with privileged system access.',
        'NOT_APPLICABLE',
      ),
  },
  {
    id: 'security.vpn',
    label: 'VPN or proxy in use',
    category: 'security',
    instant: true,
    run: () =>
      unavailable(
        'security.vpn',
        'VPN or proxy in use',
        'security',
        'A web page cannot reliably determine whether you are behind a VPN or proxy. Heuristics based on IP databases and time zone mismatches produce frequent false results, so this app does not guess.',
        'NOT_APPLICABLE',
      ),
  },
];
