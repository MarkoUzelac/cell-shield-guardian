import type { DiagnosticDefinition } from '../types';
import { make, unavailable } from '../shared';

export const privacyChecks: DiagnosticDefinition[] = [
  {
    id: 'privacy.dnt',
    label: 'Do Not Track / Global Privacy Control',
    category: 'privacy',
    instant: true,
    run: () => {
      const dnt = navigator.doNotTrack ?? (window as { doNotTrack?: string }).doNotTrack;
      const gpc = (navigator as Navigator & { globalPrivacyControl?: boolean })
        .globalPrivacyControl;
      if (dnt == null && gpc == null) {
        return unavailable(
          'privacy.dnt',
          'Do Not Track / Global Privacy Control',
          'privacy',
          'Your browser does not expose either signal. Note that both are advisory: sites are free to ignore them.',
        );
      }
      const enabled = dnt === '1' || dnt === 'yes' || gpc === true;
      return make({
        id: 'privacy.dnt',
        label: 'Do Not Track / Global Privacy Control',
        category: 'privacy',
        status: enabled ? 'good' : 'attention',
        value: enabled ? 'Signal sent' : 'Not sent',
        source: 'browser-api',
        confidence: 'confirmed',
        variant: enabled ? 'enabled' : 'disabled',
        explanation: enabled
          ? 'Your browser asks sites not to track you. This is a request only — it is not enforced, and many sites ignore it.'
          : 'Your browser is not sending a tracking-opt-out signal. Even when sent, the signal is advisory rather than enforced.',
        recommendation: enabled
          ? undefined
          : 'You can enable Global Privacy Control in your browser privacy settings, but do not rely on it alone.',
        raw: { doNotTrack: dnt, globalPrivacyControl: gpc },
      });
    },
  },
  {
    id: 'privacy.cookies',
    label: 'Cookies',
    category: 'privacy',
    instant: true,
    run: () =>
      make({
        id: 'privacy.cookies',
        label: 'Cookies',
        category: 'privacy',
        status: 'good',
        value: navigator.cookieEnabled ? 'Enabled' : 'Blocked',
        source: 'browser-api',
        confidence: 'confirmed',
        variant: navigator.cookieEnabled ? 'enabled' : 'blocked',
        explanation: navigator.cookieEnabled
          ? 'This site could set cookies. Whether third-party cookies are blocked is a separate setting that pages cannot reliably read.'
          : 'Cookie storage is blocked for this site. Some sites will not work correctly.',
        raw: { cookieEnabled: navigator.cookieEnabled },
      }),
  },
  {
    id: 'privacy.storage',
    label: 'Local storage',
    category: 'privacy',
    instant: true,
    run: () => {
      let writable = false;
      let reason: string | undefined;
      try {
        const key = '__psm_probe__';
        localStorage.setItem(key, '1');
        localStorage.removeItem(key);
        writable = true;
      } catch (error) {
        reason = error instanceof Error ? error.message : String(error);
      }
      return make({
        id: 'privacy.storage',
        label: 'Local storage',
        category: 'privacy',
        status: 'good',
        value: writable ? 'Available' : 'Unavailable',
        source: 'browser-api',
        confidence: 'measured',
        variant: writable ? 'available' : 'unavailable',
        explanation: writable
          ? 'This app can store your preferences and scan history on your device. Nothing stored here is uploaded anywhere.'
          : 'Storage is blocked, likely by private browsing or a strict privacy setting. Your preferences will not persist between visits.',
        raw: { writable, reason },
      });
    },
  },
  {
    id: 'privacy.permissions',
    label: 'Sensitive permissions',
    category: 'privacy',
    instant: false,
    run: async () => {
      if (!('permissions' in navigator)) {
        return unavailable(
          'privacy.permissions',
          'Sensitive permissions',
          'privacy',
          'The Permissions API is not available, so granted permissions cannot be listed.',
        );
      }
      const names = ['geolocation', 'camera', 'microphone', 'notifications'] as const;
      const states: Record<string, string> = {};
      for (const name of names) {
        try {
          const status = await navigator.permissions.query({
            name: name as PermissionName,
          });
          states[name] = status.state;
        } catch {
          states[name] = 'not queryable';
        }
      }
      const granted = Object.entries(states).filter(([, s]) => s === 'granted');
      return make({
        id: 'privacy.permissions',
        label: 'Sensitive permissions',
        category: 'privacy',
        status: granted.length > 0 ? 'attention' : 'good',
        value:
          granted.length > 0
            ? `${granted.length} granted to this site`
            : 'None granted to this site',
        source: 'browser-api',
        confidence: 'confirmed',
        variant: granted.length > 0 ? 'granted' : 'none',
        params: {
          count: granted.length,
          list: granted.map(([name]) => name).join(', '),
        },
        explanation:
          granted.length > 0
            ? `This site currently holds: ${granted.map(([n]) => n).join(', ')}. This app never uses them unless you start a feature that needs them.`
            : 'This site has not been granted location, camera, microphone or notification access. Permission state is per-site; it says nothing about other sites.',
        recommendation:
          granted.length > 0
            ? 'You can revoke these in your browser site settings at any time.'
            : undefined,
        raw: states,
      });
    },
  },
  {
    id: 'privacy.data-handling',
    label: 'Where your data goes',
    category: 'privacy',
    instant: true,
    run: () =>
      make({
        id: 'privacy.data-handling',
        label: 'Where your data goes',
        category: 'privacy',
        status: 'good',
        value: 'Processed on your device',
        source: 'derived',
        confidence: 'confirmed',
        explanation:
          'Every check on this dashboard runs inside your browser. The only outbound requests are the latency and reachability measurements, which send no personal data and are labelled as measured.',
        raw: { analytics: false, backend: false, thirdPartyTrackers: 0 },
      }),
  },
];
