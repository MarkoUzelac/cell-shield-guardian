import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RadarBlip {
  id: number;
  angle: number;
  distance: number;
  type: 'normal' | 'suspicious' | 'unknown';
  strength: number;
}

interface RadarDisplayProps {
  isScanning: boolean;
  detectedCount: number;
  suspiciousCount?: number;
}

export const RadarDisplay = ({ isScanning, detectedCount, suspiciousCount = 0 }: RadarDisplayProps) => {
  const [blips, setBlips] = useState<RadarBlip[]>([]);
  const [sweepAngle, setSweepAngle] = useState(0);

  const generateBlip = useCallback((): RadarBlip => {
    const isSuspicious = Math.random() > 0.85;
    const isUnknown = !isSuspicious && Math.random() > 0.8;
    return {
      id: Date.now() + Math.random(),
      angle: Math.random() * 360,
      distance: 15 + Math.random() * 65,
      type: isSuspicious ? 'suspicious' : isUnknown ? 'unknown' : 'normal',
      strength: 0.4 + Math.random() * 0.6,
    };
  }, []);

  useEffect(() => {
    if (!isScanning) return;
    const interval = setInterval(() => {
      if (Math.random() > 0.5) {
        setBlips(prev => [...prev.slice(-15), generateBlip()]);
      }
    }, 400);
    return () => clearInterval(interval);
  }, [isScanning, generateBlip]);

  useEffect(() => {
    if (!isScanning) return;
    let raf: number;
    let start: number | null = null;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      setSweepAngle((elapsed / 3000) * 360 % 360);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [isScanning]);

  const getBlipColor = (type: RadarBlip['type']) => {
    switch (type) {
      case 'suspicious': return 'hsl(var(--destructive))';
      case 'unknown': return 'hsl(var(--warning))';
      default: return 'hsl(var(--primary))';
    }
  };

  return (
    <div className="relative w-48 h-48">
      <svg className="w-full h-full" viewBox="0 0 200 200">
        <defs>
          <radialGradient id="radarBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
            <stop offset="100%" stopColor="hsl(var(--background))" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="sweepGrad" gradientTransform={`rotate(${sweepAngle}, 0.5, 0.5)`}>
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Background glow */}
        <circle cx="100" cy="100" r="85" fill="url(#radarBg)" />

        {/* Range rings with labels */}
        {[20, 40, 60, 80].map((r, i) => (
          <g key={r}>
            <circle cx="100" cy="100" r={r} fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.4" />
            <text x="102" y={100 - r + 3} fill="hsl(var(--muted-foreground))" fontSize="5" opacity="0.5">
              {(i + 1) * 500}m
            </text>
          </g>
        ))}

        {/* Crosshairs */}
        <line x1="100" y1="16" x2="100" y2="184" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.25" />
        <line x1="16" y1="100" x2="184" y2="100" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.25" />
        {/* Diagonals */}
        <line x1="43" y1="43" x2="157" y2="157" stroke="hsl(var(--border))" strokeWidth="0.3" opacity="0.15" />
        <line x1="157" y1="43" x2="43" y2="157" stroke="hsl(var(--border))" strokeWidth="0.3" opacity="0.15" />

        {/* Compass labels */}
        <text x="100" y="12" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="6" fontWeight="bold">N</text>
        <text x="100" y="196" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="6">S</text>
        <text x="192" y="103" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="6">E</text>
        <text x="8" y="103" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="6">W</text>

        {/* Sweep cone */}
        {isScanning && (
          <path
            d={`M 100 100 L ${100 + 80 * Math.sin((sweepAngle * Math.PI) / 180)} ${100 - 80 * Math.cos((sweepAngle * Math.PI) / 180)} A 80 80 0 0 0 ${100 + 80 * Math.sin(((sweepAngle - 45) * Math.PI) / 180)} ${100 - 80 * Math.cos(((sweepAngle - 45) * Math.PI) / 180)} Z`}
            fill="hsl(var(--primary))"
            opacity="0.12"
          />
        )}

        {/* Sweep line */}
        {isScanning && (
          <line
            x1="100"
            y1="100"
            x2={100 + 80 * Math.sin((sweepAngle * Math.PI) / 180)}
            y2={100 - 80 * Math.cos((sweepAngle * Math.PI) / 180)}
            stroke="hsl(var(--primary))"
            strokeWidth="1.5"
            opacity="0.8"
          />
        )}

        {/* Blips */}
        <AnimatePresence>
          {blips.map((blip) => {
            const rad = (blip.angle * Math.PI) / 180;
            const x = 100 + blip.distance * Math.sin(rad);
            const y = 100 - blip.distance * Math.cos(rad);
            const color = getBlipColor(blip.type);
            const size = blip.type === 'suspicious' ? 4 : 3;
            return (
              <g key={blip.id}>
                {/* Glow ring for suspicious */}
                {blip.type === 'suspicious' && (
                  <motion.circle
                    cx={x} cy={y} r={8}
                    fill="none" stroke={color} strokeWidth="0.5"
                    initial={{ opacity: 0.8, scale: 0.5 }}
                    animate={{ opacity: 0, scale: 2 }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ transformOrigin: `${x}px ${y}px` }}
                  />
                )}
                <motion.circle
                  cx={x} cy={y} r={size}
                  fill={color}
                  initial={{ opacity: 1 }}
                  animate={{ opacity: blip.strength * 0.8 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 4 }}
                />
              </g>
            );
          })}
        </AnimatePresence>

        {/* Center dot */}
        <circle cx="100" cy="100" r="3" fill="hsl(var(--primary))" opacity="0.9" />
        <circle cx="100" cy="100" r="5" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5" opacity="0.5" />
      </svg>

      {/* Center info overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <div className="text-xl font-bold text-primary font-mono leading-none">{detectedCount}</div>
          <div className="text-[9px] text-muted-foreground uppercase tracking-wider">Signals</div>
          {suspiciousCount > 0 && (
            <div className="text-[9px] text-destructive font-mono mt-0.5">
              {suspiciousCount} threats
            </div>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
        <span className={`w-1.5 h-1.5 rounded-full ${isScanning ? 'bg-primary animate-pulse' : 'bg-muted'}`} />
        <span className="text-[10px] text-muted-foreground font-mono">
          {isScanning ? 'ACTIVE' : 'IDLE'}
        </span>
      </div>
    </div>
  );
};
