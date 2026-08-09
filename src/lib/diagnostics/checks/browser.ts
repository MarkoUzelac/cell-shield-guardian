import type { DiagnosticDefinition } from '../types';
import { make, unavailable } from '../shared';

interface UAData {
  brands?: { brand: string; version: string }[];
  platform?: string;
  mobile?: boolean;
}

function uaData(): UAData | undefined {
  return (navigator as Navigator & { userAgentData?: UAData }).userAgentData;
}

/** Best-effort browser name. Explicitly an estimate: user agents can be spoofed. */
function browserName(): string {
  const data = uaData();
  const brands = data?.brands?.filter(
    (b) => !/not.a.brand/i.test(b.brand) && !/chromium/i.test(b.brand),
  );
  if (brands && brands.length > 0) return `${brands[0].brand} ${brands[0].version}`;

  const ua = navigator.userAgent;
  if (/Firefox\/(\d+)/.test(ua)) return `Firefox ${RegExp.$1}`;
  if (/Edg\/(\d+)/.test(ua)) return `Edge ${RegExp.$1}`;
  if (/OPR\/(\d+)/.test(ua)) return `Opera ${RegExp.$1}`;
  if (/Chrome\/(\d+)/.test(ua)) return `Chrome ${RegExp.$1}`;
  if (/Version\/(\d+).*Safari/.test(ua)) return `Safari ${RegExp.$1}`;
  return 'Unrecognised browser';
}

function platformFamily(): string {
  const data = uaData();
  if (data?.platform) return data.platform;
  const ua = navigator.userAgent;
  if (/Android/i.test(ua)) return 'Android';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
  if (/Windows/i.test(ua)) return 'Windows';
  if (/Mac OS X/i.test(ua)) return 'macOS';
  if (/Linux/i.test(ua)) return 'Linux';
  return 'Unknown';
}

export const browserChecks: DiagnosticDefinition[] = [
  {
    id: 'browser.identity',
    label: 'Browser',
    category: 'browser',
    instant: true,
    run: () =>
      make({
        id: 'browser.identity',
        label: 'Browser',
        category: 'browser',
        status: 'good',
        value: browserName(),
        source: 'browser-api',
        params: { browser: browserName() },
        confidence: uaData()?.brands ? 'confirmed' : 'estimated',
        explanation:
          'Derived from the identity your browser sends to every website. It can be changed or spoofed, so treat it as an indication rather than proof.',
        raw: { userAgent: navigator.userAgent, userAgentData: uaData() },
      }),
  },
  {
    id: 'browser.platform',
    label: 'Operating system family',
    category: 'browser',
    instant: true,
    run: () =>
      make({
        id: 'browser.platform',
        label: 'Operating system family',
        category: 'browser',
        status: 'good',
        value: platformFamily(),
        source: 'browser-api',
        params: { platform: platformFamily() },
        confidence: 'estimated',
        explanation:
          'Only the broad OS family is detectable from a web page. Exact version, device model, IMEI and baseband details are not available to any website.',
        raw: { platform: platformFamily(), mobile: uaData()?.mobile },
      }),
  },
  {
    id: 'browser.viewport',
    label: 'Viewport',
    category: 'browser',
    instant: true,
    run: () =>
      make({
        id: 'browser.viewport',
        label: 'Viewport',
        category: 'browser',
        status: 'good',
        value: `${window.innerWidth} x ${window.innerHeight}`,
        unit: 'px',
        source: 'browser-api',
        confidence: 'confirmed',
        params: {
          width: window.innerWidth,
          height: window.innerHeight,
          density: window.devicePixelRatio,
        },
        explanation:
          'The size of the area available to this page, plus your display density. Websites use this for layout, but it also contributes to browser fingerprinting.',
        raw: {
          innerWidth: window.innerWidth,
          innerHeight: window.innerHeight,
          devicePixelRatio: window.devicePixelRatio,
          screen: { width: screen.width, height: screen.height },
        },
      }),
  },
  {
    id: 'browser.language',
    label: 'Language',
    category: 'browser',
    instant: true,
    run: () =>
      make({
        id: 'browser.language',
        label: 'Language',
        category: 'browser',
        status: 'good',
        value: navigator.language,
        source: 'browser-api',
        confidence: 'confirmed',
        params: { language: navigator.language, count: navigator.languages?.length ?? 1 },
        explanation:
          'Your preferred language is sent with every request so sites can localise content.',
        raw: { language: navigator.language, languages: navigator.languages },
      }),
  },
  {
    id: 'browser.timezone',
    label: 'Time zone',
    category: 'browser',
    instant: true,
    run: () => {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (!tz) {
        return unavailable(
          'browser.timezone',
          'Time zone',
          'browser',
          'Your browser did not resolve a time zone.',
        );
      }
      return make({
        id: 'browser.timezone',
        label: 'Time zone',
        category: 'browser',
        status: 'good',
        value: tz,
        source: 'browser-api',
        confidence: 'confirmed',
        params: { timeZone: tz },
        explanation:
          'Your time zone is readable by any website and gives a coarse hint about your region. It is not your location.',
        raw: { timeZone: tz, offsetMinutes: new Date().getTimezoneOffset() },
      });
    },
  },
  {
    id: 'browser.hardware',
    label: 'Reported hardware',
    category: 'browser',
    instant: true,
    run: () => {
      const cores = navigator.hardwareConcurrency;
      const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
      if (!cores && !memory) {
        return unavailable(
          'browser.hardware',
          'Reported hardware',
          'browser',
          'This browser withholds CPU and memory hints, which reduces fingerprinting.',
        );
      }
      const parts = [
        cores ? `${cores} logical cores` : null,
        memory ? `${memory} GB memory class` : null,
      ].filter(Boolean);
      // The two hints are independent, so the sentence differs per outcome
      // rather than being glued together from fragments.
      const variant = cores && memory ? 'both' : cores ? 'cores' : 'memory';
      return make({
        id: 'browser.hardware',
        label: 'Reported hardware',
        category: 'browser',
        status: 'good',
        value: parts.join(', '),
        source: 'browser-api',
        confidence: 'estimated',
        variant,
        params: { cores: cores ?? 0, memory: memory ?? 0 },
        explanation:
          'Coarse, deliberately rounded hardware hints. They help sites tune performance but also add to fingerprinting surface.',
        raw: { hardwareConcurrency: cores, deviceMemory: memory },
      });
    },
  },
];
