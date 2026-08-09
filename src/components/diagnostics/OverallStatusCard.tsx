import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { statusIcon, statusTone } from './StatusBadge';
import { STATUS_LABEL, type DiagnosticStatus } from '@/lib/diagnostics/types';
import type { ScanPhase } from '@/hooks/useDiagnostics';

const HEADLINE: Record<DiagnosticStatus, string> = {
  good: 'No issues found by the available checks',
  attention: 'A few things are worth reviewing',
  warning: 'Something needs your attention',
  unknown: 'Not enough information yet',
  pending: 'Checking your browser and connection',
  error: 'Some checks could not complete',
};

const SUBLINE: Record<DiagnosticStatus, string> = {
  good: 'This covers what a web page can observe. It is not a guarantee that your device or network is secure.',
  attention: 'Nothing here is dangerous by itself, but the items below are worth a look.',
  warning: 'One or more checks found a real problem. Open the item below for details.',
  unknown: 'Your browser withheld the information these checks need. Unknown does not mean safe.',
  pending: 'Results appear as each check finishes.',
  error: 'Individual checks failed. Everything else on this page is still valid.',
};

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
              Overall: {STATUS_LABEL[effective]}
            </p>
            <h2 className="mt-0.5 text-lg font-semibold leading-tight text-foreground">
              {HEADLINE[effective]}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{SUBLINE[effective]}</p>
          </div>
        </div>

        {phase === 'running' && (
          <div>
            <Progress value={progress} aria-label="Scan progress" />
            <p className="mt-1.5 text-xs text-muted-foreground">{progress}% complete</p>
          </div>
        )}

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span>
            Good: <span className="font-medium text-foreground">{counts.good}</span>
          </span>
          <span>
            Attention: <span className="font-medium text-foreground">{counts.attention}</span>
          </span>
          <span>
            Warning: <span className="font-medium text-foreground">{counts.warning}</span>
          </span>
          <span>
            Not available: <span className="font-medium text-foreground">{counts.unknown}</span>
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            {startedAt
              ? `Last scan ${new Date(startedAt).toLocaleTimeString()}`
              : 'No scan yet'}
            {durationMs !== undefined ? ` · took ${(durationMs / 1000).toFixed(1)}s` : ''}
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
            {phase === 'running' ? 'Scanning…' : 'Scan again'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
