import type { DiagnosticDefinition } from '../types';
import { make, unavailable } from '../shared';

const LATENCY_SAMPLES = 4;
const LATENCY_TIMEOUT_MS = 4000;

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

/**
 * Round-trip time to this site's own origin. Deliberately same-origin: no
 * third-party service sees the request, and nothing about the user is sent.
 */
async function measureLatency(signal: AbortSignal): Promise<number[]> {
  const samples: number[] = [];
  for (let i = 0; i < LATENCY_SAMPLES; i += 1) {
    if (signal.aborted) break;
    const url = `${window.location.origin}/favicon.ico?probe=${Date.now()}-${i}`;
    const start = performance.now();
    try {
      await fetch(url, { method: 'HEAD', cache: 'no-store', signal });
      samples.push(performance.now() - start);
    } catch {
      // A failed sample is skipped rather than recorded as a value.
    }
  }
  return samples;
}

export const networkChecks: DiagnosticDefinition[] = [
  {
    id: 'network.latency',
    label: 'Round-trip latency',
    category: 'network',
    instant: false,
    run: async (signal) => {
      const controller = new AbortController();
      const onAbort = () => controller.abort();
      signal.addEventListener('abort', onAbort);
      const timer = setTimeout(() => controller.abort(), LATENCY_TIMEOUT_MS);
      const start = performance.now();
      try {
        const samples = await measureLatency(controller.signal);
        if (samples.length === 0) {
          return make({
            id: 'network.latency',
            label: 'Round-trip latency',
            category: 'network',
            status: 'error',
            value: 'Measurement failed',
            source: 'measured',
            confidence: 'not-available',
            variant: 'failed',
            explanation:
              'No probe completed. You may be offline, or the request was blocked or timed out.',
            recommendation: 'Check your connection and run the scan again.',
          });
        }
        const value = median(samples);
        const status = value < 120 ? 'good' : value < 400 ? 'attention' : 'warning';
        return make({
          id: 'network.latency',
          label: 'Round-trip latency',
          category: 'network',
          status,
          value: value.toFixed(0),
          unit: 'ms',
          source: 'measured',
          confidence: 'measured',
          durationMs: performance.now() - start,
          params: { ms: Math.round(value), count: samples.length },
          explanation: `Median of ${samples.length} request round-trips to this site's own server. It reflects the delay between your device and this server only — other destinations may differ.`,
          variant: status === 'warning' ? 'slow' : 'ok',
          recommendation:
            status === 'warning'
              ? 'High latency usually comes from a weak signal, a congested network, or a distant server.'
              : undefined,
          raw: { samples: samples.map((s) => Number(s.toFixed(1))), median: value },
        });
      } finally {
        clearTimeout(timer);
        signal.removeEventListener('abort', onAbort);
      }
    },
  },
  {
    id: 'network.ttfb',
    label: 'Server response time',
    category: 'network',
    instant: false,
    run: () => {
      const [nav] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (!nav) {
        return unavailable(
          'network.ttfb',
          'Server response time',
          'network',
          'Navigation Timing data is not available in this browser.',
        );
      }
      const ttfb = nav.responseStart - nav.requestStart;
      const status = ttfb < 200 ? 'good' : ttfb < 600 ? 'attention' : 'warning';
      return make({
        id: 'network.ttfb',
        label: 'Server response time',
        category: 'network',
        status,
        value: ttfb.toFixed(0),
        unit: 'ms',
        source: 'measured',
        confidence: 'measured',
        params: { ms: Math.round(ttfb) },
        explanation:
          'Time from requesting this page to the first byte arriving, recorded by your browser during page load.',
        raw: {
          ttfb,
          domContentLoaded: nav.domContentLoadedEventEnd,
          loadEvent: nav.loadEventEnd,
          transferSize: nav.transferSize,
        },
      });
    },
  },
  {
    id: 'network.throughput',
    label: 'Observed throughput',
    category: 'network',
    instant: false,
    run: () => {
      const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const usable = entries.filter((e) => e.transferSize > 8000 && e.duration > 0);
      if (usable.length === 0) {
        return unavailable(
          'network.throughput',
          'Observed throughput',
          'network',
          'Not enough sizeable downloads have happened on this page to estimate throughput. This app does not run a bandwidth burn test unless you ask for one.',
        );
      }
      const best = usable.reduce((acc, e) =>
        e.transferSize / e.duration > acc.transferSize / acc.duration ? e : acc,
      );
      const mbps = (best.transferSize * 8) / (best.duration * 1000);
      return make({
        id: 'network.throughput',
        label: 'Observed throughput',
        category: 'network',
        status: 'good',
        value: mbps.toFixed(1),
        unit: 'Mbps',
        source: 'measured',
        confidence: 'estimated',
        params: { mbps: Number(mbps.toFixed(1)), count: usable.length },
        explanation:
          'A lower bound derived from the fastest real download this page already made. Your actual maximum speed is likely higher — this is not a speed test.',
        recommendation: 'Use the Network page for a deliberate, consent-gated speed test.',
        raw: {
          samples: usable.length,
          bytes: best.transferSize,
          durationMs: Number(best.duration.toFixed(1)),
        },
      });
    },
  },
  {
    id: 'network.reachability',
    label: 'Internet reachability',
    category: 'network',
    instant: false,
    run: async (signal) => {
      if (!navigator.onLine) {
        return make({
          id: 'network.reachability',
          label: 'Internet reachability',
          category: 'network',
          status: 'warning',
          value: 'Offline',
          source: 'browser-api',
          confidence: 'confirmed',
          variant: 'offline',
          explanation: 'Your browser reports no network connection, so no probe was sent.',
        });
      }
      const controller = new AbortController();
      const onAbort = () => controller.abort();
      signal.addEventListener('abort', onAbort);
      const timer = setTimeout(() => controller.abort(), 4000);
      try {
        const response = await fetch(`${window.location.origin}/favicon.ico?reach=${Date.now()}`, {
          method: 'HEAD',
          cache: 'no-store',
          signal: controller.signal,
        });
        return make({
          id: 'network.reachability',
          label: 'Internet reachability',
          category: 'network',
          status: response.ok ? 'good' : 'attention',
          value: response.ok ? 'Reachable' : `Responded ${response.status}`,
          source: 'measured',
          confidence: 'measured',
          variant: response.ok ? 'reachable' : 'status',
          params: { status: response.status },
          explanation: response.ok
            ? 'A live request to this site completed successfully, which confirms real connectivity rather than just an active network interface.'
            : `The server answered with status ${response.status}. Connectivity exists but something is interfering with the request.`,
          raw: { status: response.status },
        });
      } catch (error) {
        return make({
          id: 'network.reachability',
          label: 'Internet reachability',
          category: 'network',
          status: 'warning',
          value: 'Unreachable',
          source: 'measured',
          confidence: 'measured',
          variant: 'unreachable',
          explanation:
            'The connectivity probe did not complete. This can mean you are offline, or that a captive portal, firewall, or content blocker is intercepting requests.',
          recommendation: 'Retry the scan, or check whether a network sign-in page is waiting.',
          raw: { error: error instanceof Error ? error.message : String(error) },
        });
      } finally {
        clearTimeout(timer);
        signal.removeEventListener('abort', onAbort);
      }
    },
  },
];
