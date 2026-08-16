import { CloudOff, History } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

interface OfflineBannerProps {
  /** Epoch ms of the cached payload currently on screen, if any. */
  cachedAt?: number | null;
  /** Set when the visible data came from cache rather than a live run. */
  usingCache?: boolean;
}

/**
 * Explains, in plain language, that the screen is showing stored results.
 * Renders nothing when the device is online and the data is live.
 */
export const OfflineBanner = ({ cachedAt, usingCache }: OfflineBannerProps) => {
  const { t, i18n } = useTranslation();
  const online = useOnlineStatus();

  if (online && !usingCache) return null;

  const timestamp = cachedAt
    ? new Intl.DateTimeFormat(i18n.resolvedLanguage ?? 'en', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(cachedAt))
    : null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-warning"
    >
      {online ? (
        <History className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      ) : (
        <CloudOff className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      )}
      <p className="min-w-0 text-xs sm:text-sm">
        <span className="font-medium">
          {online ? t('offline.cachedTitle') : t('offline.offlineTitle')}
        </span>{' '}
        <span className="text-warning/90">
          {timestamp
            ? t('offline.cachedAt', { timestamp })
            : t('offline.offlineDescription')}
        </span>
      </p>
    </div>
  );
};
