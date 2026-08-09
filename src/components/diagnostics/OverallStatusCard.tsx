import { RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { statusIcon, statusTone } from './StatusBadge';
import type { DiagnosticStatus } from '@/lib/diagnostics/types';
import type { ScanPhase } from '@/hooks/useDiagnostics';

interface OverallStatusCardProps {
  status: DiagnosticStatus;
  phase: ScanPhase;
  progress: number;
  startedAt: number | null;
  durationMs?: number;
  counts: Record<DiagnosticStatus, number>;
  onRescan: () => void;
}

export const OverallStatusCard = ({
  status,
  phase,
  progress,
  startedAt,
  durationMs,
  counts,
  onRescan,
}: OverallStatusCardProps) => {
  const { t } = useTranslation();
  const effective = phase === 'running' ? 'pending' : status;
  const Icon = statusIcon(effective);

  return (
    <Card className={cn('border', statusTone(effective).split(' ').slice(1).join(' '))}>
      <CardContent className="space-y-4 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <span
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border',
              statusTone(effective),
            )}
          >
            <Icon
              className={cn('h-5 w-5', effective === 'pending' && 'animate-spin')}
              aria-hidden
            />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t('diagnostics.overall.label', {
                status: t(`diagnostics.status.${effective}`),
              })}
            </p>
            <h2 className="mt-0.5 text-lg font-semibold leading-tight text-foreground">
              {t(`diagnostics.overall.headline.${effective}`)}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t(`diagnostics.overall.subline.${effective}`)}
            </p>
          </div>
        </div>

        {phase === 'running' && (
          <div>
            <Progress value={progress} aria-label={t('diagnostics.overall.scanProgress')} />
            <p className="mt-1.5 text-xs text-muted-foreground">
              {t('diagnostics.overall.percentComplete', { progress })}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span>
            {t('diagnostics.overall.countGood')}{' '}
            <span className="font-medium text-foreground">{counts.good}</span>
          </span>
          <span>
            {t('diagnostics.overall.countAttention')}{' '}
            <span className="font-medium text-foreground">{counts.attention}</span>
          </span>
          <span>
            {t('diagnostics.overall.countWarning')}{' '}
            <span className="font-medium text-foreground">{counts.warning}</span>
          </span>
          <span>
            {t('diagnostics.overall.countUnknown')}{' '}
            <span className="font-medium text-foreground">{counts.unknown}</span>
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            {startedAt
              ? t('diagnostics.overall.lastScan', {
                  time: new Date(startedAt).toLocaleTimeString(),
                })
              : t('diagnostics.overall.noScanYet')}
            {durationMs !== undefined
              ? t('diagnostics.overall.took', { seconds: (durationMs / 1000).toFixed(1) })
              : ''}
          </p>
          <Button
            onClick={onRescan}
            disabled={phase === 'running'}
            size="sm"
            className="min-h-11 px-4"
          >
            <RefreshCw
              className={cn('mr-2 h-4 w-4', phase === 'running' && 'animate-spin')}
              aria-hidden
            />
            {phase === 'running'
              ? t('diagnostics.overall.scanning')
              : t('diagnostics.overall.scanAgain')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
