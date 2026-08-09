import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  generateTacticalTowers,
  computeTacticalStats,
  THREAT_BG_CLASSES,
  THREAT_COLORS,
  type TacticalTower,
  type TacticalStats,
  type ThreatLevel,
} from '@/lib/anomalyEngine';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useCountry } from '@/hooks/useCountry';
import {
  Shield,
  AlertTriangle,
  Activity,
  Radio,
  Target,
  Zap,
  Download,
  RefreshCw,
  Eye,
  ChevronRight,
  Crosshair,
  Signal,
  Lock,
  Unlock,
  Radar,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const TacticalDashboard = () => {
  const { t } = useTranslation();
  const [towers, setTowers] = useState<TacticalTower[]>([]);
  const [selectedThreatLevel, setSelectedThreatLevel] = useState<string>('all');
  const [selectedTower, setSelectedTower] = useState<TacticalTower | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const { latitude, longitude } = useGeolocation();
  const { country } = useCountry(latitude, longitude);

  const lat = latitude || 45.815;
  const lng = longitude || 15.9819;

  useEffect(() => {
    setTowers(generateTacticalTowers(lat, lng, 60, undefined, country));
  }, [lat, lng, country]);

  const stats = useMemo(() => computeTacticalStats(towers), [towers]);

  const filteredTowers = useMemo(() => {
    if (selectedThreatLevel === 'all') return towers;
    return towers.filter(t => t.anomalyReport.threatLevel === selectedThreatLevel);
  }, [towers, selectedThreatLevel]);

  const sortedByScore = useMemo(
    () => [...filteredTowers].sort((a, b) => b.anomalyReport.score - a.anomalyReport.score),
    [filteredTowers]
  );

  const handleRefresh = () => {
    setTowers(generateTacticalTowers(lat, lng, 60, undefined, country));
    setSelectedTower(null);
  };

  const handleExport = () => {
    const data = towers.map(t => ({
      id: t.id,
      operator: t.operator,
      technology: t.technology,
      cellId: t.cellId,
      mcc: t.mcc,
      mnc: t.mnc,
      lat: t.lat,
      lng: t.lng,
      signalStrength: t.signalStrength,
      encryption: t.encryption,
      suspicionScore: t.anomalyReport.score,
      threatLevel: t.anomalyReport.threatLevel,
      details: t.anomalyReport.details.join('; '),
    }));
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).map(v => `"${v}"`).join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tactical-report-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Chart data
  const threatDistribution = [
    { name: 'Critical', value: stats.critical, color: THREAT_COLORS.CRITICAL },
    { name: 'High', value: stats.high, color: THREAT_COLORS.HIGH },
    { name: 'Medium', value: stats.medium, color: THREAT_COLORS.MEDIUM },
    { name: 'Low', value: stats.low, color: THREAT_COLORS.LOW },
    { name: 'Clean', value: stats.clean, color: THREAT_COLORS.CLEAN },
  ].filter(d => d.value > 0);

  const techData = stats.techBreakdown.map(t => ({
    name: t.tech,
    total: t.count,
    suspicious: t.suspiciousCount,
  }));

  return (
    <MainLayout>
      <Header
        title={t('pages.tactical.header.title')}
        subtitle={t('pages.tactical.header.subtitle')}
      />

      <div className="p-3 md:p-6 space-y-4">
        {/* ─── Threat Level Overview ────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <ThreatStatCard
            label={t('pages.tactical.stats.totalTowers')}
            value={stats.total}
            icon={<Radio className="w-4 h-4" />}
            variant="default"
          />
          <ThreatStatCard
            label={t('pages.tactical.stats.critical')}
            value={stats.critical}
            icon={<Zap className="w-4 h-4" />}
            variant="critical"
            pulse={stats.critical > 0}
          />
          <ThreatStatCard
            label={t('pages.tactical.stats.highRisk')}
            value={stats.high}
            icon={<AlertTriangle className="w-4 h-4" />}
            variant="high"
          />
          <ThreatStatCard
            label={t('pages.tactical.stats.medium')}
            value={stats.medium}
            icon={<Target className="w-4 h-4" />}
            variant="medium"
          />
          <ThreatStatCard
            label={t('pages.tactical.stats.low')}
            value={stats.low}
            icon={<Shield className="w-4 h-4" />}
            variant="low"
          />
          <ThreatStatCard
            label={t('pages.tactical.stats.clean')}
            value={stats.clean}
            icon={<Activity className="w-4 h-4" />}
            variant="clean"
          />
        </div>

        {/* ─── Avg Score Bar ───────────────────────────────────── */}
        <Card className="bg-card/50 border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Radar className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{t('pages.tactical.threatIndex.title')}</span>
              </div>
              <span className="text-sm font-mono font-bold">{(stats.avgScore * 100).toFixed(1)}%</span>
            </div>
            <Progress
              value={stats.avgScore * 100}
              className="h-2"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-muted-foreground">{t('pages.tactical.threatIndex.cleanLabel')}</span>
              <span className="text-xs text-muted-foreground">{t('pages.tactical.threatIndex.criticalLabel')}</span>
            </div>
          </CardContent>
        </Card>

        {/* ─── Controls ────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-3">
          <Select value={selectedThreatLevel} onValueChange={setSelectedThreatLevel}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder={t('pages.tactical.controls.filterPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('pages.tactical.controls.allLevels')}</SelectItem>
              <SelectItem value="CRITICAL">{t('pages.tactical.controls.critical')}</SelectItem>
              <SelectItem value="HIGH">{t('pages.tactical.controls.high')}</SelectItem>
              <SelectItem value="MEDIUM">{t('pages.tactical.controls.medium')}</SelectItem>
              <SelectItem value="LOW">{t('pages.tactical.controls.low')}</SelectItem>
              <SelectItem value="CLEAN">{t('pages.tactical.controls.clean')}</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            {t('pages.tactical.controls.rescan')}
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            {t('pages.tactical.controls.exportCsv')}
          </Button>
          <div className="ml-auto flex items-center gap-2">
            <span className={cn("w-2 h-2 rounded-full", isScanning ? "bg-success status-active" : "bg-muted")} />
            <span className="text-xs text-muted-foreground">
              {isScanning ? t('pages.tactical.controls.liveMonitoring') : t('pages.tactical.controls.paused')}
            </span>
          </div>
        </div>

        {/* ─── Main Content ────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Anomaly List */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Crosshair className="w-4 h-4 text-primary" />
                  {t('pages.tactical.anomalyFeed.title', { count: sortedByScore.length })}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  <div className="divide-y divide-border">
                    <AnimatePresence>
                      {sortedByScore.map((tower, i) => (
                        <AnomalyRow
                          key={tower.id}
                          tower={tower}
                          index={i}
                          isSelected={selectedTower?.id === tower.id}
                          onClick={() => setSelectedTower(tower)}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Detail Panel + Charts */}
          <div className="space-y-4">
            {/* Selected Tower Detail */}
            {selectedTower ? (
              <TowerDetailCard tower={selectedTower} />
            ) : (
              <Card className="bg-card border-border">
                <CardContent className="p-8 text-center">
                  <Eye className="w-8 h-8 mx-auto mb-2 text-muted-foreground opacity-50" />
                  <p className="text-sm text-muted-foreground">{t('pages.tactical.detail.selectPrompt')}</p>
                </CardContent>
              </Card>
            )}

            {/* Threat Distribution Pie */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{t('pages.tactical.charts.threatDistribution')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={threatDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={80}
                      dataKey="value"
                      stroke="none"
                    >
                      {threatDistribution.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-3 mt-2">
                  {threatDistribution.map(d => (
                    <div key={d.name} className="flex items-center gap-1.5 text-xs">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                      {t('pages.tactical.charts.legendItem', { name: d.name, value: d.value })}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Technology Breakdown */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{t('pages.tactical.charts.technologyAnalysis')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={techData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                    <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        background: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))',
                      }}
                    />
                    <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name={t('pages.tactical.charts.total')} />
                    <Bar dataKey="suspicious" fill="hsl(0 72% 51%)" radius={[4, 4, 0, 0]} name={t('pages.tactical.charts.suspicious')} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function ThreatStatCard({
  label,
  value,
  icon,
  variant,
  pulse,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  variant: 'default' | 'critical' | 'high' | 'medium' | 'low' | 'clean';
  pulse?: boolean;
}) {
  const styles: Record<string, string> = {
    default: 'bg-card border-border',
    critical: 'bg-destructive/10 border-destructive/30',
    high: 'bg-orange-500/10 border-orange-500/30',
    medium: 'bg-yellow-500/10 border-yellow-500/30',
    low: 'bg-teal-500/10 border-teal-500/30',
    clean: 'bg-success/10 border-success/30',
  };

  const textStyles: Record<string, string> = {
    default: 'text-foreground',
    critical: 'text-destructive',
    high: 'text-orange-400',
    medium: 'text-yellow-400',
    low: 'text-teal-400',
    clean: 'text-success',
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className={cn('border', styles[variant])}>
        <CardContent className="p-3 text-center">
          <div className={cn("mx-auto mb-1", textStyles[variant])}>{icon}</div>
          <p className={cn("text-2xl font-bold font-mono", textStyles[variant], pulse && "animate-pulse")}>
            {value}
          </p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function AnomalyRow({
  tower,
  index,
  isSelected,
  onClick,
}: {
  tower: TacticalTower;
  index: number;
  isSelected: boolean;
  onClick: () => void;
}) {
  const { anomalyReport } = tower;
  const level = anomalyReport.threatLevel;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.02 }}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 p-3 cursor-pointer transition-colors hover:bg-muted/50",
        isSelected && "bg-muted/30"
      )}
    >
      {/* Threat indicator */}
      <div className={cn(
        "w-3 h-3 rounded-full shrink-0",
        level === 'CRITICAL' && "bg-destructive animate-pulse",
        level === 'HIGH' && "bg-orange-500",
        level === 'MEDIUM' && "bg-yellow-500",
        level === 'LOW' && "bg-teal-500",
        level === 'CLEAN' && "bg-success",
      )} />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium truncate">{tower.operator}</span>
          <Badge variant="outline" className="text-[10px] h-4 shrink-0">
            {tower.technology}
          </Badge>
          {!tower.encryption && (
            <Unlock className="w-3 h-3 text-destructive shrink-0" />
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">
          Cell: {tower.cellId} · {tower.signalStrength} dBm
          {anomalyReport.details[0] && ` · ${anomalyReport.details[0]}`}
        </p>
      </div>

      {/* Score */}
      <div className="text-right shrink-0">
        <p className={cn(
          "text-sm font-mono font-bold",
          level === 'CRITICAL' && "text-destructive",
          level === 'HIGH' && "text-orange-400",
          level === 'MEDIUM' && "text-yellow-400",
          level === 'LOW' && "text-teal-400",
          level === 'CLEAN' && "text-success",
        )}>
          {(anomalyReport.score * 100).toFixed(0)}%
        </p>
        <Badge className={cn("text-[10px] h-4", THREAT_BG_CLASSES[level])} variant="outline">
          {level}
        </Badge>
      </div>

      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
    </motion.div>
  );
}

function TowerDetailCard({ tower }: { tower: TacticalTower }) {
  const { anomalyReport } = tower;
  const level = anomalyReport.threatLevel;

  const factors = [
    { label: 'MCC/MNC Anomaly', value: anomalyReport.factors.mccMncAnomaly, weight: '20%' },
    { label: 'Encryption Missing', value: anomalyReport.factors.encryptionMissing, weight: '20%' },
    { label: 'Power Spike', value: anomalyReport.factors.powerSpike, weight: '15%' },
    { label: 'Downgrade Attack', value: anomalyReport.factors.downgradeAttack, weight: '15%' },
    { label: 'Geo Mismatch', value: anomalyReport.factors.geoMismatch, weight: '15%' },
    { label: 'Rapid Switch', value: anomalyReport.factors.rapidSwitch, weight: '15%' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <Card className={cn('border', THREAT_BG_CLASSES[level])}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            {level === 'CRITICAL' && <Zap className="w-4 h-4 animate-pulse" />}
            {level === 'HIGH' && <AlertTriangle className="w-4 h-4" />}
            {level !== 'CRITICAL' && level !== 'HIGH' && <Shield className="w-4 h-4" />}
            {tower.operator} — {level}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Tower info */}
          <div className="grid grid-cols-2 gap-1 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cell ID</span>
              <span className="font-mono">{tower.cellId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">MCC/MNC</span>
              <span className="font-mono">{tower.mcc}/{tower.mnc}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Signal</span>
              <span className="font-mono">{tower.signalStrength} dBm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Encrypted</span>
              {tower.encryption ? (
                <Lock className="w-3 h-3 text-success" />
              ) : (
                <Unlock className="w-3 h-3 text-destructive" />
              )}
            </div>
          </div>

          {/* Score breakdown */}
          <div className="space-y-1.5">
            <p className="text-xs font-medium">Score Breakdown</p>
            {factors.map(f => (
              <div key={f.label} className="space-y-0.5">
                <div className="flex justify-between text-[10px]">
                  <span className="text-muted-foreground">{f.label} ({f.weight})</span>
                  <span className="font-mono">{(f.value * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${f.value * 100}%`,
                      background: f.value > 0.6
                        ? THREAT_COLORS.CRITICAL
                        : f.value > 0.3
                        ? THREAT_COLORS.MEDIUM
                        : THREAT_COLORS.CLEAN,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Overall */}
          <div className="pt-2 border-t border-border/50">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium">Overall Score</span>
              <span className={cn("text-lg font-bold font-mono",
                level === 'CRITICAL' && "text-destructive animate-pulse",
                level === 'HIGH' && "text-orange-400",
                level === 'MEDIUM' && "text-yellow-400",
              )}>
                {(anomalyReport.score * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Findings */}
          {anomalyReport.details.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium">Findings</p>
              {anomalyReport.details.map((d, i) => (
                <p key={i} className="text-[10px] text-muted-foreground flex gap-1">
                  <span className="text-warning">⚠</span> {d}
                </p>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default TacticalDashboard;
