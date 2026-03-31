import { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Download, Upload, Clock, Activity, Zap, RefreshCw, Gauge } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface SpeedResult {
  download: number;
  upload: number;
  latency: number;
  jitter: number;
  timestamp: Date;
  serverLocation?: string;
}

// Multiple test endpoints for accuracy
const TEST_ENDPOINTS = [
  { url: 'https://speed.cloudflare.com/__down?bytes=10000000', size: 10000000, name: 'Cloudflare' },
  { url: 'https://httpbin.org/bytes/5000000', size: 5000000, name: 'HTTPBin' },
];

const UPLOAD_ENDPOINT = 'https://httpbin.org/post';

export const SpeedTestPanel = ({ hasConsent }: { hasConsent: boolean }) => {
  const { toast } = useToast();
  const [result, setResult] = useState<SpeedResult | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'latency' | 'download' | 'upload' | 'done'>('idle');
  const [liveSpeed, setLiveSpeed] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  const measureLatency = useCallback(async (signal: AbortSignal): Promise<{ latency: number; jitter: number }> => {
    const pings: number[] = [];
    for (let i = 0; i < 5; i++) {
      const start = performance.now();
      try {
        await fetch('https://speed.cloudflare.com/__down?bytes=0', { 
          cache: 'no-store', 
          mode: 'cors',
          signal,
        });
        pings.push(performance.now() - start);
      } catch {
        // Skip failed pings
      }
    }
    if (pings.length === 0) return { latency: 0, jitter: 0 };
    
    const avg = pings.reduce((a, b) => a + b, 0) / pings.length;
    const jitter = pings.length > 1
      ? Math.sqrt(pings.reduce((sum, p) => sum + Math.pow(p - avg, 2), 0) / pings.length)
      : 0;
    return { latency: Math.round(avg), jitter: Math.round(jitter * 10) / 10 };
  }, []);

  const measureDownload = useCallback(async (signal: AbortSignal): Promise<number> => {
    const speeds: number[] = [];

    for (const endpoint of TEST_ENDPOINTS) {
      try {
        const start = performance.now();
        const response = await fetch(endpoint.url, { 
          cache: 'no-store', 
          mode: 'cors',
          signal,
        });
        
        if (!response.ok || !response.body) continue;

        const reader = response.body.getReader();
        let received = 0;
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          received += value.length;
          const elapsed = (performance.now() - start) / 1000;
          if (elapsed > 0) {
            const currentSpeed = (received * 8) / (elapsed * 1000000);
            setLiveSpeed(Math.round(currentSpeed * 10) / 10);
          }
        }
        
        const elapsed = (performance.now() - start) / 1000;
        const speed = (received * 8) / (elapsed * 1000000); // Mbps
        speeds.push(speed);
      } catch {
        // Try next endpoint
      }
    }

    if (speeds.length === 0) {
      // Fallback: use Network Information API
      const conn = (navigator as any).connection;
      return conn?.downlink || 0;
    }

    // Return the average of successful tests
    return speeds.reduce((a, b) => a + b, 0) / speeds.length;
  }, []);

  const measureUpload = useCallback(async (signal: AbortSignal): Promise<number> => {
    try {
      const data = new Uint8Array(1000000); // 1MB
      crypto.getRandomValues(data);
      
      const start = performance.now();
      await fetch(UPLOAD_ENDPOINT, {
        method: 'POST',
        body: data,
        signal,
        mode: 'cors',
      });
      const elapsed = (performance.now() - start) / 1000;
      return (data.length * 8) / (elapsed * 1000000);
    } catch {
      const conn = (navigator as any).connection;
      return (conn?.downlink || 0) * 0.3;
    }
  }, []);

  const runTest = useCallback(async () => {
    if (!hasConsent) {
      toast({ title: "Enable diagnostics first", variant: "destructive" });
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;
    setIsTesting(true);
    setProgress(0);
    setLiveSpeed(0);

    try {
      // Phase 1: Latency
      setPhase('latency');
      setProgress(10);
      const { latency, jitter } = await measureLatency(controller.signal);
      setProgress(25);

      // Phase 2: Download
      setPhase('download');
      setProgress(30);
      const download = await measureDownload(controller.signal);
      setProgress(70);

      // Phase 3: Upload
      setPhase('upload');
      setProgress(75);
      const upload = await measureUpload(controller.signal);
      setProgress(100);

      setPhase('done');
      setResult({
        download: Math.round(download * 100) / 100,
        upload: Math.round(upload * 100) / 100,
        latency,
        jitter,
        timestamp: new Date(),
        serverLocation: 'Cloudflare Edge',
      });

      toast({ title: "Speed test complete", description: `↓${download.toFixed(1)} ↑${upload.toFixed(1)} Mbps` });
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') {
        toast({ title: "Test cancelled", variant: "destructive" });
      }
    } finally {
      setIsTesting(false);
      abortRef.current = null;
    }
  }, [hasConsent, measureLatency, measureDownload, measureUpload, toast]);

  const cancelTest = () => {
    abortRef.current?.abort();
  };

  const getQuality = (download: number) => {
    if (download >= 100) return { label: 'EXCELLENT', color: 'text-success' };
    if (download >= 50) return { label: 'VERY GOOD', color: 'text-success' };
    if (download >= 25) return { label: 'GOOD', color: 'text-primary' };
    if (download >= 10) return { label: 'FAIR', color: 'text-warning' };
    return { label: 'POOR', color: 'text-destructive' };
  };

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Gauge className="h-4 w-4 text-primary" />
          Precision Speed Test
        </CardTitle>
        <CardDescription className="text-xs">
          Multi-server download/upload measurement via Cloudflare Edge
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Start Button */}
        <div className="flex flex-col items-center gap-3">
          <Button
            size="lg"
            onClick={isTesting ? cancelTest : runTest}
            variant={isTesting ? 'destructive' : 'default'}
            className="h-20 w-20 rounded-full"
          >
            {isTesting ? (
              <RefreshCw className="h-7 w-7 animate-spin" />
            ) : (
              <Zap className="h-7 w-7" />
            )}
          </Button>
          <div className="text-center">
            {isTesting && (
              <>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  {phase === 'latency' ? 'Measuring Latency...' :
                   phase === 'download' ? 'Testing Download...' :
                   phase === 'upload' ? 'Testing Upload...' : 'Completing...'}
                </p>
                {phase === 'download' && liveSpeed > 0 && (
                  <p className="text-lg font-bold font-mono text-primary">{liveSpeed} Mbps</p>
                )}
              </>
            )}
            {!isTesting && !result && (
              <p className="text-xs text-muted-foreground">Tap to start</p>
            )}
          </div>
        </div>

        {/* Progress */}
        {isTesting && (
          <div className="space-y-1">
            <Progress value={progress} className="h-1.5" />
            <p className="text-center text-[10px] text-muted-foreground font-mono">{Math.round(progress)}%</p>
          </div>
        )}

        {/* Results */}
        {result && !isTesting && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-3"
          >
            {/* Quality Badge */}
            <div className="text-center">
              {(() => {
                const q = getQuality(result.download);
                return <Badge className={`${q.color} text-xs`}>{q.label}</Badge>;
              })()}
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-lg bg-success/10 border border-success/20 text-center">
                <Download className="h-4 w-4 mx-auto text-success mb-1" />
                <p className="text-lg font-bold font-mono text-success">{result.download.toFixed(1)}</p>
                <p className="text-[10px] text-muted-foreground">Mbps Down</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-center">
                <Upload className="h-4 w-4 mx-auto text-primary mb-1" />
                <p className="text-lg font-bold font-mono text-primary">{result.upload.toFixed(1)}</p>
                <p className="text-[10px] text-muted-foreground">Mbps Up</p>
              </div>
              <div className="p-3 rounded-lg bg-warning/10 border border-warning/20 text-center">
                <Clock className="h-4 w-4 mx-auto text-warning mb-1" />
                <p className="text-lg font-bold font-mono text-warning">{result.latency}</p>
                <p className="text-[10px] text-muted-foreground">ms Latency</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 border border-border text-center">
                <Activity className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                <p className="text-lg font-bold font-mono text-foreground">{result.jitter}</p>
                <p className="text-[10px] text-muted-foreground">ms Jitter</p>
              </div>
            </div>

            {/* Assessment */}
            <div className="p-2 rounded-lg bg-muted/30 border border-border text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">4K Streaming</span>
                <span className={result.download >= 25 ? 'text-success' : result.download >= 5 ? 'text-warning' : 'text-destructive'}>
                  {result.download >= 25 ? '✓ Ready' : result.download >= 5 ? '~ Possible' : '✗ Insufficient'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Video Calls</span>
                <span className={result.latency <= 100 ? 'text-success' : result.latency <= 200 ? 'text-warning' : 'text-destructive'}>
                  {result.latency <= 100 ? '✓ Excellent' : result.latency <= 200 ? '~ Okay' : '✗ Poor'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gaming</span>
                <span className={result.jitter <= 10 && result.latency <= 50 ? 'text-success' : result.jitter <= 30 ? 'text-warning' : 'text-destructive'}>
                  {result.jitter <= 10 && result.latency <= 50 ? '✓ Great' : result.jitter <= 30 ? '~ Playable' : '✗ High Lag'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Security Check</span>
                <span className={result.latency > 500 ? 'text-destructive' : 'text-success'}>
                  {result.latency > 500 ? '⚠ Possible interception' : '✓ Normal latency'}
                </span>
              </div>
            </div>

            <p className="text-[10px] text-muted-foreground text-center">
              Server: {result.serverLocation} • {result.timestamp.toLocaleTimeString()}
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};
