import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import {
  Shield,
  AlertTriangle,
  ChevronDown,
  Smartphone,
  Wifi,
  MapPin,
  Radio,
  Eye,
  Lock,
  Search,
  Phone,
  Settings,
  Zap,
  Bug,
  Bluetooth,
  ShieldCheck,
  ShieldAlert,
  Signal,
} from 'lucide-react';

interface GuideSection {
  id: string;
  icon: React.ElementType;
  severity: 'critical' | 'high' | 'medium' | 'info';
}

const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: 'imsi-catcher',
    icon: Radio,
    severity: 'critical',
},
  {
    id: 'silent-sms',
    icon: Phone,
    severity: 'high',
},
  {
    id: 'location-tracking',
    icon: MapPin,
    severity: 'high',
},
  {
    id: 'wifi-attacks',
    icon: Wifi,
    severity: 'medium',
},
  {
    id: 'physical-trackers',
    icon: Bug,
    severity: 'high',
},
  {
    id: 'phone-security',
    icon: Smartphone,
    severity: 'info',
},
];

const getSeverityColor = (severity: GuideSection['severity']) => {
  switch (severity) {
    case 'critical': return 'border-destructive/40 bg-destructive/5';
    case 'high': return 'border-warning/40 bg-warning/5';
    case 'medium': return 'border-primary/40 bg-primary/5';
    case 'info': return 'border-border bg-muted/30';
  }
};

const getSeverityBadge = (severity: GuideSection['severity'], t: (key: string) => string) => {
  switch (severity) {
    case 'critical': return <Badge className="bg-destructive/20 text-destructive border-destructive/30 text-[10px]">{t('pages.protection.severityBadge.critical')}</Badge>;
    case 'high': return <Badge className="bg-warning/20 text-warning border-warning/30 text-[10px]">{t('pages.protection.severityBadge.high')}</Badge>;
    case 'medium': return <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px]">{t('pages.protection.severityBadge.medium')}</Badge>;
    case 'info': return <Badge variant="outline" className="text-[10px]">{t('pages.protection.severityBadge.info')}</Badge>;
  }
};

