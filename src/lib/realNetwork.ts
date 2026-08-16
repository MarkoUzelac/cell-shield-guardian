/**
 * Real visitor network context (ISP/carrier, ASN, country, city) from the
 * key-less `ipwho.is` endpoint. This necessarily reveals the visitor's
 * public IP address to a third party, so every caller MUST gate this
 * behind explicit user consent — see `SpeedTestPanel`/`NetworkIntelligencePage`
 * for the established consent pattern.
 */

export interface RealNetworkInfo {
  ip: string | null;
  isp: string | null;
  asn: string | null;
  country: string | null;
  countryCode: string | null;
  city: string | null;
  region: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface RealNetworkResult {
  data: RealNetworkInfo | null;
  fetchedAt: number;
  error: string | null;
}

const ENDPOINT = 'https://ipwho.is/';
const TIMEOUT_MS = 15000;

/**
 * Fetches the visitor's real network/ISP context. Requires explicit user
 * consent from the caller — this function performs the network call
 * unconditionally, so gate it behind a consent check before invoking it.
 */
export const fetchRealNetworkInfo = async (
  signal?: AbortSignal,
): Promise<RealNetworkResult> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener('abort', () => controller.abort(), { once: true });
  }

  try {
    const response = await fetch(ENDPOINT, { signal: controller.signal });
    if (!response.ok) throw new Error(`ipwho.is returned ${response.status}`);
    const json = (await response.json()) as IpWhoIsResponse;
    if (json.success === false) {
      throw new Error(json.message ?? 'ipwho.is lookup failed');
    }

    const data: RealNetworkInfo = {
      ip: json.ip ?? null,
      isp: json.connection?.isp ?? json.connection?.org ?? null,
      asn: json.connection?.asn != null ? String(json.connection.asn) : null,
      country: json.country ?? null,
      countryCode: json.country_code ?? null,
      city: json.city ?? null,
      region: json.region ?? null,
      latitude: typeof json.latitude === 'number' ? json.latitude : null,
      longitude: typeof json.longitude === 'number' ? json.longitude : null,
    };

    return { data, fetchedAt: Date.now(), error: null };
  } catch (err) {
    const message = err instanceof Error
      ? (err.name === 'AbortError' ? 'timeout' : err.message)
      : 'unknown error';
    return { data: null, fetchedAt: Date.now(), error: message };
  } finally {
    clearTimeout(timeoutId);
  }
};
