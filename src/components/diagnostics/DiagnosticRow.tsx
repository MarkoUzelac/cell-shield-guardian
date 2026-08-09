import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StatusBadge } from './StatusBadge';
import {
  CONFIDENCE_HELP,
  CONFIDENCE_LABEL,
  type DiagnosticResult,
} from '@/lib/diagnostics/types';

interface DiagnosticRowProps {
  result: DiagnosticResult;
  showTechnical: boolean;
}

export const DiagnosticRow = ({ result, showTechnical }: DiagnosticRowProps) => {
  const [open, setOpen] = useState(false);
  const panelId = `diag-${result.id.replace(/\./g, '-')}`;

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
          <span className="block text-sm font-medium text-foreground">{result.label}</span>
          <span className="mt-0.5 block font-mono text-xs text-muted-foreground">
            {result.value}
            {result.unit ? ` ${result.unit}` : ''}
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
          <p className="text-sm leading-relaxed text-muted-foreground">{result.explanation}</p>

          {result.recommendation && (
            <p className="rounded-md border border-primary/25 bg-primary/5 p-2.5 text-sm text-foreground">
              <span className="font-medium">What you can do: </span>
              {result.recommendation}
            </p>
          )}

          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">
              {CONFIDENCE_LABEL[result.confidence]}
            </span>{' '}
            — {CONFIDENCE_HELP[result.confidence]}
          </p>

          {showTechnical && (
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 rounded-md bg-muted/40 p-2.5 font-mono text-[11px]">
              <dt className="text-muted-foreground">id</dt>
              <dd className="truncate text-foreground">{result.id}</dd>
              <dt className="text-muted-foreground">source</dt>
              <dd className="text-foreground">{result.source}</dd>
              <dt className="text-muted-foreground">capability</dt>
              <dd className="text-foreground">{result.capability}</dd>
              <dt className="text-muted-foreground">measured</dt>
              <dd className="text-foreground">
                {new Date(result.timestamp).toLocaleTimeString()}
                {result.durationMs !== undefined
                  ? ` (${result.durationMs.toFixed(0)} ms)`
                  : ''}
              </dd>
              {result.raw && (
                <>
                  <dt className="text-muted-foreground">raw</dt>
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
