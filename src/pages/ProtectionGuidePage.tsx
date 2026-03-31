import { useState } from 'react';
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
  title: string;
  icon: React.ElementType;
  severity: 'critical' | 'high' | 'medium' | 'info';
  threat: string;
  signs: string[];
  protection: string[];
  tools: string[];
}

const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: 'imsi-catcher',
    title: 'IMSI Catcher / Stingray Detection',
    icon: Radio,
    severity: 'critical',
    threat: 'IMSI catchers (Stingrays) are rogue base stations that impersonate legitimate cell towers to intercept communications, track location, and capture IMSI/TMSI identifiers from nearby phones.',
    signs: [
      'Sudden forced downgrade from 4G/5G to 2G in an area with strong 4G coverage',
      'Rapid and unexplained cell tower switching while stationary',
      'Phone shows full signal bars but calls drop or fail',
      'Battery drains abnormally fast (phone transmitting at max power)',
      'Unknown or unregistered Cell ID appears in tower logs',
      'Multiple devices in the same area experience simultaneous 2G downgrades',
      'SMS messages fail or are delayed without explanation',
    ],
    protection: [
      'Disable 2G/3G in phone settings (Android: Settings → Network → Preferred type → LTE/5G only)',
      'Use Signal, WhatsApp, or other E2E encrypted messaging apps instead of SMS',
      'Enable airplane mode in sensitive locations, then use WiFi with VPN',
      'Monitor your Cell ID changes using this app\'s tower map',
      'If you detect forced 2G downgrade, move to a different location immediately',
      'Use a Faraday bag when not using your phone in high-risk areas',
      'Report suspected IMSI catchers to your national telecom regulator',
    ],
    tools: [
      'Signal Guardian (this app) — monitor tower IDs and detect anomalies',
      'SnoopSnitch (Android) — detects SS7 attacks and IMSI catchers',
      'AIMSICD (Android) — IMSI catcher detection app',
      'Cell Spy Catcher (Android) — monitors base station changes',
      'RTL-SDR + gr-gsm — passive GSM monitoring hardware',
    ],
  },
  {
    id: 'silent-sms',
    title: 'Silent SMS (Stealth Ping) Detection',
    icon: Phone,
    severity: 'high',
    threat: 'Silent SMS (Type 0 SMS) are invisible text messages sent to your phone to determine your location by triggering a network response without any visible notification. Law enforcement and malicious actors use these for real-time tracking.',
    signs: [
      'Unexplained brief signal loss followed by immediate reconnection',
      'Phone wakes from sleep without any visible notification',
      'Unusual data traffic spikes in network monitor',
      'Phone modem briefly activates without user action',
      'Increased battery drain during idle periods',
    ],
    protection: [
      'Use SnoopSnitch or similar apps to detect Type 0 SMS',
      'Monitor baseband activity for unexplained network registrations',
      'Use airplane mode when not actively using cellular service',
      'Consider using a phone with baseband firewall capability',
      'Use VoIP/WiFi calling instead of cellular when possible',
    ],
    tools: [
      'SnoopSnitch — detects silent SMS on rooted Android devices',
      'Android HiddenMenu (*#*#4636#*#*) — view phone radio information',
      'Network Signal Info Pro — detailed cell tower monitoring',
    ],
  },
  {
    id: 'location-tracking',
    title: 'Location Tracking & Surveillance',
    icon: MapPin,
    severity: 'high',
    threat: 'Your location can be tracked through cell tower triangulation, GPS, WiFi positioning, Bluetooth beacons, and even ultrasonic cross-device tracking. Multiple methods are often combined for high-precision tracking.',
    signs: [
      'Apps requesting location permission without clear reason',
      'GPS icon appears when no navigation/maps app is active',
      'Unknown Bluetooth devices repeatedly connecting or pairing',
      'WiFi scanning active even when WiFi is "off"',
      'Ads showing products from stores you visited physically',
      'Someone seems to know your movements without being told',
    ],
    protection: [
      'Review and revoke unnecessary location permissions for all apps',
      'Disable WiFi and Bluetooth scanning (Android: Location → Scanning)',
      'Use a GPS spoofing app for testing (developer mode only)',
      'Disable Google Timeline / Apple Significant Locations',
      'Check for unknown AirTags/Tile trackers using Apple Find My or Google Unknown Tracker Alerts',
      'Use Faraday bag when traveling to sensitive locations',
      'Regularly audit paired Bluetooth devices and remove unknown ones',
      'Disable "Find My Device" if you suspect your account is compromised',
    ],
    tools: [
      'Apple Tracker Detect (Android) — finds unknown AirTags',
      'Google Unknown Tracker Alerts — built into Android',
      'Bluetooth Scanner apps — detect unknown BLE devices',
      'Signal Guardian tower map — monitor cell tower changes',
    ],
  },
  {
    id: 'wifi-attacks',
    title: 'WiFi Attacks & Evil Twin Detection',
    icon: Wifi,
    severity: 'medium',
    threat: 'Attackers can create fake WiFi hotspots that mimic legitimate networks (Evil Twin attacks) to intercept your traffic, steal credentials, and inject malware.',
    signs: [
      'Multiple WiFi networks with the same name (SSID)',
      'Known WiFi network suddenly requires re-authentication',
      'Certificate warnings when connecting to trusted networks',
      'Unusually strong WiFi signal from unknown access point',
      'Internet is slow despite strong WiFi signal',
      'HTTPS sites showing as HTTP or certificate errors',
    ],
    protection: [
      'Always use VPN on public WiFi networks',
      'Verify WiFi network names with the venue staff',
      'Disable auto-connect to open/known networks',
      'Use cellular data instead of public WiFi for sensitive tasks',
      'Check for HTTPS and valid certificates before entering credentials',
      'Forget public WiFi networks after use',
      'Use WPA3 for home networks when available',
    ],
    tools: [
      'Wireshark — network traffic analysis (advanced)',
      'Fing — network scanner to detect rogue devices',
      'NetSpot — WiFi analysis and rogue AP detection',
    ],
  },
  {
    id: 'physical-trackers',
    title: 'Physical Tracking Devices',
    icon: Bug,
    severity: 'high',
    threat: 'Small GPS/Bluetooth tracking devices (AirTags, Tile, GPS trackers) can be hidden in vehicles, bags, or personal items to track your physical location.',
    signs: [
      '"AirTag Found Moving With You" alert on iPhone',
      'Unknown Bluetooth devices appearing consistently in scanner',
      'Small unfamiliar devices found in vehicle wheel wells, bumpers, or undercarriage',
      'Unknown devices attached to bag linings or coat pockets',
      'Chirping sound from hidden AirTag (plays after separation)',
    ],
    protection: [
      'Regularly scan for unknown Bluetooth devices near you',
      'Physically inspect vehicle exterior (wheel wells, bumpers, undercarriage)',
      'Check bags, luggage, and personal items for unfamiliar objects',
      'Use Apple Tracker Detect (Android) or iPhone\'s built-in scanner',
      'If found: do NOT destroy it — document, photograph, then contact police',
      'Consider RF detector for comprehensive sweep of vehicle/home',
      'For high-risk individuals: professional TSCM (bug sweep) services',
    ],
    tools: [
      'Apple Tracker Detect (Android app)',
      'RF Signal Detector (hardware, ~$30-200)',
      'Non-linear junction detector (professional grade)',
      'Flashlight + mirror for visual inspection under vehicles',
    ],
  },
  {
    id: 'phone-security',
    title: 'Phone Security Hardening',
    icon: Smartphone,
    severity: 'info',
    threat: 'Your phone itself can be compromised through malware, spyware, SS7 network attacks, or physical access. A compromised phone gives an attacker access to everything — calls, messages, location, camera, and microphone.',
    signs: [
      'Phone overheating when idle',
      'Unusual data usage or battery drain',
      'Apps you didn\'t install appearing',
      'Phone settings changing without your action',
      'Strange sounds during calls (clicking, static)',
      'Phone takes long to shut down (flushing data)',
    ],
    protection: [
      'Keep OS and all apps updated to latest versions',
      'Only install apps from official stores (Google Play/App Store)',
      'Enable 2FA on all accounts (use authenticator app, not SMS)',
      'Use strong unique passwords with a password manager',
      'Enable full-disk encryption (default on modern phones)',
      'Review app permissions monthly — remove unnecessary access',
      'Disable USB debugging when not needed',
      'Use biometric + PIN lock (not pattern)',
      'Enable remote wipe capability',
      'Consider using a separate phone for sensitive communications',
    ],
    tools: [
      'Malwarebytes Mobile — malware scanner',
      'Bitdefender Mobile Security — comprehensive protection',
      'Haven (Guardian Project) — room surveillance detector',
      'Signal — encrypted messaging & calls',
      'ProtonMail/Tutanota — encrypted email',
    ],
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

const getSeverityBadge = (severity: GuideSection['severity']) => {
  switch (severity) {
    case 'critical': return <Badge className="bg-destructive/20 text-destructive border-destructive/30 text-[10px]">CRITICAL</Badge>;
    case 'high': return <Badge className="bg-warning/20 text-warning border-warning/30 text-[10px]">HIGH</Badge>;
    case 'medium': return <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px]">MEDIUM</Badge>;
    case 'info': return <Badge variant="outline" className="text-[10px]">INFO</Badge>;
  }
};

