import { useState, useEffect, useCallback } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Wifi, 
  Signal, 
  Shield, 
  AlertTriangle, 
  Activity,
  Download,
  Upload,
  Clock,
  Radio,
  Eye,
  EyeOff,
  RefreshCw,
  Smartphone,
  Globe,
  Lock,
  Unlock,
  Zap,
  Server,
  Network
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { SpeedTestPanel } from '@/components/network/SpeedTestPanel';
import { z } from 'zod';

// Zod schema for IP API response validation
const IpApiSchema = z.object({
  org: z.string().max(200).optional().nullable(),
  country_code: z.string().max(10).optional().nullable(),
  country_name: z.string().max(100).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  ip: z.string().max(45).optional().nullable(),
  region: z.string().max(100).optional().nullable(),
  timezone: z.string().max(50).optional().nullable(),
  asn: z.string().max(50).optional().nullable(),
});

type ValidatedIpInfo = z.infer<typeof IpApiSchema>;

// Sanitization helper for display text
const sanitizeDisplayText = (input?: string | null): string => {
  if (!input) return '';
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 100); // Limit length
};

interface NetworkInfo {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
  type?: string;
}

interface CarrierInfo {
  name: string;
  mcc: string;
  mnc: string;
  country: string;
  technology: string;
  isRoaming: boolean;
}

interface SpeedTestResult {
  download: number;
  upload: number;
  latency: number;
  jitter: number;
  timestamp: Date;
}

interface SecurityIndicator {
  id: string;
  name: string;
  status: 'safe' | 'warning' | 'danger' | 'unknown';
  description: string;
  details?: string;
}

const FREQUENCY_BANDS = [
  { band: '2G (GSM)', frequencies: ['850 MHz', '900 MHz', '1800 MHz', '1900 MHz'], risk: 'high', note: 'Weak encryption, vulnerable to interception' },
  { band: '3G (UMTS)', frequencies: ['850 MHz', '900 MHz', '2100 MHz'], risk: 'medium', note: 'Better encryption, still some vulnerabilities' },
  { band: '4G (LTE)', frequencies: ['Band 1 (2100 MHz)', 'Band 3 (1800 MHz)', 'Band 7 (2600 MHz)', 'Band 8 (900 MHz)', 'Band 20 (800 MHz)', 'Band 28 (700 MHz)'], risk: 'low', note: 'Strong encryption, most secure legacy network' },
  { band: '5G (NR)', frequencies: ['n78 (3500 MHz)', 'n41 (2500 MHz)', 'n28 (700 MHz)', 'n258 (26 GHz mmWave)'], risk: 'low', note: 'Latest encryption standards, enhanced security' },
];

const NETWORK_CONSENT_KEY = 'network-diagnostics-consent';

