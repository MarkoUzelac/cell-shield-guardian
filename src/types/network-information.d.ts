/**
 * Ambient typings for browser APIs that are not in the standard DOM lib yet.
 *
 * These exist so app code never needs `(navigator as any)` — with
 * `noImplicitAny` and the `no-unsafe-*` lint rules enabled, an untyped
 * `any` escape hatch is a build error, not a shortcut.
 */

/** Network Information API — https://wicg.github.io/netinfo/ */
interface NetworkInformation extends EventTarget {
  readonly effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
  readonly type?:
    | 'bluetooth'
    | 'cellular'
    | 'ethernet'
    | 'mixed'
    | 'none'
    | 'other'
    | 'unknown'
    | 'wifi'
    | 'wimax';
  readonly downlink?: number;
  readonly downlinkMax?: number;
  readonly rtt?: number;
  readonly saveData?: boolean;
  onchange?: ((this: NetworkInformation, ev: Event) => unknown) | null;
}

interface Navigator {
  /** Chromium-based browsers. */
  readonly connection?: NetworkInformation;
  /** Firefox prefix. */
  readonly mozConnection?: NetworkInformation;
  /** Legacy WebKit prefix. */
  readonly webkitConnection?: NetworkInformation;
}

interface Window {
  /** Safari still exposes the prefixed constructor. */
  readonly webkitAudioContext?: typeof AudioContext;
}
