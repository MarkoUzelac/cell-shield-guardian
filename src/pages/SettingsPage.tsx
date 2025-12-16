import { useState } from 'react';
import { Save, Key, Radio, Bell, Database, Shield } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    openCellIdKey: '',
    scanFrequency: '935.2',
    autoScan: true,
    alertsEnabled: true,
    soundAlerts: false,
    logRetention: '30',
    deviceGain: '40',
  });

  const handleSave = () => {
    // In a real app, this would save to backend/localStorage
    toast.success('Settings saved successfully');
  };

  return (
    <MainLayout>
      <Header
        title="Settings"
        subtitle="Configure scanner, API keys, and application preferences"
      />

      <div className="p-6 space-y-6 max-w-4xl">
        {/* API Keys */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              API Configuration
            </CardTitle>
            <CardDescription>
              Configure external API keys for cell tower lookup services.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="opencellid">OpenCellID API Key</Label>
              <Input
                id="opencellid"
                type="password"
                placeholder="Enter your OpenCellID API key"
                value={settings.openCellIdKey}
                onChange={(e) =>
                  setSettings({ ...settings, openCellIdKey: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                Get a free API key at{' '}
                <a
                  href="https://opencellid.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  opencellid.org
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Scanner Settings */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-primary" />
              Scanner Configuration
            </CardTitle>
            <CardDescription>
              RTL-SDR device and frequency scanning settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="frequency">Default Frequency (MHz)</Label>
                <Input
                  id="frequency"
                  type="number"
                  step="0.1"
                  value={settings.scanFrequency}
                  onChange={(e) =>
                    setSettings({ ...settings, scanFrequency: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gain">Device Gain (dB)</Label>
                <Input
                  id="gain"
                  type="number"
                  value={settings.deviceGain}
                  onChange={(e) =>
                    setSettings({ ...settings, deviceGain: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoscan">Auto-start scanning</Label>
                <p className="text-xs text-muted-foreground">
                  Automatically begin scanning when application starts
                </p>
              </div>
              <Switch
                id="autoscan"
                checked={settings.autoScan}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, autoScan: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Alert Settings */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Alert Preferences
            </CardTitle>
            <CardDescription>
              Configure how and when you receive security alerts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="alerts">Enable alerts</Label>
                <p className="text-xs text-muted-foreground">
                  Show notifications for suspicious activity
                </p>
              </div>
              <Switch
                id="alerts"
                checked={settings.alertsEnabled}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, alertsEnabled: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sound">Sound alerts</Label>
                <p className="text-xs text-muted-foreground">
                  Play audio notification for critical alerts
                </p>
              </div>
              <Switch
                id="sound"
                checked={settings.soundAlerts}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, soundAlerts: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Settings */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              Data Management
            </CardTitle>
            <CardDescription>
              Configure data storage and retention policies.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="retention">Log retention period</Label>
              <Select
                value={settings.logRetention}
                onValueChange={(v) =>
                  setSettings({ ...settings, logRetention: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                  <SelectItem value="0">Forever</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4">
              <Button variant="outline">Export All Data</Button>
              <Button variant="destructive">Clear All Data</Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="bg-warning/10 border-warning/30">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Shield className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground mb-1">
                  Security & Privacy Notice
                </h4>
                <p className="text-sm text-muted-foreground">
                  All captured data is stored locally on your device. No data is
                  sent to external servers unless you explicitly configure API
                  integrations. This tool is designed for passive, defensive
                  monitoring of your own devices and networks only.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
