import { AlertTriangle, CheckCircle2, CircleHelp, Info, Loader2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { STATUS_LABEL, type DiagnosticStatus } from '@/lib/diagnostics/types';

/**
 * Status is communicated with an icon and a word as well as colour, so that it
 * never depends on colour perception alone.
 */
const STATUS_STYLES: Record<
  DiagnosticStatus,
  { icon: typeof CheckCircle2; className: string }
> = {
  good: { icon: CheckCircle2, className: 'text-success bg-success/10 border-success/30' },
  attention: { icon: Info, className: 'text-warning bg-warning/10 border-warning/30' },
  warning: {
    icon: AlertTriangle,
    className: 'text-destructive bg-destructive/10 border-destructive/30',
  },
  unknown: {
    icon: CircleHelp,
    className: 'text-muted-foreground bg-muted/50 border-border',
  },
  pending: { icon: Loader2, className: 'text-primary bg-primary/10 border-primary/30' },
  error: { icon: XCircle, className: 'text-destructive bg-destructive/10 border-destructive/30' },
};

interface StatusBadgeProps {
  status: DiagnosticStatus;
  className?: string;
  showLabel?: boolean;
}

export const StatusBadge = ({ status, className, showLabel = true }: StatusBadgeProps) => {
  const { icon: Icon, className: tone } = STATUS_STYLES[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium',
        tone,
        className,
      )}
    >
      <Icon className={cn('h-3.5 w-3.5 shrink-0', status === 'pending' && 'animate-spin')} aria-hidden />
      {showLabel && STATUS_LABEL[status]}
    </span>
  );
};

export const statusTone = (status: DiagnosticStatus) => STATUS_STYLES[status].className;
export const statusIcon = (status: DiagnosticStatus) => STATUS_STYLES[status].icon;
