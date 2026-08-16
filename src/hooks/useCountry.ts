import { useState, useEffect } from 'react';
import { getOperatorsByIso, DEFAULT_COUNTRY, type CountryOperators } from '@/lib/worldOperators';

interface CountryState {
  country: CountryOperators;
  iso: string | null;
  countryName: string | null;
  loading: boolean;
  resolved: boolean;
}

// Simple in-memory cache so we don't re-query for the same coordinates.
const cache = new Map<string, { iso: string; name: string }>();

/**
 * Resolves the user's country (and therefore the correct local mobile
 * operators) from their real GPS coordinates using free, key-less
 * reverse geocoding. Falls back gracefully to the default country.
 */
export const useCountry = (latitude: number | null, longitude: number | null) => {
  const [state, setState] = useState<CountryState>({
    country: DEFAULT_COUNTRY,
    iso: null,
    countryName: null,
    loading: false,
    resolved: false,
  });

  useEffect(() => {
    if (latitude == null || longitude == null) return;

    const key = `${latitude.toFixed(2)},${longitude.toFixed(2)}`;
    const cached = cache.get(key);
    if (cached) {
      setState({
        country: getOperatorsByIso(cached.iso),
        iso: cached.iso,
        countryName: cached.name,
        loading: false,
        resolved: true,
      });
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    const resolve = async () => {
      setState(prev => ({ ...prev, loading: true }));
      try {
        const res = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error('reverse geocode failed');
        const data = (await res.json()) as { countryCode?: string; countryName?: string };
        const iso = data.countryCode;
        const name = data.countryName;
        if (cancelled) return;

        if (iso) {
          cache.set(key, { iso, name: name ?? iso });
          setState({
            country: getOperatorsByIso(iso),
            iso,
            countryName: name ?? iso,
            loading: false,
            resolved: true,
          });
        } else {
          setState(prev => ({ ...prev, loading: false, resolved: true }));
        }
      } catch {
        if (!cancelled) {
          setState(prev => ({ ...prev, loading: false, resolved: true }));
        }
      }
    };

    void resolve();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [latitude, longitude]);

  return state;
};
