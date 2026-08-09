import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface SignalStrengthMeterProps {
  strength: number; // -50 to -110 dBm
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const SignalStrengthMeter = ({ 
  strength, 
  showValue = true,
  size = 'md' 
}: SignalStrengthMeterProps) => {
  const { t } = useTranslation();
  // Normalize strength to 0-100%
  const normalized = Math.max(0, Math.min(100, ((strength + 110) / 60) * 100));
  
  // Determine color based on strength
  const getColor = () => {
    if (strength > -65) return 'bg-success';
    if (strength > -85) return 'bg-warning';
    return 'bg-destructive';
  };

  const barHeights = {
    sm: [8, 12, 16, 20],
    md: [12, 18, 24, 30],
    lg: [16, 24, 32, 40],
  };

  const heights = barHeights[size];
  const activeBars = Math.ceil((normalized / 100) * 4);

  return (
    <div className="flex items-end gap-1">
      {heights.map((height, index) => (
        <motion.div
          key={index}
          initial={{ height: 0 }}
          animate={{ height: height }}
          transition={{ delay: index * 0.1 }}
          className={cn(
            'w-1.5 rounded-sm signal-bar',
            index < activeBars ? getColor() : 'bg-muted'
          )}
          style={{ height }}
        />
      ))}
      {showValue && (
        <span className="ml-2 font-mono text-xs text-muted-foreground">
          {t('components.dashboard.signalStrengthMeter.dbm', { strength })}
        </span>
      )}
    </div>
  );
};
