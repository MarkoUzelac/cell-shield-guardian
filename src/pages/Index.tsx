import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Info, SlidersHorizontal } from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { OverallStatusCard } from '@/components/diagnostics/OverallStatusCard';
import { CategoryCard } from '@/components/diagnostics/CategoryCard';
import { useDiagnostics } from '@/hooks/useDiagnostics';
import { groupByCategory } from '@/lib/diagnostics/engine';
import { downloadReport } from '@/lib/diagnostics/report';
import { type DiagnosticCategory } from '@/lib/diagnostics/types';

const ORDER: DiagnosticCategory[] = ['security', 'connection', 'network', 'privacy', 'browser'];

const Index = () => {
  const { t } = useTranslation();
  const [showTechnical, setShowTechnical] = useState(false);
  const { results, summary, phase, progress, startedAt, durationMs, scan } = useDiagnostics();

  const grouped = useMemo(() => groupByCategory(results), [results]);

  return (
    <MainLayout>
      <Header
        title={t('pages.index.title')}
        subtitle={t('pages.index.subtitle')}
      />

      <div className="mx-auto w-full max-w-3xl space-y-4 p-3 pb-8 md:p-6">
        <OverallStatusCard
          status={summary.overall}
          phase={phase}
          progress={progress}
          startedAt={startedAt}
          durationMs={durationMs}
          counts={summary.counts}
          onRescan={() => void scan()}
        />

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" aria-hidden />
            <Label htmlFor="technical-details" className="cursor-pointer text-sm">
              {t('pages.index.technicalDetails')}
            </Label>
            <Switch
              id="technical-details"
              checked={showTechnical}
              onCheckedChange={setShowTechnical}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="min-h-11"
            disabled={results.length === 0}
            onClick={() =>
              downloadReport(results, {
                startedAt,
                durationMs,
                overall: summary.overall,
              })
            }
          >
            <Download className="mr-2 h-4 w-4" aria-hidden />
            {t('pages.index.exportReport')}
          </Button>
        </div>

        {ORDER.map((category) => (
          <CategoryCard
            key={category}
            category={category}
            results={grouped.get(category) ?? []}
            showTechnical={showTechnical}
          />
        ))}

        <Card>
          <CardContent className="space-y-2 p-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Info className="h-4 w-4 text-primary" aria-hidden />
              {t('pages.index.cannotTellTitle')}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              <Trans
                i18nKey="pages.index.cannotTellBody"
                components={{ strong: <span className="font-medium text-foreground" /> }}
              />
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t('pages.index.capabilityPointerBefore')}{' '}
              <Link
                to="/capabilities"
                className="font-medium text-primary underline underline-offset-2"
              >
                {t('pages.index.capabilityPointerLink')}
              </Link>{' '}
              {t('pages.index.capabilityPointerAfter')}
            </p>

          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Index;