const ProtectionGuidePage = () => {
  const { t } = useTranslation();
  const [openSections, setOpenSections] = useState<string[]>(['imsi-catcher']);

  const toggleSection = (id: string) => {
    setOpenSections(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  return (
    <MainLayout>
      <Header
        title={t('pages.protection.headerTitle')}
        subtitle={t('pages.protection.headerSubtitle')}
      />

      <div className="p-3 md:p-6 space-y-4 max-w-4xl mx-auto">
        {/* Threat Overview */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              {t('pages.protection.overview.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {t('pages.protection.overview.description')}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: t('pages.protection.overview.critical'), count: GUIDE_SECTIONS.filter(s => s.severity === 'critical').length, color: 'text-destructive' },
                { label: t('pages.protection.overview.high'), count: GUIDE_SECTIONS.filter(s => s.severity === 'high').length, color: 'text-warning' },
                { label: t('pages.protection.overview.medium'), count: GUIDE_SECTIONS.filter(s => s.severity === 'medium').length, color: 'text-primary' },
                { label: t('pages.protection.overview.info'), count: GUIDE_SECTIONS.filter(s => s.severity === 'info').length, color: 'text-muted-foreground' },
              ].map(item => (
                <div key={item.label} className="text-center p-2 rounded-lg bg-muted/30 border border-border">
                  <p className={cn("text-xl font-bold font-mono", item.color)}>{item.count}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">{item.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-destructive/5 border-destructive/30">
          <CardContent className="p-3">
            <div className="flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
              <div className="text-xs">
                <p className="font-medium text-destructive">{t('pages.protection.quickActions.title')}</p>
                <ol className="text-muted-foreground mt-1 space-y-0.5 list-decimal list-inside">
                  {(t('pages.protection.quickActions.steps', { returnObjects: true }) as string[]).map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guide Sections */}
        <div className="space-y-3">
          {GUIDE_SECTIONS.map((section) => {
            const Icon = section.icon;
            const isOpen = openSections.includes(section.id);
            return (
              <Collapsible key={section.id} open={isOpen} onOpenChange={() => toggleSection(section.id)}>
                <Card className={cn("border transition-colors", getSeverityColor(section.severity))}>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="pb-2 cursor-pointer hover:bg-muted/30 transition-colors">
                      <CardTitle className="text-sm flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {t(`pages.protection.sections.${section.id}.title`)}
                        </span>
                        <span className="flex items-center gap-2">
                          {getSeverityBadge(section.severity, t)}
                          <ChevronDown className={cn(
                            "w-4 h-4 text-muted-foreground transition-transform",
                            isOpen && "rotate-180"
                          )} />
                        </span>
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0 space-y-4">
                      {/* Threat Description */}
                      <div className="p-3 rounded-lg bg-background/50 border border-border/50">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-3 h-3 text-warning mt-0.5 shrink-0" />
                          <p className="text-xs text-muted-foreground">{t(`pages.protection.sections.${section.id}.threat`)}</p>
                        </div>
                      </div>

                      {/* Warning Signs */}
                      <div>
                        <h4 className="text-xs font-semibold text-destructive mb-2 flex items-center gap-1">
                          <Eye className="w-3 h-3" /> {t('pages.protection.sectionLabels.warningSigns')}
                        </h4>
                        <ul className="space-y-1">
                          {(t(`pages.protection.sections.${section.id}.signs`, { returnObjects: true }) as string[]).map((sign, i) => (
                            <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                              <span className="text-destructive mt-0.5">•</span>
                              {sign}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Protection Steps */}
                      <div>
                        <h4 className="text-xs font-semibold text-primary mb-2 flex items-center gap-1">
                          <Shield className="w-3 h-3" /> {t('pages.protection.sectionLabels.protectionSteps')}
                        </h4>
                        <ol className="space-y-1">
                          {(t(`pages.protection.sections.${section.id}.protection`, { returnObjects: true }) as string[]).map((step, i) => (
                            <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                              <span className="text-primary font-mono font-bold">{i + 1}.</span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Recommended Tools */}
                      <div>
                        <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1">
                          <Settings className="w-3 h-3" /> {t('pages.protection.sectionLabels.recommendedTools')}
                        </h4>
                        <div className="space-y-1">
                          {(t(`pages.protection.sections.${section.id}.tools`, { returnObjects: true }) as string[]).map((tool, i) => (
                            <div key={i} className="text-xs text-muted-foreground bg-muted/30 p-1.5 rounded">
                              {tool}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            );
          })}
        </div>

        {/* Emergency Contacts */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              {t('pages.protection.emergency.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-muted-foreground">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-2 rounded bg-muted/30 border border-border">
                <p className="font-medium text-foreground">{t('pages.protection.emergency.hakom.name')}</p>
                <p>{t('pages.protection.emergency.hakom.description')}</p>
                <p className="font-mono text-primary">{t('pages.protection.emergency.hakom.contact')}</p>
              </div>
              <div className="p-2 rounded bg-muted/30 border border-border">
                <p className="font-medium text-foreground">{t('pages.protection.emergency.eff.name')}</p>
                <p>{t('pages.protection.emergency.eff.description')}</p>
                <p className="font-mono text-primary">{t('pages.protection.emergency.eff.contact')}</p>
              </div>
              <div className="p-2 rounded bg-muted/30 border border-border">
                <p className="font-medium text-foreground">{t('pages.protection.emergency.aclu.name')}</p>
                <p>{t('pages.protection.emergency.aclu.description')}</p>
                <p className="font-mono text-primary">{t('pages.protection.emergency.aclu.contact')}</p>
              </div>
              <div className="p-2 rounded bg-muted/30 border border-border">
                <p className="font-medium text-foreground">{t('pages.protection.emergency.police.name')}</p>
                <p>{t('pages.protection.emergency.police.description')}</p>
                <p className="font-mono text-primary">{t('pages.protection.emergency.police.contact')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ProtectionGuidePage;
