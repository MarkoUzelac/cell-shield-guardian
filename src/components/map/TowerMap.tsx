import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { CellTower } from '@/types/signal';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom tower icon
const createTowerIcon = (isSuspicious: boolean) => {
  const color = isSuspicious ? '#ef4444' : '#14b8a6';
  return L.divIcon({
    className: 'custom-tower-icon',
    html: `
      <div style="position: relative;">
        <div style="width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: ${color}; box-shadow: 0 0 10px ${color};">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/>
            <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/>
            <circle cx="12" cy="12" r="2"/>
            <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/>
            <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"/>
          </svg>
        </div>
        ${isSuspicious ? '<div style="position: absolute; top: -4px; right: -4px; width: 12px; height: 12px; background: #ef4444; border-radius: 50%; animation: pulse 2s infinite;"></div>' : ''}
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

interface TowerMapProps {
  towers: CellTower[];
  center?: [number, number];
  zoom?: number;
  onTowerClick?: (tower: CellTower) => void;
  showRangeCircles?: boolean;
}

function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

function TowerMarker({ tower, onTowerClick }: { tower: CellTower; onTowerClick?: (tower: CellTower) => void }) {
  return (
    <Marker
      position={[tower.lat, tower.lng]}
      icon={createTowerIcon(tower.isSuspicious)}
      eventHandlers={{
        click: () => onTowerClick?.(tower),
      }}
    >
      <Popup>
        <div style={{ padding: '8px', minWidth: '200px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: tower.isSuspicious ? '#ef4444' : '#22c55e',
              }}
            />
            <span style={{ fontWeight: 600 }}>
              {tower.isSuspicious ? 'Suspicious Tower' : 'Verified Tower'}
            </span>
          </div>
          <div style={{ fontSize: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: '#666' }}>Operator:</span>
              <span style={{ fontFamily: 'monospace' }}>{tower.operator}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: '#666' }}>Cell ID:</span>
              <span style={{ fontFamily: 'monospace' }}>{tower.cellId}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: '#666' }}>MCC/MNC:</span>
              <span style={{ fontFamily: 'monospace' }}>{tower.mcc}/{tower.mnc}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: '#666' }}>LAC:</span>
              <span style={{ fontFamily: 'monospace' }}>{tower.lac}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: '#666' }}>Technology:</span>
              <span style={{ fontFamily: 'monospace' }}>{tower.technology}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#666' }}>Signal:</span>
              <span style={{ fontFamily: 'monospace' }}>{tower.signalStrength} dBm</span>
            </div>
          </div>
          {tower.isSuspicious && tower.suspiciousReason && (
            <div style={{ marginTop: '8px', padding: '8px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '4px', fontSize: '12px', color: '#ef4444' }}>
              ⚠️ {tower.suspiciousReason}
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
}

function TowerCircle({ tower, showRangeCircles }: { tower: CellTower; showRangeCircles: boolean }) {
  if (!showRangeCircles) return null;
  
  const color = tower.isSuspicious ? '#ef4444' : '#14b8a6';
  
  return (
    <Circle
      center={[tower.lat, tower.lng]}
      radius={500}
      pathOptions={{
        color: color,
        fillColor: color,
        fillOpacity: 0.1,
        weight: 1,
      }}
    />
  );
}

export const TowerMap = ({
  towers,
  center = [40.7128, -74.006],
  zoom = 13,
  onTowerClick,
  showRangeCircles = true,
}: TowerMapProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full rounded-xl overflow-hidden border border-border bg-muted flex items-center justify-center">
        <span className="text-muted-foreground">Loading map...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-border">
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full"
        style={{ background: 'hsl(222.2 84% 4.9%)' }}
      >
        <MapUpdater center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {towers.map((tower) => (
          <TowerCircle key={`circle-${tower.id}`} tower={tower} showRangeCircles={showRangeCircles} />
        ))}
        {towers.map((tower) => (
          <TowerMarker key={`marker-${tower.id}`} tower={tower} onTowerClick={onTowerClick} />
        ))}
      </MapContainer>
    </div>
  );
};
