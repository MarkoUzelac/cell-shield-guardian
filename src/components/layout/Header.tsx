import { useEffect, useState } from 'react';
import { AlertTriangle, Clock, Wifi, WifiOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

/**
 * The header only shows state it can actually verify: the clock and the
 * browser's own online/offline flag. No fabricated "Protected" claim.
 */
export const Header = ({ title, subtitle }: HeaderProps) => {
  const { t } = useTranslation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [online, setOnline] = useState(navigator.onLine);
  const isMobile = useIsMobile();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="flex items-center justify-between gap-3 px-3 py-3 sm:px-6 sm:py-4">
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-bold text-foreground sm:text-2xl">{title}</h1>
          {subtitle && (
            <p className="mt-0.5 truncate text-xs text-muted-foreground sm:text-sm">{subtitle}</p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {!isMobile && (
            <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-1.5">
              <Clock className="h-4 w-4 text-muted-foreground" aria-hidden />
              <span className="font-mono text-sm text-foreground">
                {currentTime.toLocaleTimeString()}
              </span>
            </div>
          )}

          <div
            className={cn(
              'flex items-center gap-1.5 rounded-lg border px-2 py-1.5 sm:px-3',
              online
                ? 'border-success/30 bg-success/10 text-success'
                : 'border-warning/30 bg-warning/10 text-warning',
            )}
          >
            {online ? (
              <Wifi className="h-4 w-4" aria-hidden />
            ) : (
              <WifiOff className="h-4 w-4" aria-hidden />
            )}
            <span className="text-xs font-medium sm:text-sm">
              {online ? t('common.online') : t('common.offline')}
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-warning/30 bg-warning/10 px-3 py-1.5 sm:px-6 sm:py-2">
        <p className="flex items-center gap-1.5 text-[10px] text-warning sm:gap-2 sm:text-xs">
          <AlertTriangle className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" aria-hidden />
          <span>{t('header.disclaimer')}</span>
        </p>
      </div>
    </header>
  );
};
