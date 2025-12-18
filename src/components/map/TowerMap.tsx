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
