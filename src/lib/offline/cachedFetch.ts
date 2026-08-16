import { CacheEnvelope, isExpired, readEntry, writeEntry } from './store';

export interface CachedResult<T> {
  value: T;
  /** Where the returned value came from. */
  origin: 'network' | 'cache';
  /** Epoch ms the value was produced. */
  cachedAt: number;
  /** True when a cached value was served because the network attempt failed. */
  stale: boolean;
  error: string | null;
}

const isOffline = () => typeof navigator !== 'undefined' && !navigator.onLine;

/**
 * Stale-while-offline wrapper: returns fresh cache when it is still valid,
 * otherwise hits the network and falls back to whatever is cached (however
 * old) when the request fails or the device is offline.
 */
export const cachedFetch = async <T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs: number,
): Promise<CachedResult<T>> => {
  const entry = (await readEntry<T>(key));

  if (entry && !isExpired(entry)) {
    return { value: entry.value, origin: 'cache', cachedAt: entry.cachedAt, stale: false, error: null };
  }

  if (isOffline() && entry) {
    return { value: entry.value, origin: 'cache', cachedAt: entry.cachedAt, stale: true, error: 'offline' };
  }

  try {
    const value = await fetcher();
    const written = await writeEntry(key, value, ttlMs);
    return { value, origin: 'network', cachedAt: written.cachedAt, stale: false, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'request failed';
    if (entry) {
      return { value: entry.value, origin: 'cache', cachedAt: entry.cachedAt, stale: true, error: message };
    }
    throw err;
  }
};
