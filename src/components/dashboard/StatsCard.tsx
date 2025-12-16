import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'warning' | 'danger' | 'success';
}

const variantStyles = {
  default: 'bg-card border-border',
  primary: 'bg-primary/10 border-primary/30',
  warning: 'bg-warning/10 border-warning/30',
  danger: 'bg-destructive/10 border-destructive/30',
  success: 'bg-success/10 border-success/30',
};

const iconStyles = {
  default: 'text-muted-foreground bg-muted/50',
  primary: 'text-primary bg-primary/20',
  warning: 'text-warning bg-warning/20',
  danger: 'text-destructive bg-destructive/20',
  success: 'text-success bg-success/20',
};

export const StatsCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
}: StatsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        'rounded-xl border p-5 card-hover',
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <div className="space-y-1">
            <h3 className="text-3xl font-bold font-mono text-foreground">{value}</h3>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
            {trend && (
              <p className={cn(
                'text-xs font-medium',
                trend.isPositive ? 'text-success' : 'text-destructive'
              )}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last hour
              </p>
            )}
          </div>
        </div>
        <div className={cn(
          'w-12 h-12 rounded-lg flex items-center justify-center',
          iconStyles[variant]
        )}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
};
