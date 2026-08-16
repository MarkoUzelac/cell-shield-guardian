/**
 * The single place a service worker may be registered.
 *
 * Offline support must never activate inside the Lovable editor preview or in
 * development, where a cached app shell would serve stale HTML and deleted
 * chunks. In any refused context we also unregister a previously installed
 * worker so a stuck preview repairs itself on the next load.
 */
const SW_URL = '/sw.js';

const isRefusedContext = (): boolean => {
  if (!import.meta.env.PROD) return true;
  if (typeof window === 'undefined') return true;
  if (window.self !== window.top) return true;

  const { hostname, search } = window.location;
  if (new URLSearchParams(search).has('sw') && new URLSearchParams(search).get('sw') === 'off') {
    return true;
  }
  if (hostname.startsWith('id-preview--') || hostname.startsWith('preview--')) return true;
  if (hostname === 'lovableproject.com' || hostname.endsWith('.lovableproject.com')) return true;
  if (hostname === 'lovableproject-dev.com' || hostname.endsWith('.lovableproject-dev.com')) {
    return true;
  }
  if (hostname === 'beta.lovable.dev' || hostname.endsWith('.beta.lovable.dev')) return true;

  return false;
};

const unregisterAppWorker = async () => {
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.allSettled(
    registrations
      .filter((registration) => registration.active?.scriptURL.endsWith(SW_URL))
      .map((registration) => registration.unregister()),
  );
};

export const registerServiceWorker = async (): Promise<void> => {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;

  if (isRefusedContext()) {
    await unregisterAppWorker().catch(() => undefined);
    return;
  }

  try {
    await navigator.serviceWorker.register(SW_URL, { scope: '/' });
  } catch {
    // Offline support is an enhancement; never block the app on it.
  }
};
