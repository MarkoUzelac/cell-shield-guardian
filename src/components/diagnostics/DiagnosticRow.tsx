import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { StatusBadge } from './StatusBadge';
import { useDiagnosticText } from '@/hooks/useDiagnosticText';
import type { DiagnosticResult } from '@/lib/diagnostics/types';

interface DiagnosticRowProps {
  result: DiagnosticResult;
  showTechnical: boolean;
}

export const DiagnosticRow = ({ result, showTechnical }: DiagnosticRowProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const panelId = `diag-${result.id.replace(/\./g, '-')}`;

  // Copy is authored in the engine and interpolated per locale, so numbers,
  // counts and names sit inside the translated sentence rather than being
  // concatenated onto it.
  const { label, value, explanation, recommendation } = useDiagnosticText(result);


  return (
    <li className="border-b border-border/60 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full min-h-11 items-start justify-between gap-3 px-3 py-3 text-left transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium text-foreground">{label}</span>
          <span className="mt-0.5 block font-mono text-xs text-muted-foreground">
            {value}
          </span>

        </span>
        <span className="flex shrink-0 items-center gap-2">
          <StatusBadge status={result.status} showLabel={false} />
          <ChevronDown
            className={cn(
              'h-4 w-4 text-muted-foreground transition-transform',
              open && 'rotate-180',
            )}
            aria-hidden
          />
        </span>
      </button>

      {open && (
        <div id={panelId} className="space-y-3 px-3 pb-4 pt-0">
          <p className="text-sm leading-relaxed text-muted-foreground">{explanation}</p>

          {recommendation && (
            <p className="rounded-md border border-primary/25 bg-primary/5 p-2.5 text-sm text-foreground">
              <span className="font-medium">{t('diagnostics.row.whatYouCanDo')} </span>
              {recommendation}
            </p>
          )}

          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">
              {t(`diagnostics.confidence.${result.confidence}`)}
            </span>{' '}
            — {t(`diagnostics.confidenceHelp.${result.confidence}`)}
          </p>

          {showTechnical && (
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 rounded-md bg-muted/40 p-2.5 font-mono text-[11px]">
              <dt className="text-muted-foreground">{t('diagnostics.row.id')}</dt>
              <dd className="truncate text-foreground">{result.id}</dd>
              <dt className="text-muted-foreground">{t('diagnostics.row.source')}</dt>
              <dd className="text-foreground">{result.source}</dd>
              <dt className="text-muted-foreground">{t('diagnostics.row.capability')}</dt>
              <dd className="text-foreground">{result.capability}</dd>
              <dt className="text-muted-foreground">{t('diagnostics.row.measured')}</dt>
              <dd className="text-foreground">
                {new Date(result.timestamp).toLocaleTimeString()}
                {result.durationMs !== undefined
                  ? ` (${result.durationMs.toFixed(0)} ms)`
                  : ''}
              </dd>
              {result.raw && (
                <>
                  <dt className="text-muted-foreground">{t('diagnostics.row.raw')}</dt>
                  <dd className="overflow-x-auto whitespace-pre-wrap break-all text-foreground">
                    {JSON.stringify(result.raw)}
                  </dd>
                </>
              )}
            </dl>
          )}
        </div>
      )}
    </li>
  );
};
