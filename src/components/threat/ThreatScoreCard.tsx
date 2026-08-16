import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Activity, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type { ThreatLevel, ThreatScore } from '@/lib/threat/threatScore';
import type { HandoverSummary } from '@/lib/threat/handovers';

/** Static class maps — never build Tailwind class names dynamically. */
const LEVEL_TEXT: Record<ThreatLevel, string> = {
  low: 'text-success',
  moderate: 'text-primary',
  elevated: 'text-warning',
  high: 'text-destructive',
};

const LEVEL_BORDER: Record<ThreatLevel, string> = {
  low: 'border-success/30',
  moderate: 'border-primary/30',
  elevated: 'border-warning/40',
  high: 'border-destructive/40',
};

interface ThreatScoreCardProps {
  threat: ThreatScore;
  handovers: HandoverSummary;
  /** Compact mode drops the handover breakdown (used inside the analyzer). */
  compact?: boolean;
  className?: string;
}

export const ThreatScoreCard = ({
  threat,
  handovers,
  compact = false,
  className,
}: ThreatScoreCardProps) => {
  const { t } = useTranslation();

  const factors = useMemo(() => threat.topFactors.slice(0, compact ? 3 : 5), [threat, compact]);
  const Icon = threat.level === 'low' ? ShieldCheck : ShieldAlert;

  return (
    <Card className={cn('bg-card border-border', LEVEL_BORDER[threat.level], className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Icon className={cn('w-5 h-5 shrink-0', LEVEL_TEXT[threat.level])} aria-hidden="true" />
          {t('threat.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          role="status"
          aria-live="polite"
          className="flex items-end justify-between gap-3 flex-wrap"
        >
          <div>
            <p className={cn('text-4xl font-bold font-mono leading-none', LEVEL_TEXT[threat.level])}>
              {threat.score}
              <span className="text-base text-muted-foreground font-normal"> / 100</span>
            </p>
            <p className={cn('mt-1 text-sm font-medium', LEVEL_TEXT[threat.level])}>
              {t(`threat.levels.${threat.level}`)}
            </p>
          </div>
          <p className="text-xs text-muted-foreground max-w-[22rem]">
            {t(`threat.levelHint.${threat.level}`)}
          </p>
        </div>

        <Progress value={threat.score} aria-label={t('threat.title')} />

        {!compact && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { key: 'transitions', value: handovers.total },
              { key: 'downgrades', value: handovers.downgrades },
              { key: 'flaps', value: handovers.flaps },
              { key: 'rate', value: Math.round(handovers.rate * 10) / 10 },
            ].map((item) => (
              <div key={item.key} className="rounded-lg border border-border bg-muted/20 p-3">
                <p className="text-xl font-mono font-bold text-foreground">{item.value}</p>
                <p className="text-[11px] leading-tight text-muted-foreground">
                  {t(`threat.handovers.${item.key}`)}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">{t('threat.contributors')}</h4>
          {factors.length > 0 ? (
            <ul className="space-y-2">
              {factors.map((factor) => (
                <li key={factor.id} className="flex items-start justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">
                    {t(`threat.factors.${factor.id}`, factor.params)}
                  </span>
                  <span className="font-mono text-foreground shrink-0">
                    +{factor.points.toFixed(1)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">{t('threat.noContributors')}</p>
          )}
        </div>

        <p className="text-xs text-muted-foreground flex items-start gap-2">
          <Activity className="w-3.5 h-3.5 mt-0.5 shrink-0" aria-hidden="true" />
          {t('threat.method', { minutes: Math.round(handovers.windowMs / 60000) })}
        </p>
      </CardContent>
    </Card>
  );
};
