import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Activity, PauseCircle, RefreshCw } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLiveStream } from '@/hooks/useLiveStream';
import { LIVE_INTERVALS, type LiveInterval } from '@/lib/live/liveBus';
import { cn } from '@/lib/utils';

const formatSince = (from: number, now: number) => Math.max(0, Math.round((now - from) / 1000));

type Props = {
  /** Optional id suffix so several controls can coexist on one page. */
  idPrefix?: string;
  className?: string;
};

/**
 * Controls the local live stream: real measurements re-taken on an interval and
 * pushed to every subscribed view. No server, no invented data.
 */
export const LiveStreamControl = ({ idPrefix = 'live', className }: Props) => {
  const { t } = useTranslation();
  const { enabled, paused, intervalMs, lastTick, setEnabled, setIntervalMs, refreshNow } =
    useLiveStream();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [enabled]);

  const switchId = `${idPrefix}-stream-toggle`;

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2.5',
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <span
          className={cn(
            'relative flex h-2.5 w-2.5 shrink-0 rounded-full',
            enabled && !paused ? 'bg-primary' : 'bg-muted-foreground/40',
          )}
          aria-hidden
        >
          {enabled && !paused ? (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
          ) : null}
        </span>
        <Label htmlFor={switchId} className="cursor-pointer text-sm">
          {t('live.title')}
        </Label>
        <Switch
          id={switchId}
          checked={enabled}
          onCheckedChange={setEnabled}
          aria-describedby={`${idPrefix}-stream-status`}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={String(intervalMs)}
          onValueChange={(value) => setIntervalMs(Number(value) as LiveInterval)}
        >
          <SelectTrigger className="h-11 w-[8.5rem]" aria-label={t('live.intervalLabel')}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LIVE_INTERVALS.map((ms) => (
              <SelectItem key={ms} value={String(ms)}>
                {t('live.interval', { seconds: ms / 1000 })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm" className="min-h-11" onClick={refreshNow}>
          <RefreshCw className="mr-2 h-4 w-4" aria-hidden />
          {t('live.refreshNow')}
        </Button>
      </div>

      <p
        id={`${idPrefix}-stream-status`}
        role="status"
        aria-live="polite"
        className="flex w-full items-center gap-1.5 text-xs text-muted-foreground"
      >
        {enabled && paused ? (
          <>
            <PauseCircle className="h-3.5 w-3.5" aria-hidden />
            {t('live.pausedHidden')}
          </>
        ) : enabled ? (
          <>
            <Activity className="h-3.5 w-3.5 text-primary" aria-hidden />
            {lastTick === null
              ? t('live.streaming')
              : t('live.lastUpdate', { seconds: formatSince(lastTick, now) })}
          </>
        ) : (
          t('live.offDescription')
        )}
      </p>
    </div>
  );
};
