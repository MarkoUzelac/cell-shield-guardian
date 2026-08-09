import { useState } from 'react';
import { Save, Key, Radio, Bell, Database, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
    toast.success(t('pages.settings.toast.saved'));
  };

  return (
    <MainLayout>
      <Header
        title={t('pages.settings.header.title')}
        subtitle={t('pages.settings.header.subtitle')}
      />

      <div className="p-6 space-y-6 max-w-4xl">
        {/* API Keys */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              {t('pages.settings.api.title')}
            </CardTitle>
            <CardDescription>
              {t('pages.settings.api.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="opencellid">{t('pages.settings.api.keyLabel')}</Label>
              <Input
                id="opencellid"
                type="password"
                placeholder={t('pages.settings.api.keyPlaceholder')}
                value={settings.openCellIdKey}
                onChange={(e) =>
                  setSettings({ ...settings, openCellIdKey: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                {t('pages.settings.api.getKeyPrefix')}{' '}
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
              {t('pages.settings.scanner.title')}
            </CardTitle>
            <CardDescription>
              {t('pages.settings.scanner.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="frequency">{t('pages.settings.scanner.frequencyLabel')}</Label>
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
                <Label htmlFor="gain">{t('pages.settings.scanner.gainLabel')}</Label>
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
                <Label htmlFor="autoscan">{t('pages.settings.scanner.autoScanLabel')}</Label>
                <p className="text-xs text-muted-foreground">
                  {t('pages.settings.scanner.autoScanDescription')}
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
              {t('pages.settings.alertPreferences.title')}
            </CardTitle>
            <CardDescription>
              {t('pages.settings.alertPreferences.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="alerts">{t('pages.settings.alertPreferences.enableAlertsLabel')}</Label>
                <p className="text-xs text-muted-foreground">
                  {t('pages.settings.alertPreferences.enableAlertsDescription')}
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
                <Label htmlFor="sound">{t('pages.settings.alertPreferences.soundAlertsLabel')}</Label>
                <p className="text-xs text-muted-foreground">
                  {t('pages.settings.alertPreferences.soundAlertsDescription')}
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
              {t('pages.settings.dataManagement.title')}
            </CardTitle>
            <CardDescription>
              {t('pages.settings.dataManagement.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="retention">{t('pages.settings.dataManagement.retentionLabel')}</Label>
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
                  <SelectItem value="7">{t('pages.settings.dataManagement.retentionOptions.d7')}</SelectItem>
                  <SelectItem value="30">{t('pages.settings.dataManagement.retentionOptions.d30')}</SelectItem>
                  <SelectItem value="90">{t('pages.settings.dataManagement.retentionOptions.d90')}</SelectItem>
                  <SelectItem value="365">{t('pages.settings.dataManagement.retentionOptions.d365')}</SelectItem>
                  <SelectItem value="0">{t('pages.settings.dataManagement.retentionOptions.forever')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4">
              <Button variant="outline">{t('pages.settings.dataManagement.exportAllData')}</Button>
              <Button variant="destructive">{t('pages.settings.dataManagement.clearAllData')}</Button>
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
                  {t('pages.settings.securityNotice.title')}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {t('pages.settings.securityNotice.description')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            {t('pages.settings.saveButton')}
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
