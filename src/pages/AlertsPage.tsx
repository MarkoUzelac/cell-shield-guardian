import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Filter, Search, Trash2 } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { AlertsList } from '@/components/dashboard/AlertsList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert } from '@/types/signal';
import { generateMockAlerts, simulateRealtimeAlert } from '@/lib/mockData';
import { toast } from 'sonner';

const AlertsPage = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load more alerts for the logs page
    const initialAlerts = [
      ...generateMockAlerts(),
      ...generateMockAlerts().map((a, i) => ({
        ...a,
        id: `${a.id}-${i}`,
        timestamp: new Date(Date.now() - (i + 4) * 900000),
      })),
    ];
    setAlerts(initialAlerts);

    // Subscribe to real-time alerts
    const unsub = simulateRealtimeAlert((alert) => {
      setAlerts(prev => [alert, ...prev]);
      toast.warning(alert.title, {
        description: alert.message,
      });
    });

    return unsub;
  }, []);

  const handleAcknowledge = (id: string) => {
    setAlerts(prev =>
      prev.map(a => (a.id === id ? { ...a, acknowledged: true } : a))
    );
  };

  const handleDismiss = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const handleExport = () => {
    const data = JSON.stringify(alerts, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alerts-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Alerts exported successfully');
  };

  const handleClearAcknowledged = () => {
    setAlerts(prev => prev.filter(a => !a.acknowledged));
    toast.success('Cleared acknowledged alerts');
  };

  const filteredAlerts = alerts
    .filter(a => filter === 'all' || a.type === filter)
    .filter(
      a =>
        searchQuery === '' ||
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.message.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const stats = {
    total: alerts.length,
    critical: alerts.filter(a => a.type === 'critical').length,
    warning: alerts.filter(a => a.type === 'warning').length,
    info: alerts.filter(a => a.type === 'info').length,
    unacknowledged: alerts.filter(a => !a.acknowledged).length,
  };

  return (
    <MainLayout>
      <Header
        title="Alerts & Logs"
        subtitle="Security alerts, warnings, and system event history"
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Total', value: stats.total, color: 'text-foreground' },
            { label: 'Critical', value: stats.critical, color: 'text-destructive' },
            { label: 'Warnings', value: stats.warning, color: 'text-warning' },
            { label: 'Info', value: stats.info, color: 'text-primary' },
            { label: 'Unread', value: stats.unacknowledged, color: 'text-foreground' },
          ].map((stat) => (
            <Card key={stat.label} className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <p className={`text-2xl font-bold font-mono ${stat.color}`}>
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters and Actions */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex flex-col md:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search alerts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={filter}
                  onValueChange={(v) => setFilter(v as typeof filter)}
                >
                  <SelectTrigger className="w-40">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleClearAcknowledged}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Read
                </Button>
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alerts List */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">
              Alert History ({filteredAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AlertsList
              alerts={filteredAlerts}
              onAcknowledge={handleAcknowledge}
              onDismiss={handleDismiss}
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AlertsPage;