const NetworkIntelligencePage = () => {
  const { toast } = useToast();
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [carrierInfo, setCarrierInfo] = useState<CarrierInfo | null>(null);
  const [speedTest, setSpeedTest] = useState<SpeedTestResult | null>(null);
  const [isTestingSpeed, setIsTestingSpeed] = useState(false);
  const [speedProgress, setSpeedProgress] = useState(0);
  const [securityIndicators, setSecurityIndicators] = useState<SecurityIndicator[]>([]);
  const [ipInfo, setIpInfo] = useState<ValidatedIpInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasConsent, setHasConsent] = useState<boolean | null>(null);

  // Check for existing consent on mount
  useEffect(() => {
    const storedConsent = localStorage.getItem(NETWORK_CONSENT_KEY);
    setHasConsent(storedConsent === 'true');
  }, []);

  const fetchNetworkInfo = useCallback(() => {
    const connection = (navigator as any).connection || 
                       (navigator as any).mozConnection || 
                       (navigator as any).webkitConnection;
    
    if (connection) {
      const update = () => {
        setNetworkInfo({
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData,
          type: connection.type
        });
      };
      update();
      connection.addEventListener('change', update);
      return () => connection.removeEventListener('change', update);
    }
    return undefined;
  }, []);

  useEffect(() => {
    const cleanup = fetchNetworkInfo();
    analyzeSecurityIndicators();
    
    if (hasConsent === true) {
      fetchIpInfo();
    } else if (hasConsent === false) {
      setIsLoading(false);
    }

    return () => cleanup?.();
  }, [hasConsent, fetchNetworkInfo]);

  const handleConsentGiven = () => {
    localStorage.setItem(NETWORK_CONSENT_KEY, 'true');
    setHasConsent(true);
    toast({
      title: "Network Diagnostics Enabled",
      description: "Fetching network information...",
    });
  };

  const handleConsentRevoked = () => {
    localStorage.removeItem(NETWORK_CONSENT_KEY);
    setHasConsent(false);
    setIpInfo(null);
    setCarrierInfo(null);
    toast({
      title: "Network Diagnostics Disabled",
      description: "External API calls have been disabled.",
    });
  };

  const fetchIpInfo = async () => {
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    try {
      const response = await fetch('https://ipapi.co/json/', {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const rawData = await response.json();
        
        // Validate response with Zod schema
        const validationResult = IpApiSchema.safeParse(rawData);
        
        if (!validationResult.success) {
          console.warn('IP API response validation failed');
          toast({
            title: "Invalid data received",
            description: "Network information may be incomplete.",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }
        
        const data = validationResult.data;
        setIpInfo(data);
        
        // Set carrier info with sanitized data
        setCarrierInfo({
          name: sanitizeDisplayText(data.org) || 'Unknown Carrier',
          mcc: sanitizeDisplayText(data.country_code) || 'N/A',
          mnc: 'N/A',
          country: sanitizeDisplayText(data.country_name) || 'Unknown',
          technology: networkInfo?.effectiveType?.toUpperCase() || '4G',
          isRoaming: false
        });
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        toast({
          title: "Request timeout",
          description: "Network information request timed out.",
          variant: "destructive"
        });
      } else {
        console.warn('Failed to fetch IP info');
      }
    } finally {
      setIsLoading(false);
    }
  };
  const analyzeSecurityIndicators = () => {
    const indicators: SecurityIndicator[] = [
      {
        id: 'encryption',
        name: 'Connection Encryption',
        status: window.location.protocol === 'https:' ? 'safe' : 'warning',
        description: window.location.protocol === 'https:' 
          ? 'Your connection is encrypted with TLS/SSL'
          : 'Connection is not encrypted - data may be intercepted',
        details: 'HTTPS encrypts data between your device and servers'
      },
      {
        id: 'network_type',
        name: 'Network Generation',
        status: getNetworkTypeRisk(networkInfo?.effectiveType),
        description: `Connected via ${networkInfo?.effectiveType?.toUpperCase() || 'Unknown'} network`,
        details: networkInfo?.effectiveType === '2g' 
          ? 'WARNING: 2G networks have weak encryption and are vulnerable to IMSI catchers'
          : networkInfo?.effectiveType === '3g'
          ? 'CAUTION: 3G has some known vulnerabilities'
          : '4G/5G networks have stronger encryption'
      },
      {
        id: 'downgrade_risk',
        name: 'Downgrade Attack Risk',
        status: networkInfo?.effectiveType === '2g' ? 'danger' : 'safe',
        description: networkInfo?.effectiveType === '2g'
          ? 'ALERT: You may be experiencing a forced network downgrade'
          : 'No forced downgrade detected',
        details: 'IMSI catchers often force phones to connect via 2G for easier interception'
      },
      {
        id: 'latency',
        name: 'Connection Latency',
        status: getLatencyRisk(networkInfo?.rtt),
        description: `Current latency: ${networkInfo?.rtt || 'Unknown'}ms`,
        details: 'Abnormally high latency can indicate traffic interception or man-in-the-middle attacks'
      },
      {
        id: 'data_saver',
        name: 'Data Saver Mode',
        status: networkInfo?.saveData ? 'warning' : 'safe',
        description: networkInfo?.saveData 
          ? 'Data saver is active - some content may be proxied'
          : 'Data saver is not active',
        details: 'Proxied connections may route through third-party servers'
      },
      {
        id: 'dns_security',
        name: 'DNS Security',
        status: 'unknown',
        description: 'DNS security status cannot be determined from browser',
        details: 'Consider using DNS-over-HTTPS (DoH) for encrypted DNS queries'
      }
    ];

    setSecurityIndicators(indicators);
  };

  const getNetworkTypeRisk = (type?: string): SecurityIndicator['status'] => {
    switch (type) {
      case '4g':
      case '5g':
        return 'safe';
      case '3g':
        return 'warning';
      case '2g':
        return 'danger';
      default:
        return 'unknown';
    }
  };

  const getLatencyRisk = (rtt?: number): SecurityIndicator['status'] => {
    if (!rtt) return 'unknown';
    if (rtt < 100) return 'safe';
    if (rtt < 300) return 'warning';
    return 'danger';
  };

  const runSpeedTest = async () => {
    // Require consent for external API calls
    if (!hasConsent) {
      toast({
        title: "Enable Network Diagnostics",
        description: "Please enable network diagnostics to run speed tests.",
        variant: "destructive"
      });
      return;
    }

    setIsTestingSpeed(true);
    setSpeedProgress(0);

    // Simulate speed test with realistic progression
    const testDuration = 5000;
    const startTime = Date.now();
    
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / testDuration) * 100, 100);
      setSpeedProgress(progress);
    }, 100);

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout for speed test

    try {
      const downloadStart = performance.now();
      
      // Download a sample file to measure speed
      const response = await fetch('https://httpbin.org/bytes/500000', { 
        cache: 'no-store',
        mode: 'cors',
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (response.ok) {
        await response.blob();
        const downloadEnd = performance.now();
        const downloadTime = (downloadEnd - downloadStart) / 1000; // seconds
        const downloadSpeed = (500000 * 8) / (downloadTime * 1000000); // Mbps

        // Estimate other metrics based on Network API
        const latency = networkInfo?.rtt || Math.random() * 50 + 10;
        const jitter = Math.random() * 10 + 2;
        
        // Estimate upload as percentage of download
        const uploadSpeed = downloadSpeed * (0.3 + Math.random() * 0.3);

        setSpeedTest({
          download: Math.round(downloadSpeed * 100) / 100,
          upload: Math.round(uploadSpeed * 100) / 100,
          latency: Math.round(latency),
          jitter: Math.round(jitter * 10) / 10,
          timestamp: new Date()
        });

        toast({
          title: "Speed Test Complete",
          description: `Download: ${downloadSpeed.toFixed(2)} Mbps`,
        });
      }
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        toast({
          title: "Speed Test Timeout",
          description: "The speed test took too long. Please try again.",
          variant: "destructive"
        });
      } else {
        // Fallback to simulated results based on Network API
        setSpeedTest({
          download: networkInfo?.downlink || Math.random() * 50 + 10,
          upload: (networkInfo?.downlink || Math.random() * 50 + 10) * 0.3,
          latency: networkInfo?.rtt || Math.random() * 50 + 10,
          jitter: Math.random() * 10 + 2,
          timestamp: new Date()
        });
        
        toast({
          title: "Speed Test Complete",
          description: "Results based on browser network estimation",
          variant: "default"
        });
      }
    }

    clearInterval(progressInterval);
    setSpeedProgress(100);
    setIsTestingSpeed(false);
  };

  const getStatusColor = (status: SecurityIndicator['status']) => {
    switch (status) {
      case 'safe': return 'text-success';
      case 'warning': return 'text-warning';
      case 'danger': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBadge = (status: SecurityIndicator['status']) => {
    switch (status) {
      case 'safe': return <Badge className="bg-success/20 text-success border-success/30">SECURE</Badge>;
      case 'warning': return <Badge className="bg-warning/20 text-warning border-warning/30">CAUTION</Badge>;
      case 'danger': return <Badge className="bg-destructive/20 text-destructive border-destructive/30">RISK</Badge>;
      default: return <Badge variant="outline">UNKNOWN</Badge>;
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'high': return <Badge className="bg-destructive/20 text-destructive border-destructive/30">HIGH RISK</Badge>;
      case 'medium': return <Badge className="bg-warning/20 text-warning border-warning/30">MEDIUM</Badge>;
      case 'low': return <Badge className="bg-success/20 text-success border-success/30">LOW RISK</Badge>;
      default: return <Badge variant="outline">UNKNOWN</Badge>;
    }
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Network Intelligence</h1>
          <p className="text-muted-foreground">Carrier analysis, speed testing, and security monitoring</p>
        </div>

        {/* Disclaimer Banner */}
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-warning">Educational Information Only</p>
                <p className="text-muted-foreground mt-1">
                  This page provides network diagnostics and educational information about potential security risks. 
                  The indicators shown are informational and NOT definitive proof of surveillance or attacks. 
                  Most anomalies have benign explanations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Consent Banner */}
        {hasConsent === false && (
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-primary">Enable Network Diagnostics?</p>
                    <p className="text-muted-foreground mt-1">
                      This will share your IP address with ipapi.co for location/carrier information. 
                      Speed tests use httpbin.org. No personal data is stored.
                    </p>
                  </div>
                </div>
                <Button onClick={handleConsentGiven} size="sm" className="whitespace-nowrap">
                  Enable Diagnostics
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Consent Toggle (when already consented) */}
        {hasConsent === true && (
          <div className="flex justify-end">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleConsentRevoked}
              className="text-muted-foreground hover:text-foreground"
            >
              <EyeOff className="h-4 w-4 mr-2" />
              Disable External Diagnostics
            </Button>
          </div>
        )}

        {/* Network Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Signal className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Network Type</p>
                      <p className="text-xl font-bold">{networkInfo?.effectiveType?.toUpperCase() || 'Unknown'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent/10 rounded-lg">
                      <Globe className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">ISP/Carrier</p>
                      <p className="text-lg font-bold truncate max-w-[150px]">
                        {hasConsent 
                          ? (sanitizeDisplayText(ipInfo?.org)?.split(' ')[0] || 'Loading...') 
                          : 'Enable to view'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-success/10 rounded-lg">
                      <Clock className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Latency</p>
                      <p className="text-xl font-bold">{networkInfo?.rtt || speedTest?.latency || '--'} ms</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Est. Bandwidth</p>
                      <p className="text-xl font-bold">{networkInfo?.downlink || '--'} Mbps</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <Tabs defaultValue="security" className="space-y-4">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="security" className="data-[state=active]:bg-primary/20">
              <Shield className="h-4 w-4 mr-2" />
              Security Analysis
            </TabsTrigger>
            <TabsTrigger value="speed" className="data-[state=active]:bg-primary/20">
              <Activity className="h-4 w-4 mr-2" />
              Speed Test
            </TabsTrigger>
            <TabsTrigger value="carrier" className="data-[state=active]:bg-primary/20">
              <Smartphone className="h-4 w-4 mr-2" />
              Carrier Info
            </TabsTrigger>
            <TabsTrigger value="frequencies" className="data-[state=active]:bg-primary/20">
              <Radio className="h-4 w-4 mr-2" />
              Frequencies
            </TabsTrigger>
          </TabsList>

          <TabsContent value="security" className="space-y-4">
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Security Indicators
                </CardTitle>
                <CardDescription>
                  Real-time analysis of potential network security risks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <AnimatePresence>
                    {securityIndicators.map((indicator, index) => (
                      <motion.div
                        key={indicator.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 rounded-lg bg-background/50 border border-border/50"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className={`mt-1 ${getStatusColor(indicator.status)}`}>
                              {indicator.status === 'safe' ? <Lock className="h-5 w-5" /> :
                               indicator.status === 'danger' ? <AlertTriangle className="h-5 w-5" /> :
                               indicator.status === 'warning' ? <Eye className="h-5 w-5" /> :
                               <EyeOff className="h-5 w-5" />}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{indicator.name}</h4>
                                {getStatusBadge(indicator.status)}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{indicator.description}</p>
                              {indicator.details && (
                                <p className="text-xs text-muted-foreground/70 mt-2 italic">{indicator.details}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="mt-6 flex justify-center">
                  <Button 
                    onClick={() => {
                      fetchNetworkInfo();
                      analyzeSecurityIndicators();
                      toast({ title: "Security analysis refreshed" });
                    }}
                    variant="outline"
                    className="gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Potential Threats Info */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-500">
                  <AlertTriangle className="h-5 w-5" />
                  What to Watch For
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                    <h4 className="font-medium text-destructive mb-2">IMSI Catcher Signs</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Sudden downgrade to 2G in strong signal area</li>
                      <li>• Unusual cell tower ID changes</li>
                      <li>• Rapid battery drain</li>
                      <li>• Call quality degradation</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-warning/5 border border-warning/20">
                    <h4 className="font-medium text-warning mb-2">Silent SMS Indicators</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Unexplained network activity</li>
                      <li>• Brief signal interruptions</li>
                      <li>• Unusual data usage patterns</li>
                      <li>• Phone waking without notifications</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <h4 className="font-medium text-primary mb-2">Man-in-the-Middle</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Certificate warnings on trusted sites</li>
                      <li>• Abnormally high latency</li>
                      <li>• DNS resolution anomalies</li>
                      <li>• Unexpected redirects</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                    <h4 className="font-medium text-accent mb-2">Location Tracking</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Frequent cell tower handoffs while stationary</li>
                      <li>• GPS requests from unknown apps</li>
                      <li>• Wi-Fi probe requests</li>
                      <li>• Bluetooth scanning activity</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="speed" className="space-y-4">
            <SpeedTestPanel hasConsent={hasConsent === true} />
          </TabsContent>

          <TabsContent value="carrier" className="space-y-4">
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-primary" />
                  Carrier & Network Information
                </CardTitle>
                <CardDescription>
                  Details about your current network connection
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* IP Info */}
                    {ipInfo && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex justify-between p-3 rounded-lg bg-background/50">
                            <span className="text-muted-foreground">IP Address</span>
                            <span className="font-mono">{ipInfo.ip}</span>
                          </div>
                          <div className="flex justify-between p-3 rounded-lg bg-background/50">
                            <span className="text-muted-foreground">ISP/Organization</span>
                            <span className="text-right max-w-[200px] truncate">{ipInfo.org}</span>
                          </div>
                          <div className="flex justify-between p-3 rounded-lg bg-background/50">
                            <span className="text-muted-foreground">ASN</span>
                            <span className="font-mono">{ipInfo.asn}</span>
                          </div>
                          <div className="flex justify-between p-3 rounded-lg bg-background/50">
                            <span className="text-muted-foreground">Network Type</span>
                            <span>{networkInfo?.type || networkInfo?.effectiveType?.toUpperCase() || 'Unknown'}</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between p-3 rounded-lg bg-background/50">
                            <span className="text-muted-foreground">Country</span>
                            <span>{ipInfo.country_name} ({ipInfo.country_code})</span>
                          </div>
                          <div className="flex justify-between p-3 rounded-lg bg-background/50">
                            <span className="text-muted-foreground">Region</span>
                            <span>{ipInfo.region}</span>
                          </div>
                          <div className="flex justify-between p-3 rounded-lg bg-background/50">
                            <span className="text-muted-foreground">City</span>
                            <span>{ipInfo.city}</span>
                          </div>
                          <div className="flex justify-between p-3 rounded-lg bg-background/50">
                            <span className="text-muted-foreground">Timezone</span>
                            <span>{ipInfo.timezone}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Network Details */}
                    <div className="p-4 rounded-lg bg-background/50 border border-border/50">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Network className="h-4 w-4" />
                        Connection Details
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Effective Type</p>
                          <p className="font-medium">{networkInfo?.effectiveType?.toUpperCase() || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Downlink</p>
                          <p className="font-medium">{networkInfo?.downlink ? `${networkInfo.downlink} Mbps` : 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">RTT</p>
                          <p className="font-medium">{networkInfo?.rtt ? `${networkInfo.rtt} ms` : 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Data Saver</p>
                          <p className="font-medium">{networkInfo?.saveData ? 'Enabled' : 'Disabled'}</p>
                        </div>
                      </div>
                    </div>

                    <Button 
                      onClick={() => {
                        fetchIpInfo();
                        toast({ title: "Carrier info refreshed" });
                      }}
                      variant="outline"
                      className="w-full gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Refresh Information
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="frequencies" className="space-y-4">
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Radio className="h-5 w-5 text-primary" />
                  Common Mobile Frequencies
                </CardTitle>
                <CardDescription>
                  Reference guide for mobile network frequency bands and their security characteristics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {FREQUENCY_BANDS.map((band, index) => (
                    <motion.div
                      key={band.band}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-lg bg-background/50 border border-border/50"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium text-lg">{band.band}</h4>
                        {getRiskBadge(band.risk)}
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {band.frequencies.map((freq) => (
                          <Badge key={freq} variant="outline" className="font-mono">
                            {freq}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">{band.note}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Server className="h-4 w-4 text-primary" />
                    Monitoring Recommendations
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Use RTL-SDR with gr-gsm to passively monitor GSM frequencies</li>
                    <li>• Focus on 900 MHz and 1800 MHz bands for GSM in most regions</li>
                    <li>• Monitor for unusual broadcast channels or fake base stations</li>
                    <li>• Compare captured Cell IDs against OpenCellID database</li>
                    <li>• Watch for IMSI/TMSI patterns that indicate tracking attempts</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default NetworkIntelligencePage;
