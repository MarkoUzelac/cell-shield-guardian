import { CheckCircle2, CircleSlash, HelpCircle, KeyRound, MinusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CAPABILITY_LABEL, type CapabilitySupport } from '@/lib/diagnostics/types';

const STYLES: Record<CapabilitySupport, string> = {
  SUPPORTED: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
  PARTIALLY_SUPPORTED: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
  PERMISSION_REQUIRED: 'border-primary/40 bg-primary/10 text-primary',
  UNSUPPORTED: 'border-destructive/40 bg-destructive/10 text-destructive',
  NOT_APPLICABLE: 'border-border bg-muted/40 text-muted-foreground',
};

const ICONS: Record<CapabilitySupport, typeof CheckCircle2> = {
  SUPPORTED: CheckCircle2,
  PARTIALLY_SUPPORTED: HelpCircle,
  PERMISSION_REQUIRED: KeyRound,
  UNSUPPORTED: CircleSlash,
  NOT_APPLICABLE: MinusCircle,
};

interface CapabilityBadgeProps {
  capability: CapabilitySupport;
  className?: string;
  showLabel?: boolean;
}

export const CapabilityBadge = ({
  capability,
  className,
  showLabel = true,
}: CapabilityBadgeProps) => {
  const Icon = ICONS[capability];
  const label = CAPABILITY_LABEL[capability];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium',
        STYLES[capability],
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
      {showLabel ? <span>{label}</span> : <span className="sr-only">{label}</span>}
    </span>
  );
};
