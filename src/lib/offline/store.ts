/**
 * Tiny IndexedDB key/value store used as the app's offline cache.
 *
 * Everything written here stays on the device — the app has no backend and
 * never uploads measurements. IndexedDB is used instead of localStorage so
 * large payloads (tower sets, scan history) don't block the main thread and
 * survive a browser storage-pressure sweep better.
 */

const DB_NAME = 'cell-shield-offline';
const DB_VERSION = 1;
const STORE = 'kv';

export interface CacheEnvelope<T> {
  value: T;
  /** Epoch ms the payload was written. */
  cachedAt: number;
  /** Epoch ms after which the payload should be refreshed when online. */
  expiresAt: number | null;
}

let dbPromise: Promise<IDBDatabase | null> | null = null;

const openDb = (): Promise<IDBDatabase | null> => {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve) => {
    if (typeof indexedDB === 'undefined') {
      resolve(null);
      return;
    }
    let request: IDBOpenDBRequest;
    try {
      request = indexedDB.open(DB_NAME, DB_VERSION);
    } catch {
      resolve(null);
      return;
    }
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    request.onsuccess = () => resolve(request.result);
    // Private mode / blocked storage: degrade to "no cache" instead of throwing.
    request.onerror = () => resolve(null);
    request.onblocked = () => resolve(null);
  });

  return dbPromise;
};

const withStore = async <T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest,
): Promise<T | null> => {
  const db = await openDb();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE, mode);
      const request = run(tx.objectStore(STORE));
      request.onsuccess = () => resolve(request.result as T);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
};

/** Reads an entry, returning `null` when missing or unreadable. */
export const readEntry = async <T>(key: string): Promise<CacheEnvelope<T> | null> => {
  const entry = await withStore<CacheEnvelope<T>>('readonly', (store) => store.get(key));
  return entry ?? null;
};

/**
 * IndexedDB rejects values that structured clone can't handle (DOM objects,
 * functions, class instances) — diagnostics keep raw API objects around, so
 * everything is normalised to plain JSON before it is stored.
 */
const toStorable = <T>(value: T): T => {
  try {
    return JSON.parse(JSON.stringify(value)) as T;
  } catch {
    return value;
  }
};

/** Writes an entry. `ttlMs` of `null` means "keep until explicitly replaced". */
export const writeEntry = async <T>(
  key: string,
  value: T,
  ttlMs: number | null = null,
): Promise<CacheEnvelope<T>> => {
  const envelope: CacheEnvelope<T> = {
    value: toStorable(value),
    cachedAt: Date.now(),
    expiresAt: ttlMs === null ? null : Date.now() + ttlMs,
  };
  await withStore('readwrite', (store) => store.put(envelope, key));
  return envelope;
};

export const deleteEntry = async (key: string): Promise<void> => {
  await withStore('readwrite', (store) => store.delete(key));
};

/** Clears every cached payload — wired to the "clear offline data" control. */
export const clearAll = async (): Promise<void> => {
  await withStore('readwrite', (store) => store.clear());
};

export const isExpired = (entry: CacheEnvelope<unknown>): boolean =>
  entry.expiresAt !== null && entry.expiresAt <= Date.now();

/** Rough size of everything cached, for the storage readout in Settings. */
export const estimateUsage = async (): Promise<{ usage: number; quota: number } | null> => {
  if (typeof navigator === 'undefined' || !navigator.storage?.estimate) return null;
  try {
    const { usage = 0, quota = 0 } = await navigator.storage.estimate();
    return { usage, quota };
  } catch {
    return null;
  }
};

export const CACHE_KEYS = {
  lastScan: 'scan:last',
  scanHistory: 'scan:history',
  alertState: 'alerts:state',
  towers: (key: string) => `towers:${key}`,
  network: 'network:last',
} as const;
