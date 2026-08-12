/**
 * Region-aware language detection.
 *
 * We deliberately resolve the visitor's country WITHOUT any network call:
 * the IANA time zone reported by the browser is enough to know which country
 * someone is in, and it never leaves the device. That keeps the app's
 * privacy promise intact while still adapting the UI language by country.
 */
import type { CustomDetector } from 'i18next-browser-languagedetector';

/** Time zones that map to a Croatian-speaking region. */
const HR_TIME_ZONES = new Set(['Europe/Zagreb']);

/** ISO country codes whose visitors should get Croatian by default. */
const HR_COUNTRIES = new Set(['HR', 'BA', 'ME', 'RS']);

const resolveTimeZone = (): string | undefined => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return undefined;
  }
};

/**
 * Reads the region subtag out of the browser locale list, e.g. `hr-HR` -> `HR`.
 */
const resolveNavigatorCountry = (): string | undefined => {
  if (typeof navigator === 'undefined') return undefined;
  const tags = navigator.languages ?? [navigator.language];
  for (const tag of tags) {
    if (typeof tag !== 'string') continue;
    const parts = tag.split('-');
    if (parts.length > 1) {
      const region = parts[parts.length - 1].toUpperCase();
      if (region.length === 2) return region;
    }
  }
  return undefined;
};

/** Best-effort country code for the current visitor, resolved fully offline. */
export const detectCountry = (): string | undefined => {
  const timeZone = resolveTimeZone();
  if (timeZone !== undefined && HR_TIME_ZONES.has(timeZone)) return 'HR';
  return resolveNavigatorCountry();
};

/**
 * i18next detector that returns a language based on the visitor's country
 * rather than only their browser UI language — a Croatian resident running an
 * English-language phone still gets Croatian copy offered by default.
 */
export const countryDetector: CustomDetector = {
  name: 'country',
  lookup: () => {
    const country = detectCountry();
    if (country !== undefined && HR_COUNTRIES.has(country)) return 'hr';
    return undefined;
  },
};
