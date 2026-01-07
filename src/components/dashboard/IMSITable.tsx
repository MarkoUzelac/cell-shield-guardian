import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Eye, EyeOff, Copy, Check, Volume2, VolumeX } from 'lucide-react';
import { IMSIRecord } from '@/types/signal';
import { SignalStrengthMeter } from './SignalStrengthMeter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAlertSound } from '@/hooks/useAlertSound';

interface IMSITableProps {
  records: IMSIRecord[];
  maxRows?: number;
  onSuspiciousRecord?: (record: IMSIRecord) => void;
}

export const IMSITable = ({ records, maxRows = 10, onSuspiciousRecord }: IMSITableProps) => {
  const [maskedIMSI, setMaskedIMSI] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [lastAlertedId, setLastAlertedId] = useState<string | null>(null);
  const { playSound, isMuted, toggleMute } = useAlertSound();

  const displayedRecords = records.slice(0, maxRows);

  // Play sound when new suspicious record appears
  useEffect(() => {
    const latestRecord = records[0];
    if (latestRecord && latestRecord.isSuspicious && latestRecord.id !== lastAlertedId) {
      setLastAlertedId(latestRecord.id);
      
      // Play different sounds based on alert type
      if (latestRecord.alertType === 'IMSI_CATCHER' || latestRecord.alertType === 'DOWNGRADE_ATTACK') {
        playSound('critical');
      } else {
        playSound('error');
      }
      
      onSuspiciousRecord?.(latestRecord);
    }
  }, [records, lastAlertedId, playSound, onSuspiciousRecord]);

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
      <Badge variant={badge.variant} className="text-xs whitespace-nowrap">
        {badge.label}
      </Badge>
    );
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 md:p-4 border-b border-border">
        <h3 className="font-semibold text-foreground text-sm md:text-base">Live IMSI/TMSI Records</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMute}
            className={cn(
              "text-muted-foreground h-8 px-2",
              !isMuted && "text-primary"
            )}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMaskedIMSI(!maskedIMSI)}
            className="text-muted-foreground h-8"
          >
            {maskedIMSI ? <Eye className="w-4 h-4 mr-1" /> : <EyeOff className="w-4 h-4 mr-1" />}
            <span className="hidden sm:inline">{maskedIMSI ? 'Show' : 'Hide'}</span>
          </Button>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-border/50">
        <AnimatePresence mode="popLayout">
          {displayedRecords.map((record, index) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: index * 0.03 }}
              className={cn(
                'p-3 space-y-2',
                record.isSuspicious && 'bg-destructive/5'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'status-indicator inline-block',
                      record.isSuspicious ? 'status-danger' : 'status-active'
                    )}
                  />
                  <span className="font-mono text-sm text-foreground">
                    {maskIMSI(record.imsi)}
                  </span>
                  <button
                    onClick={() => copyToClipboard(record.imsi, record.id)}
                    className="text-muted-foreground"
                  >
                    {copiedId === record.id ? (
                      <Check className="w-3.5 h-3.5 text-success" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <SignalStrengthMeter strength={record.signalStrength} size="sm" />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-foreground">{record.operator}</span>
                <span className="text-muted-foreground">Cell: {record.cellId}</span>
              </div>
              {record.isSuspicious && (
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
                  {getAlertBadge(record.alertType)}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full data-table">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left p-3 text-xs">Status</th>
              <th className="text-left p-3 text-xs">IMSI</th>
              <th className="text-left p-3 text-xs">TMSI</th>
              <th className="text-left p-3 text-xs">Operator</th>
              <th className="text-left p-3 text-xs">Signal</th>
              <th className="text-left p-3 text-xs">Cell ID</th>
              <th className="text-left p-3 text-xs">Time</th>
              <th className="text-left p-3 text-xs">Alert</th>
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
                      <span className="font-mono text-foreground text-sm">
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
                  <td className="p-3 font-mono text-muted-foreground text-sm">
                    {record.tmsi || '—'}
                  </td>
                  <td className="p-3">
                    <span className="text-foreground text-sm">{record.operator}</span>
                    <span className="text-muted-foreground text-xs ml-1">
                      ({record.mcc}/{record.mnc})
                    </span>
                  </td>
                  <td className="p-3">
                    <SignalStrengthMeter strength={record.signalStrength} size="sm" />
                  </td>
                  <td className="p-3 font-mono text-muted-foreground text-sm">
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
          <span className="text-xs md:text-sm text-muted-foreground">
            Showing {maxRows} of {records.length} records
          </span>
        </div>
      )}
    </div>
  );
};
