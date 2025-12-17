import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Radio, Wifi, AlertTriangle, Activity, Shield, Power } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { IMSITable } from '@/components/dashboard/IMSITable';
import { RadarDisplay } from '@/components/dashboard/RadarDisplay';
import { AlertsList } from '@/components/dashboard/AlertsList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IMSIRecord, Alert } from '@/types/signal';
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

  // Initialize with mock data
  useEffect(() => {
    setImsiRecords(generateMockIMSIRecords(15));
    setAlerts(generateMockAlerts());
  }, []);

  // Simulate real-time data
  useEffect(() => {
    if (!isScanning) return;

    const unsubIMSI = simulateRealtimeIMSI((record) => {
      setImsiRecords(prev => [record, ...prev].slice(0, 50));
    });

    const unsubAlert = simulateRealtimeAlert((alert) => {
      setAlerts(prev => [alert, ...prev]);
    });

    return () => {
      unsubIMSI();
      unsubAlert();
    };
  }, [isScanning]);

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

      <div className="p-6 space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Signals Detected"
            value={imsiRecords.length}
            subtitle="Last hour"
            icon={Wifi}
            trend={{ value: 12, isPositive: true }}
            variant="primary"
          />
          <StatsCard
            title="Suspicious Activity"
            value={suspiciousCount}
            subtitle="Requires attention"
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
            title="Protection Status"
            value="Active"
            subtitle="All monitors running"
            icon={Shield}
            variant="success"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: IMSI Table */}
          <div className="lg:col-span-2">
            <IMSITable records={imsiRecords} maxRows={12} />
          </div>

          {/* Right: Radar and Controls */}
          <div className="space-y-6">
            {/* Scan Control */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Radio className="w-5 h-5 text-primary" />
                  Scan Control
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center">
                  <RadarDisplay
                    isScanning={isScanning}
                    detectedCount={imsiRecords.length}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Frequency:</span>
                    <span className="font-mono text-foreground">{frequency}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <span className={isScanning ? 'text-success' : 'text-muted-foreground'}>
                      {isScanning ? 'Scanning' : 'Idle'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Device:</span>
                    <span className="text-foreground">RTL-SDR v3</span>
                  </div>
                </div>

                <Button
                  onClick={() => setIsScanning(!isScanning)}
                  variant={isScanning ? 'destructive' : 'default'}
                  className="w-full"
                >
                  <Power className="w-4 h-4 mr-2" />
                  {isScanning ? 'Stop Scanning' : 'Start Scanning'}
                </Button>
              </CardContent>
            </Card>

            {/* Recent Alerts */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
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

        {/* Frequency Band Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { band: 'GSM 900', freq: '935-960 MHz', active: true },
            { band: 'GSM 1800', freq: '1805-1880 MHz', active: false },
            { band: 'LTE B7', freq: '2620-2690 MHz', active: false },
            { band: 'LTE B20', freq: '791-821 MHz', active: true },
          ].map((band) => (
            <div
              key={band.band}
              className={`p-4 rounded-lg border ${
                band.active
                  ? 'bg-primary/10 border-primary/30'
                  : 'bg-muted/30 border-border'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-foreground">{band.band}</span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    band.active ? 'status-active' : 'bg-muted'
                  }`}
                />
              </div>
              <span className="text-xs font-mono text-muted-foreground">
                {band.freq}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Index;
