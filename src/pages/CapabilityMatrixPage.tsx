import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CapabilityBadge } from '@/components/diagnostics/CapabilityBadge';
import { PermissionPanel } from '@/components/diagnostics/PermissionPanel';
import { useDiagnostics } from '@/hooks/useDiagnostics';
import { useDiagnosticText } from '@/hooks/useDiagnosticText';
import { usePermissionProbes } from '@/hooks/usePermissionProbes';
import { resolveCapability } from '@/lib/diagnostics/permissions';
import {
  CAPABILITY_ORDER,
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

/** One diagnostic in the matrix, with its label resolved through i18n. */
const MatrixRow = ({ result }: { result: DiagnosticResult }) => {
  const { t } = useTranslation();
  const { label } = useDiagnosticText(result);
  return (
    <li
      className={cn(
        'flex flex-wrap items-start justify-between gap-2 border-b border-border/60 px-3 py-3 last:border-b-0',
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {t(`diagnostics.capabilityHelp.${result.capability}`)}
        </p>
      </div>
      <CapabilityBadge capability={result.capability} />
    </li>
  );
};


const CapabilityMatrixPage = () => {
  const { t } = useTranslation();
  const { results, phase, scan } = useDiagnostics();
  const [filter, setFilter] = useState<CapabilitySupport | 'ALL'>('ALL');

  // A permission answer can change what a diagnostic is able to report, so
  // re-run the affected scan as soon as the browser tells us it changed.
  const onPermissionChange = useCallback(() => {
    void scan();
  }, [scan]);

  const {
    states: permissionStates,
    ready: permissionsReady,
    request: requestPermission,
    refresh: refreshPermissions,
  } = usePermissionProbes({ onChange: onPermissionChange });

  /** Declared capability, overridden by whatever the live probes now know. */
  const effective = useMemo(
    () =>
      results.map((r) => ({
        ...r,
        capability: resolveCapability(r.id, r.capability, permissionStates),
      })),
    [results, permissionStates],
  );

  const counts = useMemo(() => {
    const base = Object.fromEntries(
      CAPABILITY_ORDER.map((c) => [c, 0]),
    ) as Record<CapabilitySupport, number>;
    effective.forEach((r) => {
      base[r.capability] += 1;
    });
    return base;
  }, [effective]);

  const visible = useMemo(
    () => (filter === 'ALL' ? effective : effective.filter((r) => r.capability === filter)),
    [effective, filter],
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
        title={t('pages.capabilities.title')}
        subtitle={t('pages.capabilities.subtitle')}
      />

      <div className="mx-auto w-full max-w-3xl space-y-4 p-3 pb-8 md:p-6">
        <Card>
          <CardContent className="space-y-3 p-4">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t('pages.capabilities.intro')}
              {phase === 'running' ? ` ${t('pages.capabilities.detecting')}` : ''}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filter === 'ALL' ? 'default' : 'outline'}
                size="sm"
                className="min-h-11"
                onClick={() => setFilter('ALL')}
              >
                {t('pages.capabilities.filterCount', {
                  label: t('common.all'),
                  count: results.length,
                })}
              </Button>
              {CAPABILITY_ORDER.map((cap) => (
                <Button
                  key={cap}
                  variant={filter === cap ? 'default' : 'outline'}
                  size="sm"
                  className="min-h-11"
                  onClick={() => setFilter(cap)}
                >
                  {t('pages.capabilities.filterCount', {
                    label: t(`diagnostics.capability.${cap}`),
                    count: counts[cap],
                  })}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <PermissionPanel
          states={permissionStates}
          onRequest={requestPermission}
          onRefresh={() => void refreshPermissions()}
          busy={!permissionsReady}
        />



        {filter !== 'ALL' && (
          <Card>
            <CardContent className="flex gap-2 p-4">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t(`diagnostics.capabilityHelp.${filter}`)}
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
                    {t(`diagnostics.category.${category}`)}
                  </h2>
                </div>
                <ul>
                  {rows.map((r) => (
                    <MatrixRow key={r.id} result={r} />
                  ))}

                </ul>
              </CardContent>
            </Card>
          );
        })}

        {visible.length === 0 && phase === 'complete' && (
          <Card>
            <CardContent className="p-4 text-sm text-muted-foreground">
              {t('pages.capabilities.empty')}
            </CardContent>
          </Card>
        )}

        <p className="text-xs leading-relaxed text-muted-foreground">
          {t('pages.capabilities.footerBefore')}{' '}
          <Link to="/" className="font-medium text-primary underline underline-offset-2">
            {t('pages.capabilities.footerLink')}
          </Link>{' '}
          {t('pages.capabilities.footerAfter')}
        </p>
      </div>
    </MainLayout>
  );
};

export default CapabilityMatrixPage;
