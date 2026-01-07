import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Radio, Wifi, AlertTriangle, Activity, Shield, Power, Volume2, VolumeX, Crown } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { IMSITable } from '@/components/dashboard/IMSITable';
import { RadarDisplay } from '@/components/dashboard/RadarDisplay';
import { AlertsList } from '@/components/dashboard/AlertsList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IMSIRecord, Alert } from '@/types/signal';
import { useAlertSound } from '@/hooks/useAlertSound';
import { useGeolocation } from '@/hooks/useGeolocation';
import { CROATIAN_FREQUENCY_BANDS } from '@/lib/croatianOperators';
import {
  generateMockIMSIRecords,
  generateMockAlerts,
  simulateRealtimeIMSI,
  simulateRealtimeAlert,
} from '@/lib/mockData';

const Index = () => {
  const [isScanning, setIsScanning] = useState(true);
  const [imsiRecords, setImsiRecords] = useState<IMSIRecord[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [frequency, setFrequency] = useState('935.2 MHz');
  const { playSound, isMuted, toggleMute } = useAlertSound();
  const { hasRealLocation, latitude, longitude } = useGeolocation();

  // Initialize with mock data
  useEffect(() => {
    setImsiRecords(generateMockIMSIRecords(15));
    setAlerts(generateMockAlerts());
  }, []);

  // Simulate real-time data with sound alerts
  useEffect(() => {
    if (!isScanning) return;

    const unsubIMSI = simulateRealtimeIMSI(
      (record) => {
        setImsiRecords(prev => [record, ...prev].slice(0, 50));
      },
      (record) => {
        // Sound is now handled in IMSITable component
      }
    );

    const unsubAlert = simulateRealtimeAlert(
      (alert) => {
        setAlerts(prev => [alert, ...prev]);
      },
      (type) => {
        if (type === 'critical') {
          playSound('critical');
        } else if (type === 'warning') {
          playSound('warning');
        }
      }
    );

    return () => {
      unsubIMSI();
      unsubAlert();
    };
  }, [isScanning, playSound]);

  const handleAcknowledgeAlert = (id: string) => {
    setAlerts(prev =>
      prev.map(a => (a.id === id ? { ...a, acknowledged: true } : a))
    );
  };

  const handleDismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const suspiciousCount = imsiRecords.filter(r => r.isSuspicious).length;
  const criticalAlerts = alerts.filter(a => a.type === 'critical' && !a.acknowledged).length;

  return (
    <MainLayout>
      <Header
        title="Live Signal Monitor"
        subtitle="Real-time GSM/LTE signal analysis and IMSI catcher detection"
      />

      <div className="p-3 md:p-6 space-y-4 md:space-y-6">
        {/* Premium Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20 border border-primary/30 p-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Crown className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Upgrade to Pro</p>
                <p className="text-xs text-muted-foreground">Get real-time tower data, advanced detection & alerts</p>
              </div>
            </div>
            <Button size="sm" className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
              <Crown className="w-4 h-4 mr-2" />
              Go Pro - €9.99/mo
            </Button>
          </div>
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
        </motion.div>

        {/* Stats Row - Responsive grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <StatsCard
            title="Signals Detected"
            value={imsiRecords.length}
            subtitle="Last hour"
            icon={Wifi}
            trend={{ value: 12, isPositive: true }}
            variant="primary"
          />
          <StatsCard
            title="Suspicious"
            value={suspiciousCount}
            subtitle="Attention needed"
            icon={AlertTriangle}
            variant={suspiciousCount > 0 ? 'warning' : 'default'}
          />
          <StatsCard
            title="Critical Alerts"
            value={criticalAlerts}
            subtitle="Unacknowledged"
            icon={Activity}
            variant={criticalAlerts > 0 ? 'danger' : 'default'}
          />
          <StatsCard
            title="Protection"
            value="Active"
            subtitle="All systems online"
            icon={Shield}
            variant="success"
          />
        </div>

        {/* Main Content - Stack on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* IMSI Table */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <IMSITable records={imsiRecords} maxRows={12} />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4 md:space-y-6 order-1 lg:order-2">
            {/* Scan Control */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2 md:pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base md:text-lg flex items-center gap-2">
                    <Radio className="w-5 h-5 text-primary" />
                    Scan Control
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                    className="h-8 w-8 p-0"
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-primary" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Radar - Smaller on mobile */}
                <div className="flex items-center justify-center">
                  <div className="scale-75 md:scale-100 origin-center">
                    <RadarDisplay
                      isScanning={isScanning}
                      detectedCount={imsiRecords.length}
                    />
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Frequency:</span>
                    <span className="font-mono text-foreground">{frequency}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant={isScanning ? 'default' : 'secondary'} className="text-xs">
                      {isScanning ? 'Scanning' : 'Idle'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="text-foreground text-xs font-mono">
                      {hasRealLocation ? `${latitude?.toFixed(2)}°, ${longitude?.toFixed(2)}°` : 'Croatia'}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => setIsScanning(!isScanning)}
                  variant={isScanning ? 'destructive' : 'default'}
                  className="w-full"
                  size="sm"
                >
                  <Power className="w-4 h-4 mr-2" />
                  {isScanning ? 'Stop Scanning' : 'Start Scanning'}
                </Button>
              </CardContent>
            </Card>

            {/* Recent Alerts */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base md:text-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  Recent Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AlertsList
                  alerts={alerts.slice(0, 3)}
                  onAcknowledge={handleAcknowledgeAlert}
                  onDismiss={handleDismissAlert}
                  compact
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Frequency Bands - Croatian LTE/5G */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4"
        >
          {CROATIAN_FREQUENCY_BANDS.slice(0, 4).map((band, idx) => (
            <div
              key={band.band}
              className={`p-3 md:p-4 rounded-lg border ${
                idx < 2
                  ? 'bg-primary/10 border-primary/30'
                  : 'bg-muted/30 border-border'
              }`}
            >
              <div className="flex items-center justify-between mb-1 md:mb-2">
                <span className="font-medium text-foreground text-xs md:text-sm">{band.band}</span>
                <Badge variant={band.technology === '5G' ? 'default' : 'secondary'} className="text-xs">
                  {band.technology}
                </Badge>
              </div>
              <span className="text-xs font-mono text-muted-foreground">
                {band.frequency}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Index;
