import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { CellTower } from '@/types/signal';
import { cn } from '@/lib/utils';
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
  return L.divIcon({
    className: 'custom-tower-icon',
    html: `
      <div class="relative">
        <div class="${cn(
          'w-6 h-6 rounded-full flex items-center justify-center',
          isSuspicious ? 'bg-destructive' : 'bg-primary'
        )}" style="box-shadow: 0 0 10px ${isSuspicious ? 'hsl(0 72% 51%)' : 'hsl(172 66% 50%)'}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/>
            <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/>
            <circle cx="12" cy="12" r="2"/>
            <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/>
            <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"/>
          </svg>
        </div>
        ${isSuspicious ? '<div class="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full animate-pulse"></div>' : ''}
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

const MapUpdater = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

export const TowerMap = ({
  towers,
  center = [40.7128, -74.006],
  zoom = 13,
  onTowerClick,
  showRangeCircles = true,
}: TowerMapProps) => {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-border">
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full"
        style={{ background: 'hsl(var(--background))' }}
      >
        <MapUpdater center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {towers.map((tower) => (
          <div key={tower.id}>
            {/* Range circle */}
            {showRangeCircles && (
              <Circle
                center={[tower.lat, tower.lng]}
                radius={500}
                pathOptions={{
                  color: tower.isSuspicious ? 'hsl(0 72% 51%)' : 'hsl(172 66% 50%)',
                  fillColor: tower.isSuspicious ? 'hsl(0 72% 51%)' : 'hsl(172 66% 50%)',
                  fillOpacity: 0.1,
                  weight: 1,
                }}
              />
            )}

            {/* Tower marker */}
            <Marker
              position={[tower.lat, tower.lng]}
              icon={createTowerIcon(tower.isSuspicious)}
              eventHandlers={{
                click: () => onTowerClick?.(tower),
              }}
            >
              <Popup className="tower-popup">
                <div className="p-2 min-w-[200px]">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={cn(
                        'w-2 h-2 rounded-full',
                        tower.isSuspicious ? 'bg-destructive' : 'bg-success'
                      )}
                    />
                    <span className="font-semibold">
                      {tower.isSuspicious ? 'Suspicious Tower' : 'Verified Tower'}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Operator:</span>
                      <span className="font-mono">{tower.operator}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cell ID:</span>
                      <span className="font-mono">{tower.cellId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">MCC/MNC:</span>
                      <span className="font-mono">{tower.mcc}/{tower.mnc}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">LAC:</span>
                      <span className="font-mono">{tower.lac}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Technology:</span>
                      <span className="font-mono">{tower.technology}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Signal:</span>
                      <span className="font-mono">{tower.signalStrength} dBm</span>
                    </div>
                  </div>
                  {tower.isSuspicious && tower.suspiciousReason && (
                    <div className="mt-2 p-2 bg-destructive/10 rounded text-xs text-destructive">
                      ⚠️ {tower.suspiciousReason}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          </div>
        ))}
      </MapContainer>
    </div>
  );
};
