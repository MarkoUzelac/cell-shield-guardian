import type { DiagnosticDefinition } from '../types';
import { make, unavailable } from '../shared';

export type NavigatorConnection = NetworkInformation;

/** Single typed accessor for the Network Information API across prefixes. */
export function getConnection(): NavigatorConnection | undefined {
  if (typeof navigator === 'undefined') return undefined;
  return navigator.connection ?? navigator.mozConnection ?? navigator.webkitConnection;
}

const EFFECTIVE_TYPE_LABEL: Record<string, string> = {
  'slow-2g': 'Very slow (slow-2g)',
  '2g': 'Slow (2g)',
  '3g': 'Moderate (3g)',
  '4g': 'Fast (4g or better)',
};

export const connectionChecks: DiagnosticDefinition[] = [
  {
    id: 'connection.online',
    label: 'Online status',
    category: 'connection',
    instant: true,
    run: () => {
      const online = navigator.onLine;
      return make({
        id: 'connection.online',
        label: 'Online status',
        category: 'connection',
        status: online ? 'good' : 'warning',
        value: online ? 'Online' : 'Offline',
        source: 'browser-api',
        confidence: 'confirmed',
        variant: online ? 'online' : 'offline',
        explanation: online
          ? 'Your browser reports an active network connection. This flag only means a network interface is up, not that the internet is reachable.'
          : 'Your browser reports no network connection. Results below may be stale or unavailable.',
        raw: { onLine: online },
      });
    },
  },
  {
    id: 'connection.type',
    label: 'Connection type',
    category: 'connection',
    instant: true,
    run: () => {
      const c = getConnection();
      if (!c || (!c.effectiveType && !c.type)) {
        return unavailable(
          'connection.type',
          'Connection type',
          'connection',
          'The Network Information API is not available in this browser. Safari and Firefox do not expose it, so the connection type cannot be determined.',
        );
      }
      const effectiveType = c.effectiveType;
      const label = effectiveType
        ? EFFECTIVE_TYPE_LABEL[effectiveType] ?? effectiveType
        : (c.type!);
      return make({
        id: 'connection.type',
        label: 'Connection type',
        category: 'connection',
        status: 'good',
        value: label,
        source: 'browser-api',
        confidence: 'estimated',
        variant: effectiveType && EFFECTIVE_TYPE_LABEL[effectiveType] ? effectiveType : 'raw',
        params: { type: effectiveType ?? (c.type!) },
        explanation:
          'Your browser groups your connection into a broad speed class based on recent traffic. It is an estimate, not a measurement, and it does not reveal your carrier or network operator.',
        raw: { ...c },
      });
    },
  },
  {
    id: 'connection.downlink',
    label: 'Reported downlink',
    category: 'connection',
    instant: true,
    run: () => {
      const c = getConnection();
      if (!c || typeof c.downlink !== 'number') {
        return unavailable(
          'connection.downlink',
          'Reported downlink',
          'connection',
          'This browser does not expose a bandwidth estimate. See the measured download speed in the Network section instead.',
        );
      }
      return make({
        id: 'connection.downlink',
        label: 'Reported downlink',
        category: 'connection',
        status: 'good',
        value: `${c.downlink}`,
        unit: 'Mbps',
        source: 'browser-api',
        confidence: 'estimated',
        params: { downlink: c.downlink },
        explanation:
          'A rounded bandwidth estimate from your browser, capped for privacy reasons. Treat it as a rough indication only.',
        raw: { downlink: c.downlink, rtt: c.rtt },
      });
    },
  },
  {
    id: 'connection.savedata',
    label: 'Data Saver',
    category: 'connection',
    instant: true,
    run: () => {
      const c = getConnection();
      if (!c || typeof c.saveData !== 'boolean') {
        return unavailable(
          'connection.savedata',
          'Data Saver',
          'connection',
          'This browser does not expose a Data Saver preference.',
        );
      }
      return make({
        id: 'connection.savedata',
        label: 'Data Saver',
        category: 'connection',
        status: 'good',
        value: c.saveData ? 'Requested' : 'Not requested',
        source: 'browser-api',
        confidence: 'confirmed',
        variant: c.saveData ? 'on' : 'off',
        explanation: c.saveData
          ? 'You have asked for reduced data usage. This app defers non-essential work while this is on.'
          : 'You have not asked for reduced data usage.',
        raw: { saveData: c.saveData },
      });
    },
  },
];
