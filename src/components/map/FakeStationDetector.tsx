import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CellTower } from '@/types/signal';
import { analyzeTower, getThreatLevel, type ThreatLevel } from '@/lib/anomalyEngine';
import { cn } from '@/lib/utils';
import { AlertTriangle, Radio, MapPin, RefreshCw, Shield, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FakeStationDetectorProps {
  towers: CellTower[];
  onTowerSelect?: (tower: CellTower) => void;
  onRefresh?: () => void;
}

const getThreatBadge = (level: ThreatLevel) => {
  switch (level) {
    case 'CRITICAL': return <Badge className="bg-destructive/20 text-destructive border-destructive/30 text-[10px] animate-pulse">CRITICAL</Badge>;
    case 'HIGH': return <Badge className="bg-warning/20 text-warning border-warning/30 text-[10px]">HIGH</Badge>;
    case 'MEDIUM': return <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px]">MEDIUM</Badge>;
    case 'LOW': return <Badge variant="outline" className="text-[10px]">LOW</Badge>;
    case 'CLEAN': return <Badge className="bg-success/20 text-success border-success/30 text-[10px]">CLEAN</Badge>;
  }
};

export const FakeStationDetector = ({ towers, onTowerSelect, onRefresh }: FakeStationDetectorProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzedTowers = useMemo(() => {
    return towers.map(tower => {
      const analysis = analyzeTower(tower, towers);
      const level = getThreatLevel(analysis.score);
      return { tower, analysis, level };
    }).sort((a, b) => b.analysis.score - a.analysis.score);
  }, [towers]);

  const threats = analyzedTowers.filter(t => t.level === 'CRITICAL' || t.level === 'HIGH');
  const suspicious = analyzedTowers.filter(t => t.level === 'MEDIUM');

  const handleRescan = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      onRefresh?.();
    }, 1500);
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-destructive" />
            Fake Base Station Detector
          </span>
          <Button variant="ghost" size="sm" onClick={handleRescan} disabled={isAnalyzing} className="h-7">
            <RefreshCw className={cn("w-3 h-3 mr-1", isAnalyzing && "animate-spin")} />
            Scan
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className={cn("p-2 rounded-lg border", threats.length > 0 ? "bg-destructive/10 border-destructive/30" : "bg-muted/30 border-border")}>
            <p className={cn("text-lg font-bold font-mono", threats.length > 0 ? "text-destructive" : "text-foreground")}>{threats.length}</p>
            <p className="text-[10px] text-muted-foreground">Threats</p>
          </div>
          <div className={cn("p-2 rounded-lg border", suspicious.length > 0 ? "bg-warning/10 border-warning/30" : "bg-muted/30 border-border")}>
            <p className={cn("text-lg font-bold font-mono", suspicious.length > 0 ? "text-warning" : "text-foreground")}>{suspicious.length}</p>
            <p className="text-[10px] text-muted-foreground">Suspicious</p>
          </div>
          <div className="p-2 rounded-lg bg-success/10 border border-success/30">
            <p className="text-lg font-bold font-mono text-success">{analyzedTowers.length - threats.length - suspicious.length}</p>
            <p className="text-[10px] text-muted-foreground">Clean</p>
          </div>
        </div>

        {/* Threat List */}
        {threats.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-destructive flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Active Threats
            </h4>
            <AnimatePresence>
              {threats.map(({ tower, analysis, level }) => (
                <motion.div
                  key={tower.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-2 rounded-lg bg-destructive/5 border border-destructive/20 cursor-pointer hover:bg-destructive/10 transition-colors"
                  onClick={() => onTowerSelect?.(tower)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium font-mono">{tower.operator} — {tower.cellId}</span>
                    {getThreatBadge(level)}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span>{tower.technology}</span>
                    <span>•</span>
                    <span>{tower.signalStrength} dBm</span>
                    <span>•</span>
                    <span className="text-destructive font-mono">{(analysis.score * 100).toFixed(0)}% risk</span>
                  </div>
                  {analysis.details.length > 0 && (
                    <div className="mt-1 text-[10px] text-destructive">
                      {analysis.details.slice(0, 2).map((f, i) => (
                        <span key={i}>⚠ {f}{i < 1 && analysis.details.length > 1 ? ' • ' : ''}</span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Suspicious */}
        {suspicious.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-warning flex items-center gap-1">
              <Radio className="w-3 h-3" /> Under Investigation
            </h4>
            {suspicious.slice(0, 3).map(({ tower, analysis, level }) => (
              <div
                key={tower.id}
                className="p-2 rounded-lg bg-warning/5 border border-warning/20 cursor-pointer hover:bg-warning/10 transition-colors"
                onClick={() => onTowerSelect?.(tower)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono">{tower.operator} — {tower.cellId}</span>
                  {getThreatBadge(level)}
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {tower.technology} • {tower.signalStrength} dBm • {(analysis.score * 100).toFixed(0)}% risk
                </p>
              </div>
            ))}
          </div>
        )}

        {threats.length === 0 && suspicious.length === 0 && (
          <div className="text-center py-4">
            <Shield className="w-8 h-8 mx-auto text-success mb-2 opacity-50" />
            <p className="text-xs text-muted-foreground">No fake base stations detected in your area</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
