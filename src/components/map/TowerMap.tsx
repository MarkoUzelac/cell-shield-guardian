import { Fragment, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import type { CellTower } from "@/types/signal";

// Keep Leaflet marker assets working in Vite builds
const ensureLeafletDefaultIcons = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
};

// Custom user location icon
const userIcon = new L.DivIcon({
  className: 'user-location-marker',
  html: `
    <div style="
      width: 20px;
      height: 20px;
      background: hsl(217.2 91.2% 59.8%);
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      position: relative;
    ">
      <div style="
        position: absolute;
        inset: -8px;
        border: 2px solid hsl(217.2 91.2% 59.8%);
        border-radius: 50%;
        opacity: 0.3;
        animation: pulse 2s infinite;
      "></div>
    </div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

interface TowerMapProps {
  towers: CellTower[];
  center?: [number, number];
  zoom?: number;
  onTowerClick?: (tower: CellTower) => void;
  showRangeCircles?: boolean;
  userLocation?: { lat: number; lng: number } | null;
  showUserLocation?: boolean;
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
  center = [45.8150, 15.9819],
  zoom = 13,
  onTowerClick,
  showRangeCircles = true,
  userLocation,
  showUserLocation = true,
}: TowerMapProps) => {
  useEffect(() => {
    ensureLeafletDefaultIcons();
  }, []);

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-border">
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full"
        style={{ width: "100%", height: "100%", background: "hsl(var(--background))" }}
      >
        <MapUpdater center={center} zoom={zoom} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User Location Marker */}
        {showUserLocation && userLocation && (
          <>
            <Circle
              center={[userLocation.lat, userLocation.lng]}
              radius={50}
              pathOptions={{
                color: "hsl(217.2 91.2% 59.8%)",
                fillColor: "hsl(217.2 91.2% 59.8%)",
                fillOpacity: 0.15,
                weight: 2,
              }}
            />
            <Marker 
              position={[userLocation.lat, userLocation.lng]} 
              icon={userIcon}
            >
              <Popup>
                <div className="p-2 min-w-[180px]">
                  <div className="font-semibold text-primary mb-1">📍 Your Location</div>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Latitude</span>
                      <span className="font-mono">{userLocation.lat.toFixed(6)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Longitude</span>
                      <span className="font-mono">{userLocation.lng.toFixed(6)}</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          </>
        )}

        {towers.map((tower) => (
          <Fragment key={tower.id}>
            {showRangeCircles && (
              <Circle
                center={[tower.lat, tower.lng]}
                radius={500}
                pathOptions={{
                  color: tower.isSuspicious ? "hsl(0 72% 51%)" : "hsl(172 66% 50%)",
                  fillColor: tower.isSuspicious ? "hsl(0 72% 51%)" : "hsl(172 66% 50%)",
                  fillOpacity: 0.1,
                  weight: 1,
                }}
              />
            )}

            <Marker
              position={[tower.lat, tower.lng]}
              eventHandlers={{
                click: () => onTowerClick?.(tower),
              }}
            >
              <Popup>
                <div className="p-2 min-w-[220px]">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-semibold">{tower.operator}</span>
                    <span className={tower.isSuspicious ? "text-destructive" : "text-success"}>
                      {tower.isSuspicious ? "Suspicious" : "Verified"}
                    </span>
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cell ID</span>
                      <span className="font-mono">{tower.cellId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">MCC/MNC</span>
                      <span className="font-mono">
                        {tower.mcc}/{tower.mnc}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">LAC</span>
                      <span className="font-mono">{tower.lac}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Technology</span>
                      <span className="font-mono">{tower.technology}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Signal</span>
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
          </Fragment>
        ))}
      </MapContainer>
    </div>
  );
};
