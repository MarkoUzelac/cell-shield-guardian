import { useCallback, useEffect, useRef, useState } from 'react';
import {
  PERMISSION_PROBES,
  observePermission,
  queryPermissionState,
  type PermissionProbeId,
  type PermissionProbeState,
  type PermissionStates,
} from '@/lib/diagnostics/permissions';

const initialStates = () =>
  Object.fromEntries(
    PERMISSION_PROBES.map((p) => [p.id, 'prompt' as PermissionProbeState]),
  ) as PermissionStates;

export interface UsePermissionProbesOptions {
  /** Called whenever a permission state actually changes, for live re-scans. */
  onChange?: () => void;
}

/**
 * Tracks the live state of every permission-gated capability.
 *
 * States are read on mount without prompting, kept up to date through
 * Permissions API `change` events, and updated immediately when the user
 * requests access from a click.
 */
export function usePermissionProbes({ onChange }: UsePermissionProbesOptions = {}) {
  const [states, setStates] = useState<PermissionStates>(initialStates);
  const [ready, setReady] = useState(false);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const apply = useCallback((id: PermissionProbeId, state: PermissionProbeState) => {
    setStates((prev) => {
      if (prev[id] === state) return prev;
      if (state !== 'requesting') onChangeRef.current?.();
      return { ...prev, [id]: state };
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    const cleanups: Array<() => void> = [];

    void Promise.all(
      PERMISSION_PROBES.map(async (probe) => {
        const state = await queryPermissionState(probe);
        if (cancelled) return;
        setStates((prev) => ({ ...prev, [probe.id]: state }));

        const stop = await observePermission(probe, (next) => {
          if (!cancelled) apply(probe.id, next);
        });
        if (cancelled) stop();
        else cleanups.push(stop);
      }),
    ).finally(() => {
      if (!cancelled) setReady(true);
    });

    return () => {
      cancelled = true;
      cleanups.forEach((stop) => stop());
    };
  }, [apply]);

  /** Triggers the real browser prompt for one capability. */
  const request = useCallback(
    async (id: PermissionProbeId) => {
      const probe = PERMISSION_PROBES.find((p) => p.id === id);
      if (!probe) return;
      if (!probe.isSupported()) {
        apply(id, 'unsupported');
        return;
      }
      setStates((prev) => ({ ...prev, [id]: 'requesting' }));
      const result = await probe.request();
      // Prefer the authoritative Permissions API answer where it exists.
      const confirmed = await queryPermissionState(probe);
      apply(id, confirmed === 'prompt' ? result : confirmed);
    },
    [apply],
  );

  /** Re-reads every state without prompting. */
  const refresh = useCallback(async () => {
    const entries = await Promise.all(
      PERMISSION_PROBES.map(async (p) => [p.id, await queryPermissionState(p)] as const),
    );
    entries.forEach(([id, state]) => apply(id, state));
  }, [apply]);

  return { states, ready, request, refresh };
}
