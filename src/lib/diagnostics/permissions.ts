/**
 * Live permission probing.
 *
 * The capability matrix can only guess at a `PERMISSION_REQUIRED` capability
 * until the user actually asks the browser for access. This module models each
 * permission-gated capability as a probe that can be
 *
 *  - *queried*  — read the current state without prompting (Permissions API), and
 *  - *requested* — trigger the real browser prompt from a user gesture.
 *
 * Nothing is persisted and no sensor data is retained: geolocation coordinates
 * are discarded immediately and media tracks are stopped as soon as they open.
 */

import type { CapabilitySupport } from './types';

export type PermissionProbeId =
  | 'geolocation'
  | 'notifications'
  | 'camera'
  | 'microphone'
  | 'clipboard-read'
  | 'persistent-storage';

/**
 * `unsupported` — the browser has no such API at all.
 * `prompt`      — access is possible but not yet asked for.
 * `granted` / `denied` — the user has decided.
 * `requesting`  — a prompt is currently open.
 * `error`       — the request threw for a reason other than a denial.
 */
export type PermissionProbeState =
  | 'unsupported'
  | 'prompt'
  | 'granted'
  | 'denied'
  | 'requesting'
  | 'error';

export interface PermissionProbe {
  id: PermissionProbeId;
  /** Permissions API name, when the state can be read without prompting. */
  permissionName?: PermissionName;
  /** Diagnostics whose capability depends on this permission. */
  affects: string[];
  /** True when the underlying API exists in this browser. */
  isSupported: () => boolean;
  /**
   * Triggers the real browser prompt. Must be called from a user gesture.
   * Resolves with the resulting state; never throws.
   */
  request: () => Promise<PermissionProbeState>;
}

function stopTracks(stream: MediaStream) {
  stream.getTracks().forEach((track) => track.stop());
}

async function requestMedia(
  constraints: MediaStreamConstraints,
): Promise<PermissionProbeState> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    // We only wanted the permission answer — release the hardware immediately.
    stopTracks(stream);
    return 'granted';
  } catch (error) {
    const name = error instanceof DOMException ? error.name : '';
    if (name === 'NotAllowedError' || name === 'SecurityError') return 'denied';
    if (name === 'NotFoundError' || name === 'OverconstrainedError') return 'unsupported';
    return 'error';
  }
}

export const PERMISSION_PROBES: PermissionProbe[] = [
  {
    id: 'geolocation',
    permissionName: 'geolocation' as PermissionName,
    affects: ['privacy.permissions'],
    isSupported: () => typeof navigator !== 'undefined' && 'geolocation' in navigator,
    request: () =>
      new Promise<PermissionProbeState>((resolve) => {
        let settled = false;
        const finish = (state: PermissionProbeState) => {
          if (settled) return;
          settled = true;
          resolve(state);
        };
        try {
          navigator.geolocation.getCurrentPosition(
            // Coordinates are deliberately never read, stored or transmitted.
            () => finish('granted'),
            (error) => finish(error.code === error.PERMISSION_DENIED ? 'denied' : 'error'),
            { timeout: 10_000, maximumAge: Infinity },
          );
        } catch {
          finish('error');
        }
      }),
  },
  {
    id: 'notifications',
    permissionName: 'notifications' as PermissionName,
    affects: ['privacy.permissions'],
    isSupported: () => typeof window !== 'undefined' && 'Notification' in window,
    request: async () => {
      try {
        const result = await Notification.requestPermission();
        if (result === 'granted') return 'granted';
        if (result === 'denied') return 'denied';
        return 'prompt';
      } catch {
        return 'error';
      }
    },
  },
  {
    id: 'camera',
    permissionName: 'camera' as PermissionName,
    affects: ['privacy.permissions'],
    isSupported: () =>
      typeof navigator !== 'undefined' && Boolean(navigator.mediaDevices?.getUserMedia),
    request: () => requestMedia({ video: true }),
  },
  {
    id: 'microphone',
    permissionName: 'microphone' as PermissionName,
    affects: ['privacy.permissions'],
    isSupported: () =>
      typeof navigator !== 'undefined' && Boolean(navigator.mediaDevices?.getUserMedia),
    request: () => requestMedia({ audio: true }),
  },
  {
    id: 'clipboard-read',
    permissionName: 'clipboard-read' as PermissionName,
    affects: ['privacy.permissions'],
    isSupported: () =>
      typeof navigator !== 'undefined' && Boolean(navigator.clipboard?.readText),
    request: async () => {
      try {
        // The returned text is intentionally discarded.
        await navigator.clipboard.readText();
        return 'granted';
      } catch (error) {
        const name = error instanceof DOMException ? error.name : '';
        if (name === 'NotAllowedError') return 'denied';
        return 'error';
      }
    },
  },
  {
    id: 'persistent-storage',
    permissionName: 'persistent-storage' as PermissionName,
    affects: ['privacy.storage'],
    isSupported: () =>
      typeof navigator !== 'undefined' && Boolean(navigator.storage?.persist),
    request: async () => {
      try {
        const persisted = await navigator.storage.persist();
        return persisted ? 'granted' : 'denied';
      } catch {
        return 'error';
      }
    },
  },
];

