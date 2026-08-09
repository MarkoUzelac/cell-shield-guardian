import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Info } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CapabilityBadge } from '@/components/diagnostics/CapabilityBadge';
import { useDiagnostics } from '@/hooks/useDiagnostics';
import {
  CAPABILITY_HELP,
  CAPABILITY_LABEL,
  CAPABILITY_ORDER,
  CATEGORY_META,
  type CapabilitySupport,
  type DiagnosticCategory,
  type DiagnosticResult,
} from '@/lib/diagnostics/types';
import { cn } from '@/lib/utils';

const CATEGORY_ORDER: DiagnosticCategory[] = [
  'security',
  'connection',
  'network',
  'privacy',
  'browser',
];

const CapabilityMatrixPage = () => {
  const { results, phase } = useDiagnostics();
  const [filter, setFilter] = useState<CapabilitySupport | 'ALL'>('ALL');

  const counts = useMemo(() => {
    const base = Object.fromEntries(
      CAPABILITY_ORDER.map((c) => [c, 0]),
    ) as Record<CapabilitySupport, number>;
    results.forEach((r) => {
      base[r.capability] += 1;
    });
    return base;
  }, [results]);

  const visible = useMemo(
    () => (filter === 'ALL' ? results : results.filter((r) => r.capability === filter)),
    [results, filter],
  );

  const grouped = useMemo(() => {
    const map = new Map<DiagnosticCategory, DiagnosticResult[]>();
    visible.forEach((r) => {
      const list = map.get(r.category) ?? [];
      list.push(r);
      map.set(r.category, list);
    });
    return map;
  }, [visible]);

  return (
    <MainLayout>
      <Header
        title="Browser Capability Matrix"
        subtitle="What your browser can and cannot measure"
      />

      <div className="mx-auto w-full max-w-3xl space-y-4 p-3 pb-8 md:p-6">
        <Card>
          <CardContent className="space-y-3 p-4">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Every diagnostic in this app depends on a browser API. This matrix shows, for your
              current browser, whether each one can actually run — and when it cannot, why.
              {phase === 'running' ? ' Detecting capabilities…' : ''}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filter === 'ALL' ? 'default' : 'outline'}
                size="sm"
                className="min-h-11"
                onClick={() => setFilter('ALL')}
              >
                All ({results.length})
              </Button>
              {CAPABILITY_ORDER.map((cap) => (
                <Button
                  key={cap}
                  variant={filter === cap ? 'default' : 'outline'}
                  size="sm"
                  className="min-h-11"
                  onClick={() => setFilter(cap)}
                >
                  {CAPABILITY_LABEL[cap]} ({counts[cap]})
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {filter !== 'ALL' && (
          <Card>
            <CardContent className="flex gap-2 p-4">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <p className="text-sm leading-relaxed text-muted-foreground">
                {CAPABILITY_HELP[filter]}
              </p>
            </CardContent>
          </Card>
        )}

        {CATEGORY_ORDER.map((category) => {
          const rows = grouped.get(category) ?? [];
          if (rows.length === 0) return null;
          return (
            <Card key={category}>
              <CardContent className="p-0">
                <div className="border-b border-border px-3 py-2.5">
                  <h2 className="eyebrow text-xs text-muted-foreground">
                    {CATEGORY_META[category].label}
                  </h2>
                </div>
                <ul>
                  {rows.map((r) => (
                    <li
                      key={r.id}
                      className={cn(
                        'flex flex-wrap items-start justify-between gap-2 border-b border-border/60 px-3 py-3 last:border-b-0',
                      )}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground">{r.label}</p>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          {CAPABILITY_HELP[r.capability]}
                        </p>
                      </div>
                      <CapabilityBadge capability={r.capability} />
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}

        {visible.length === 0 && phase === 'complete' && (
          <Card>
            <CardContent className="p-4 text-sm text-muted-foreground">
              No diagnostics in this state on your browser.
            </CardContent>
          </Card>
        )}

        <p className="text-xs leading-relaxed text-muted-foreground">
          Capability describes whether a measurement is possible, not whether you are safe. See the{' '}
          <Link to="/" className="font-medium text-primary underline underline-offset-2">
            privacy &amp; connection check
          </Link>{' '}
          for actual results.
        </p>
      </div>
    </MainLayout>
  );
};

export default CapabilityMatrixPage;
