import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Eye, EyeOff, Copy, Check } from 'lucide-react';
import { IMSIRecord } from '@/types/signal';
import { SignalStrengthMeter } from './SignalStrengthMeter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface IMSITableProps {
  records: IMSIRecord[];
  maxRows?: number;
}

export const IMSITable = ({ records, maxRows = 10 }: IMSITableProps) => {
  const [maskedIMSI, setMaskedIMSI] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const displayedRecords = records.slice(0, maxRows);

  const maskIMSI = (imsi: string) => {
    if (maskedIMSI) {
      return imsi.slice(0, 6) + '•••••••••';
    }
    return imsi;
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getAlertBadge = (alertType?: IMSIRecord['alertType']) => {
    if (!alertType) return null;
    
    const badges = {
      IMSI_CATCHER: { label: 'IMSI Catcher', variant: 'destructive' as const },
      RAPID_HANDOVER: { label: 'Rapid Handover', variant: 'default' as const },
      SILENT_SMS: { label: 'Silent SMS', variant: 'default' as const },
      DOWNGRADE_ATTACK: { label: 'Downgrade', variant: 'destructive' as const },
    };

    const badge = badges[alertType];
    return (
      <Badge variant={badge.variant} className="text-xs">
        {badge.label}
      </Badge>
    );
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Live IMSI/TMSI Records</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMaskedIMSI(!maskedIMSI)}
          className="text-muted-foreground"
        >
          {maskedIMSI ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
          {maskedIMSI ? 'Show IMSI' : 'Hide IMSI'}
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full data-table">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">IMSI</th>
              <th className="text-left p-3">TMSI</th>
              <th className="text-left p-3">Operator</th>
              <th className="text-left p-3">Signal</th>
              <th className="text-left p-3">Cell ID</th>
              <th className="text-left p-3">Time</th>
              <th className="text-left p-3">Alert</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {displayedRecords.map((record, index) => (
                <motion.tr
                  key={record.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    'border-b border-border/50 hover:bg-muted/30 transition-colors',
                    record.isSuspicious && 'bg-destructive/5'
                  )}
                >
                  <td className="p-3">
                    <span
                      className={cn(
                        'status-indicator inline-block',
                        record.isSuspicious ? 'status-danger' : 'status-active'
                      )}
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-foreground">
                        {maskIMSI(record.imsi)}
                      </span>
                      <button
                        onClick={() => copyToClipboard(record.imsi, record.id)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {copiedId === record.id ? (
                          <Check className="w-3.5 h-3.5 text-success" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="p-3 font-mono text-muted-foreground">
                    {record.tmsi || '—'}
                  </td>
                  <td className="p-3">
                    <span className="text-foreground">{record.operator}</span>
                    <span className="text-muted-foreground text-xs ml-1">
                      ({record.mcc}/{record.mnc})
                    </span>
                  </td>
                  <td className="p-3">
                    <SignalStrengthMeter strength={record.signalStrength} size="sm" />
                  </td>
                  <td className="p-3 font-mono text-muted-foreground">
                    {record.cellId}
                  </td>
                  <td className="p-3 text-muted-foreground text-xs">
                    {record.timestamp.toLocaleTimeString()}
                  </td>
                  <td className="p-3">
                    {record.isSuspicious ? (
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-destructive" />
                        {getAlertBadge(record.alertType)}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {records.length > maxRows && (
        <div className="p-3 text-center border-t border-border">
          <span className="text-sm text-muted-foreground">
            Showing {maxRows} of {records.length} records
          </span>
        </div>
      )}
    </div>
  );
};