export type PermissionStates = Record<PermissionProbeId, PermissionProbeState>;

/** Reads current states without prompting. Falls back to `prompt` when unknown. */
export async function queryPermissionState(
  probe: PermissionProbe,
): Promise<PermissionProbeState> {
  if (!probe.isSupported()) return 'unsupported';

  if (probe.id === 'persistent-storage' && navigator.storage?.persisted) {
    try {
      if (await navigator.storage.persisted()) return 'granted';
    } catch {
      /* fall through to the Permissions API */
    }
  }

  if (probe.permissionName && navigator.permissions?.query) {
    try {
      const status = await navigator.permissions.query({ name: probe.permissionName });
      return status.state as PermissionProbeState;
    } catch {
      /* name not queryable in this browser */
    }
  }

  if (probe.id === 'notifications' && 'Notification' in window) {
    const current = Notification.permission;
    if (current === 'granted') return 'granted';
    if (current === 'denied') return 'denied';
  }

  return 'prompt';
}

/**
 * Subscribes to live `change` events for a probe. Returns a cleanup function.
 * Browsers that cannot observe the permission simply never call back.
 */
export async function observePermission(
  probe: PermissionProbe,
  onChange: (state: PermissionProbeState) => void,
): Promise<() => void> {
  if (!probe.permissionName || !navigator.permissions?.query) return () => undefined;
  try {
    const status = await navigator.permissions.query({ name: probe.permissionName });
    const handler = () => onChange(status.state as PermissionProbeState);
    status.addEventListener('change', handler);
    return () => status.removeEventListener('change', handler);
  } catch {
    return () => undefined;
  }
}

const CAPABILITY_BY_STATE: Record<PermissionProbeState, CapabilitySupport> = {
  granted: 'SUPPORTED',
  prompt: 'PERMISSION_REQUIRED',
  requesting: 'PERMISSION_REQUIRED',
  denied: 'UNSUPPORTED',
  unsupported: 'UNSUPPORTED',
  error: 'PARTIALLY_SUPPORTED',
};

export function capabilityForState(state: PermissionProbeState): CapabilitySupport {
  return CAPABILITY_BY_STATE[state];
}

/**
 * Resolves the effective capability of a diagnostic once live permission
 * states are known. Diagnostics with no permission dependency are unchanged.
 */
export function resolveCapability(
  diagnosticId: string,
  declared: CapabilitySupport,
  states: Partial<PermissionStates>,
): CapabilitySupport {
  const related = PERMISSION_PROBES.filter((p) => p.affects.includes(diagnosticId));
  if (related.length === 0) return declared;

  const observed = related
    .map((p) => states[p.id])
    .filter((s): s is PermissionProbeState => Boolean(s));
  if (observed.length === 0) return declared;

  const has = (state: PermissionProbeState) => observed.includes(state);

  if (has('prompt') || has('requesting')) return 'PERMISSION_REQUIRED';
  if (has('granted')) {
    return observed.every((s) => s === 'granted') ? 'SUPPORTED' : 'PARTIALLY_SUPPORTED';
  }
  if (has('error')) return 'PARTIALLY_SUPPORTED';
  return 'UNSUPPORTED';
}
