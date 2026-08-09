import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, AlertCircle, Check, X } from 'lucide-react';
import { Alert } from '@/types/signal';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AlertsListProps {
  alerts: Alert[];
  onAcknowledge?: (id: string) => void;
  onDismiss?: (id: string) => void;
  compact?: boolean;
}

const alertIcons = {
  critical: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const alertStyles = {
  critical: {
    bg: 'bg-destructive/10',
    border: 'border-destructive/30',
    icon: 'text-destructive',
    glow: 'glow-danger',
  },
  warning: {
    bg: 'bg-warning/10',
    border: 'border-warning/30',
    icon: 'text-warning',
    glow: 'glow-warning',
  },
  info: {
    bg: 'bg-primary/10',
    border: 'border-primary/30',
    icon: 'text-primary',
    glow: '',
  },
};

export const AlertsList = ({
  alerts,
  onAcknowledge,
  onDismiss,
  compact = false,
}: AlertsListProps) => {
  const { t } = useTranslation();
  const sortedAlerts = [...alerts].sort((a, b) => {
    // Sort by acknowledged (unacknowledged first), then by type priority, then by time
    if (a.acknowledged !== b.acknowledged) return a.acknowledged ? 1 : -1;
    const priority = { critical: 0, warning: 1, info: 2 };
    if (priority[a.type] !== priority[b.type]) return priority[a.type] - priority[b.type];
    return b.timestamp.getTime() - a.timestamp.getTime();
  });

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {sortedAlerts.map((alert) => {
          const Icon = alertIcons[alert.type];
          const styles = alertStyles[alert.type];

          return (
            <motion.div
              key={alert.id}
              layout
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                'rounded-lg border p-4 transition-all',
                styles.bg,
                styles.border,
                !alert.acknowledged && alert.type === 'critical' && styles.glow,
                alert.acknowledged && 'opacity-60'
              )}
            >
              <div className="flex gap-3">
                <div className={cn('mt-0.5', styles.icon)}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-foreground">{alert.title}</h4>
                    {!compact && (
                      <div className="flex items-center gap-1 shrink-0">
                        {!alert.acknowledged && onAcknowledge && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-11 w-11 focus:ring-2 focus:ring-primary"
                            onClick={() => onAcknowledge(alert.id)}
                            aria-label={t('components.dashboard.alertsList.acknowledgeAria', { title: alert.title })}
                          >
                            <Check className="w-5 h-5" />
                          </Button>
                        )}
                        {onDismiss && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-11 w-11 focus:ring-2 focus:ring-primary"
                            onClick={() => onDismiss(alert.id)}
                            aria-label={t('components.dashboard.alertsList.dismissAria', { title: alert.title })}
                          >
                            <X className="w-5 h-5" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                  {!compact && (
                    <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span>{alert.timestamp.toLocaleTimeString()}</span>
                    <span>•</span>
                    <span>{alert.source}</span>
                    {alert.acknowledged && (
                      <>
                        <span>•</span>
                        <span className="text-success">{t('components.dashboard.alertsList.acknowledged')}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {alerts.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>{t('components.dashboard.alertsList.empty')}</p>
        </div>
      )}
    </div>
  );
};