const ProtectionGuidePage = () => {
  const [openSections, setOpenSections] = useState<string[]>(['imsi-catcher']);

  const toggleSection = (id: string) => {
    setOpenSections(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  return (
    <MainLayout>
      <Header
        title="Protection Guide"
        subtitle="Threat detection & countermeasures"
      />

      <div className="p-3 md:p-6 space-y-4 max-w-4xl mx-auto">
        {/* Threat Overview */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              SIGINT Defense Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              This guide covers real-world surveillance threats targeting mobile devices and provides
              actionable countermeasures. Each section includes detection indicators, protection steps,
              and recommended tools.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: 'Critical', count: GUIDE_SECTIONS.filter(s => s.severity === 'critical').length, color: 'text-destructive' },
                { label: 'High', count: GUIDE_SECTIONS.filter(s => s.severity === 'high').length, color: 'text-warning' },
                { label: 'Medium', count: GUIDE_SECTIONS.filter(s => s.severity === 'medium').length, color: 'text-primary' },
                { label: 'Info', count: GUIDE_SECTIONS.filter(s => s.severity === 'info').length, color: 'text-muted-foreground' },
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
                <p className="font-medium text-destructive">Immediate Actions If You Suspect Surveillance</p>
                <ol className="text-muted-foreground mt-1 space-y-0.5 list-decimal list-inside">
                  <li>Enable airplane mode immediately</li>
                  <li>Move to a different physical location</li>
                  <li>Check for forced 2G downgrade in network settings</li>
                  <li>Scan for unknown Bluetooth/tracking devices nearby</li>
                  <li>Use the Signal Guardian map to check for suspicious towers</li>
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
                          {section.title}
                        </span>
                        <span className="flex items-center gap-2">
                          {getSeverityBadge(section.severity)}
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
                          <p className="text-xs text-muted-foreground">{section.threat}</p>
                        </div>
                      </div>

                      {/* Warning Signs */}
                      <div>
                        <h4 className="text-xs font-semibold text-destructive mb-2 flex items-center gap-1">
                          <Eye className="w-3 h-3" /> Warning Signs
                        </h4>
                        <ul className="space-y-1">
                          {section.signs.map((sign, i) => (
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
                          <Shield className="w-3 h-3" /> Protection Steps
                        </h4>
                        <ol className="space-y-1">
                          {section.protection.map((step, i) => (
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
                          <Settings className="w-3 h-3" /> Recommended Tools
                        </h4>
                        <div className="space-y-1">
                          {section.tools.map((tool, i) => (
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
              Emergency Resources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-muted-foreground">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-2 rounded bg-muted/30 border border-border">
                <p className="font-medium text-foreground">HAKOM (Croatia)</p>
                <p>Croatian Regulatory Authority for Network Industries</p>
                <p className="font-mono text-primary">hakom.hr</p>
              </div>
              <div className="p-2 rounded bg-muted/30 border border-border">
                <p className="font-medium text-foreground">EFF (International)</p>
                <p>Electronic Frontier Foundation — digital rights</p>
                <p className="font-mono text-primary">eff.org/pages/cell-site-simulators</p>
              </div>
              <div className="p-2 rounded bg-muted/30 border border-border">
                <p className="font-medium text-foreground">ACLU Stingray Info</p>
                <p>Legal guidance on cell-site simulators</p>
                <p className="font-mono text-primary">aclu.org/issues/privacy-technology/surveillance-technologies/stingray-tracking-devices</p>
              </div>
              <div className="p-2 rounded bg-muted/30 border border-border">
                <p className="font-medium text-foreground">Local Police</p>
                <p>If you find a physical tracking device, contact authorities</p>
                <p className="font-mono text-primary">Emergency: 112 (EU) / 911 (US)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ProtectionGuidePage;
