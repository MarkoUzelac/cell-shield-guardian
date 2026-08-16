/**
 * Real, key-less communication mast/tower data from OpenStreetMap's Overpass
 * API. Browsers cannot read radio-layer data (signal strength, cell ID,
 * IMSI, etc.), so this module only ever returns fields that OpenStreetMap
 * contributors have actually mapped. Anything unknown is left `null` /
 * omitted rather than fabricated.
 */

export interface RealTower {
  /** OSM element id, prefixed with its type, e.g. "node/123456". */
  id: string;
  lat: number;
  lng: number;
  /** OSM `name` tag, when present. */
  name: string | null;
  /** OSM `operator` tag, when present. */
  operator: string | null;
  /** Derived from `communication:*` tags. Never guessed. */
  technology: string[] | null;
  /** OSM element type: node or way. */
  osmType: 'node' | 'way';
  /** Raw OSM tags, kept for transparency/debugging. */
  tags: Record<string, string>;
}

export interface RealTowerResult {
  towers: RealTower[];
  source: 'overpass';
  fetchedAt: number;
  /** True when the request failed and `towers` is a stale/empty fallback. */
  error: string | null;
}

import { cachedFetch } from './offline/cachedFetch';
import { CACHE_KEYS } from './offline/store';

const OVERPASS_ENDPOINT = 'https://overpass-api.de/api/interpreter';
const TIMEOUT_MS = 20000;

// In-memory cache keyed by rounded coordinates + radius so repeated renders
// (e.g. React effects re-running) don't hammer the public Overpass server.
const cache = new Map<string, { result: RealTowerResult; expiresAt: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000;

const writeTowerCache = async (key: string, result: RealTowerResult) => {
  const { writeEntry } = await import('./offline/store');
  await writeEntry(CACHE_KEYS.towers(key), result, null);
};

const roundCoord = (n: number) => Math.round(n * 200) / 200; // ~500m grid

const cacheKey = (lat: number, lng: number, radiusMeters: number) =>
  `${roundCoord(lat)},${roundCoord(lng)},${radiusMeters}`;

const buildQuery = (lat: number, lng: number, radiusMeters: number) => `
  [out:json][timeout:20];
  (
    node["man_made"="mast"](around:${radiusMeters},${lat},${lng});
    way["man_made"="mast"](around:${radiusMeters},${lat},${lng});
    node["man_made"="tower"]["tower:type"="communication"](around:${radiusMeters},${lat},${lng});
    way["man_made"="tower"]["tower:type"="communication"](around:${radiusMeters},${lat},${lng});
    node["telecom"](around:${radiusMeters},${lat},${lng});
    way["telecom"](around:${radiusMeters},${lat},${lng});
  );
  out center tags;
`;

const parseTechnology = (tags: Record<string, string>): string[] | null => {
  const found: string[] = [];
  if (tags['communication:gsm'] === 'yes') found.push('2G/GSM');
  if (tags['communication:umts'] === 'yes' || tags['communication:3g'] === 'yes') found.push('3G/UMTS');
  if (tags['communication:lte'] === 'yes' || tags['communication:4g'] === 'yes') found.push('4G/LTE');
  if (tags['communication:5g'] === 'yes' || tags['communication:nr'] === 'yes') found.push('5G');
  if (tags['communication:mobile_phone'] === 'yes' && found.length === 0) found.push('Mobile');
  return found.length > 0 ? found : null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toRealTower = (el: any): RealTower | null => {
  const lat = el.lat ?? el.center?.lat;
  const lng = el.lon ?? el.center?.lon;
  if (typeof lat !== 'number' || typeof lng !== 'number') return null;

  const tags: Record<string, string> = el.tags ?? {};
  return {
    id: `${el.type}/${el.id}`,
    lat,
    lng,
    name: tags.name ?? null,
    operator: tags.operator ?? null,
    technology: parseTechnology(tags),
    osmType: el.type === 'way' ? 'way' : 'node',
    tags,
  };
};

/**
 * Fetches real communication masts/towers around a coordinate from
 * OpenStreetMap's Overpass API. No API key required. Results are cached
 * in-memory for a few minutes per rounded coordinate.
 */
export const fetchRealTowers = async (
  lat: number,
  lng: number,
  radiusMeters = 3000,
  signal?: AbortSignal,
): Promise<RealTowerResult> => {
  const key = cacheKey(lat, lng, radiusMeters);
  const cached = cache.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.result;
  }

  // Offline / failed request: fall back to the last stored result for this
  // area rather than showing an empty map.
  const offlineFallback = async (): Promise<RealTowerResult | null> => {
    const stored = await cachedFetch<RealTowerResult>(
      CACHE_KEYS.towers(key),
      () => Promise.reject(new Error('offline')),
      CACHE_TTL_MS,
    ).catch(() => null);
    return stored ? { ...stored.value, error: 'offline-cache' } : null;
  };

  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    const fallback = await offlineFallback();
    if (fallback) return fallback;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener('abort', () => controller.abort(), { once: true });
  }

  try {
    const response = await fetch(OVERPASS_ENDPOINT, {
      method: 'POST',
      body: `data=${encodeURIComponent(buildQuery(lat, lng, radiusMeters))}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Overpass API returned ${response.status}`);
    }

    const data = await response.json();
    const elements = Array.isArray(data?.elements) ? data.elements : [];
    const towers = elements
      .map(toRealTower)
      .filter((t: RealTower | null): t is RealTower => t !== null);

    const result: RealTowerResult = {
      towers,
      source: 'overpass',
      fetchedAt: Date.now(),
      error: null,
    };
    cache.set(key, { result, expiresAt: Date.now() + CACHE_TTL_MS });
    // Mirror into IndexedDB so the area is still viewable after a reload
    // without a connection.
    void writeTowerCache(key, result);
    return result;
  } catch (err) {
    const message = err instanceof Error
      ? (err.name === 'AbortError' ? 'timeout' : err.message)
      : 'unknown error';
    const fallback = await offlineFallback();
    if (fallback) return fallback;
    return {
      towers: [],
      source: 'overpass',
      fetchedAt: Date.now(),
      error: message,
    };
  } finally {
    clearTimeout(timeoutId);
  }
};
