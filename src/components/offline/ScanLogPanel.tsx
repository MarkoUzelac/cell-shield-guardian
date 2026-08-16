import { useCallback, useEffect, useState } from 'react';
import { Download, HardDrive, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  clearHistory,
  historyToNdjson,
  readHistory,
  MAX_HISTORY,
  type ScanRecord,
} from '@/lib/offline/scanHistory';
import { clearAll, estimateUsage } from '@/lib/offline/store';

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

interface ScanLogPanelProps {
  /** Bumped by the parent after a scan so the log refreshes. */
  refreshKey?: number | string | null;
}

/**
 * Device-local log of past diagnostic runs. Readable and exportable with no
 * connection; nothing here is ever sent anywhere.
 */
export const ScanLogPanel = ({ refreshKey }: ScanLogPanelProps) => {
  const { t, i18n } = useTranslation();
  const [history, setHistory] = useState<ScanRecord[]>([]);
  const [usage, setUsage] = useState<{ usage: number; quota: number } | null>(null);

  const load = useCallback(async () => {
    setHistory(await readHistory());
    setUsage(await estimateUsage());
  }, []);

  useEffect(() => {
    void load();
  }, [load, refreshKey]);

  const handleExport = () => {
    const blob = new Blob([historyToNdjson(history)], { type: 'application/x-ndjson' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `scan-log-${new Date().toISOString().split('T')[0]}.ndjson`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = async () => {
    await clearHistory();
    await clearAll();
    await load();
    toast.success(t('offline.log.cleared'));
  };

  const formatTime = (ms: number) =>
    new Intl.DateTimeFormat(i18n.resolvedLanguage ?? 'en', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(ms));

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <HardDrive className="h-4 w-4 text-primary" aria-hidden="true" />
          {t('offline.log.title')}
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          {t('offline.log.description', { count: MAX_HISTORY })}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {history.length > 0 ? (
          <ul className="space-y-1.5">
            {history.slice(0, 8).map((record) => (
              <li
                key={record.startedAt}
                className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2 text-xs"
              >
                <span className="font-mono text-foreground">{formatTime(record.startedAt)}</span>
                <span className="text-muted-foreground">
                  {t('offline.log.entry', { count: record.results.length })}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-muted-foreground">{t('offline.log.empty')}</p>
        )}

        {usage && (
          <p className="text-[11px] text-muted-foreground">
            {t('offline.log.storage', {
              used: formatBytes(usage.usage),
              quota: formatBytes(usage.quota),
            })}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="min-h-11"
            onClick={handleExport}
            disabled={history.length === 0}
          >
            <Download className="mr-2 h-4 w-4" aria-hidden="true" />
            {t('offline.log.export')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="min-h-11"
            onClick={() => void handleClear()}
            disabled={history.length === 0}
          >
            <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
            {t('offline.log.clear')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
