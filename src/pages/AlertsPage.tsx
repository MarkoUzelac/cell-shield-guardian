import { useMemo, useState } from 'react';
import { Download, Filter, RefreshCw, Search, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { AlertsList } from '@/components/dashboard/AlertsList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert } from '@/types/signal';
import { useDiagnostics } from '@/hooks/useDiagnostics';
import type { DiagnosticResult, DiagnosticStatus } from '@/lib/diagnostics/types';
import { toast } from 'sonner';

/**
 * Every alert on this page is derived from a real diagnostic measurement
 * taken in this browser (see `useDiagnostics` / `src/lib/diagnostics`).
 * Nothing here is randomly generated.
 */
const statusToAlertType = (status: DiagnosticStatus): Alert['type'] | null => {
  if (status === 'warning' || status === 'error') return 'critical';
  if (status === 'attention') return 'warning';
  return null;
};

const toAlert = (result: DiagnosticResult): Alert => ({
  id: result.id,
  type: statusToAlertType(result.status) ?? 'info',
  title: result.label,
  message: [
    result.explanation,
    `Diagnostic: ${result.id} — measured value: ${result.value}${result.unit ? ` ${result.unit}` : ''}.`,
    result.recommendation ? `Recommendation: ${result.recommendation}` : null,
  ]
    .filter(Boolean)
    .join(' '),
  timestamp: new Date(result.timestamp),
  acknowledged: false,
  source: `Diagnostics · ${result.category}`,
});

const AlertsPage = () => {
  const { t } = useTranslation();
  const { results, phase, scan } = useDiagnostics(true);
  const [acknowledged, setAcknowledged] = useState<Set<string>>(new Set());
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const alerts: Alert[] = useMemo(
    () =>
      results
        .filter((r) => statusToAlertType(r.status) !== null)
        .filter((r) => !dismissed.has(r.id))
        .map((r) => ({ ...toAlert(r), acknowledged: acknowledged.has(r.id) }))
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
    [results, acknowledged, dismissed],
  );

  const handleAcknowledge = (id: string) => {
    setAcknowledged((prev) => new Set(prev).add(id));
  };

  const handleDismiss = (id: string) => {
    setDismissed((prev) => new Set(prev).add(id));
  };

  const handleExport = () => {
    const data = JSON.stringify(alerts, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alerts-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(t('pages.alerts.toast.exportSuccess'));
  };

  const handleClearAcknowledged = () => {
    setDismissed((prev) => {
      const next = new Set(prev);
      acknowledged.forEach((id) => next.add(id));
      return next;
    });
    toast.success(t('pages.alerts.toast.clearedAcknowledged'));
  };

  const filteredAlerts = alerts
    .filter((a) => filter === 'all' || a.type === filter)
    .filter(
      (a) =>
        searchQuery === '' ||
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.message.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  const stats = {
    total: alerts.length,
    critical: alerts.filter((a) => a.type === 'critical').length,
    warning: alerts.filter((a) => a.type === 'warning').length,
    info: alerts.filter((a) => a.type === 'info').length,
    unacknowledged: alerts.filter((a) => !a.acknowledged).length,
  };

  return (
    <MainLayout>
      <Header
        title={t('pages.alerts.header.title')}
        subtitle={t('pages.alerts.header.subtitle')}
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold font-mono text-foreground">{stats.total}</p>
              <p className="text-xs text-muted-foreground">{t('pages.alerts.stats.total')}</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold font-mono text-destructive">{stats.critical}</p>
              <p className="text-xs text-muted-foreground">{t('pages.alerts.stats.critical')}</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold font-mono text-warning">{stats.warning}</p>
              <p className="text-xs text-muted-foreground">{t('pages.alerts.stats.warnings')}</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold font-mono text-primary">{stats.info}</p>
              <p className="text-xs text-muted-foreground">{t('pages.alerts.stats.info')}</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold font-mono text-foreground">{stats.unacknowledged}</p>
              <p className="text-xs text-muted-foreground">{t('pages.alerts.stats.unread')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex flex-col md:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder={t('pages.alerts.filters.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={filter}
                  onValueChange={(v) => setFilter(v as typeof filter)}
                >
                  <SelectTrigger className="w-40">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('pages.alerts.filters.types.all')}</SelectItem>
                    <SelectItem value="critical">{t('pages.alerts.filters.types.critical')}</SelectItem>
                    <SelectItem value="warning">{t('pages.alerts.filters.types.warning')}</SelectItem>
                    <SelectItem value="info">{t('pages.alerts.filters.types.info')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => void scan()} disabled={phase === 'running'}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${phase === 'running' ? 'animate-spin' : ''}`} />
                  {t('pages.alerts.actions.rescan')}
                </Button>
                <Button variant="outline" size="sm" onClick={handleClearAcknowledged}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t('pages.alerts.actions.clearRead')}
                </Button>
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="w-4 h-4 mr-2" />
                  {t('pages.alerts.actions.export')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alerts List */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">
              {t('pages.alerts.history.title', { count: filteredAlerts.length })}
            </CardTitle>
            <p className="text-xs text-muted-foreground">{t('pages.alerts.source.label')}</p>
          </CardHeader>
          <CardContent>
            {phase === 'running' && alerts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                {t('pages.alerts.scanning')}
              </p>
            ) : filteredAlerts.length > 0 ? (
              <AlertsList
                alerts={filteredAlerts}
                onAcknowledge={handleAcknowledge}
                onDismiss={handleDismiss}
              />
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                {t('pages.alerts.empty')}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AlertsPage;
