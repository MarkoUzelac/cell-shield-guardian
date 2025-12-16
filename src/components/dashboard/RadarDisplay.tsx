import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface RadarDisplayProps {
  isScanning: boolean;
  detectedCount: number;
}

export const RadarDisplay = ({ isScanning, detectedCount }: RadarDisplayProps) => {
  const [blips, setBlips] = useState<{ id: number; angle: number; distance: number }[]>([]);

  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        if (Math.random() > 0.7) {
          const newBlip = {
            id: Date.now(),
            angle: Math.random() * 360,
            distance: 20 + Math.random() * 60,
          };
          setBlips(prev => [...prev.slice(-10), newBlip]);
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isScanning]);

  return (
    <div className="relative w-48 h-48">
      {/* Radar circles */}
      <svg className="w-full h-full" viewBox="0 0 200 200">
        {/* Background circles */}
        {[20, 40, 60, 80].map((r) => (
          <circle
            key={r}
            cx="100"
            cy="100"
            r={r}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="1"
            opacity="0.5"
          />
        ))}
        
        {/* Cross lines */}
        <line x1="100" y1="20" x2="100" y2="180" stroke="hsl(var(--border))" strokeWidth="1" opacity="0.3" />
        <line x1="20" y1="100" x2="180" y2="100" stroke="hsl(var(--border))" strokeWidth="1" opacity="0.3" />
        
        {/* Sweep line */}
        {isScanning && (
          <motion.line
            x1="100"
            y1="100"
            x2="100"
            y2="20"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: '100px 100px' }}
          />
        )}
        
        {/* Sweep gradient */}
        {isScanning && (
          <motion.path
            d="M 100 100 L 100 20 A 80 80 0 0 1 180 100 Z"
            fill="url(#sweepGradient)"
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: '100px 100px' }}
          />
        )}
        
        {/* Blips */}
        {blips.map((blip) => {
          const x = 100 + blip.distance * Math.cos((blip.angle * Math.PI) / 180);
          const y = 100 + blip.distance * Math.sin((blip.angle * Math.PI) / 180);
          return (
            <motion.circle
              key={blip.id}
              cx={x}
              cy={y}
              r="3"
              fill="hsl(var(--primary))"
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 0, scale: 2 }}
              transition={{ duration: 3 }}
            />
          );
        })}
        
        <defs>
          <linearGradient id="sweepGradient" gradientTransform="rotate(90)">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center info */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary font-mono">{detectedCount}</div>
          <div className="text-xs text-muted-foreground">Signals</div>
        </div>
      </div>

      {/* Status indicator */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${isScanning ? 'status-active' : 'bg-muted'}`} />
        <span className="text-xs text-muted-foreground">
          {isScanning ? 'Scanning' : 'Idle'}
        </span>
      </div>
    </div>
  );
};
