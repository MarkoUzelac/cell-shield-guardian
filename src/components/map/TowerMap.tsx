import { Fragment, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTranslation } from "react-i18next";

import type { CellTower } from "@/types/signal";

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

// Suspicious tower icon (pulsing red)
const createTowerIcon = (isSuspicious: boolean) => new L.DivIcon({
  className: '',
  html: `
    <div style="
      width: ${isSuspicious ? '16px' : '12px'};
      height: ${isSuspicious ? '16px' : '12px'};
      background: ${isSuspicious ? 'hsl(0 72% 51%)' : 'hsl(172 66% 50%)'};
      border: 2px solid ${isSuspicious ? 'hsl(0 72% 70%)' : 'hsl(172 66% 70%)'};
      border-radius: 50%;
      box-shadow: 0 0 ${isSuspicious ? '12px' : '6px'} ${isSuspicious ? 'hsla(0, 72%, 51%, 0.6)' : 'hsla(172, 66%, 50%, 0.3)'};
      ${isSuspicious ? 'animation: pulse 1.5s infinite;' : ''}
    "></div>
  `,
  iconSize: [isSuspicious ? 16 : 12, isSuspicious ? 16 : 12],
  iconAnchor: [isSuspicious ? 8 : 6, isSuspicious ? 8 : 6],
});

const suspiciousIcon = createTowerIcon(true);
const normalIcon = createTowerIcon(false);

interface TowerMapProps {
  towers: CellTower[];
  center?: [number, number];
  zoom?: number;
  onTowerClick?: (tower: CellTower) => void;
  showRangeCircles?: boolean;
  userLocation?: { lat: number; lng: number } | null;
  showUserLocation?: boolean;
  minZoom?: number;
  maxZoom?: number;
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
  minZoom = 3,
  maxZoom = 19,
}: TowerMapProps) => {
  const { t } = useTranslation();
  useEffect(() => {
    ensureLeafletDefaultIcons();
  }, []);

  const sortedTowers = useMemo(() => 
    [...towers].sort((a, b) => (a.isSuspicious ? 1 : 0) - (b.isSuspicious ? 1 : 0)),
    [towers]
  );

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-border">
      <MapContainer
        center={center}
        zoom={zoom}
        minZoom={minZoom}
        maxZoom={maxZoom}
        className="w-full h-full"
        style={{ width: "100%", height: "100%", background: "hsl(var(--background))" }}
        zoomControl={true}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        touchZoom={true}
        dragging={true}
        keyboard={true}
      >
        <MapUpdater center={center} zoom={zoom} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User Location */}
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
            <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
              <Popup>
                <div className="p-2 min-w-[180px]" tabIndex={0} role="region" aria-label={t("components.map.towerMap.yourLocationAria")}>
                  <div className="font-semibold text-primary mb-1">📍 {t("components.map.towerMap.yourLocation")}</div>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("components.map.towerMap.lat")}</span>
                      <span className="font-mono">{userLocation.lat.toFixed(6)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("components.map.towerMap.lng")}</span>
                      <span className="font-mono">{userLocation.lng.toFixed(6)}</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          </>
        )}

        {/* Tower markers */}
        {sortedTowers.map((tower) => (
          <Fragment key={tower.id}>
            {showRangeCircles && (
              <Circle
                center={[tower.lat, tower.lng]}
                radius={tower.isSuspicious ? 300 : 500}
                pathOptions={{
                  color: tower.isSuspicious ? "hsl(0 72% 51%)" : "hsl(172 66% 50%)",
                  fillColor: tower.isSuspicious ? "hsl(0 72% 51%)" : "hsl(172 66% 50%)",
                  fillOpacity: tower.isSuspicious ? 0.15 : 0.08,
                  weight: tower.isSuspicious ? 2 : 1,
                  dashArray: tower.isSuspicious ? "5,5" : undefined,
                }}
              />
            )}

            <Marker
              position={[tower.lat, tower.lng]}
              icon={tower.isSuspicious ? suspiciousIcon : normalIcon}
              eventHandlers={{
                click: () => onTowerClick?.(tower),
              }}
            >
              <Popup>
                <div className="p-2 min-w-[220px]" tabIndex={0} role="region" aria-label={t("components.map.towerMap.towerDetailsAria", { cellId: tower.cellId })}>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-semibold">{tower.operator}</span>
                    <span className={tower.isSuspicious ? "text-destructive font-bold" : "text-success"}>
                      {tower.isSuspicious ? `⚠ ${t("components.map.towerMap.suspicious")}` : `✓ ${t("components.map.towerMap.verified")}`}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("components.map.towerMap.cellId")}</span>
                      <span className="font-mono">{tower.cellId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("components.map.towerMap.mccMnc")}</span>
                      <span className="font-mono">{tower.mcc}/{tower.mnc}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("components.map.towerMap.lac")}</span>
                      <span className="font-mono">{tower.lac}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("components.map.towerMap.technology")}</span>
                      <span className="font-mono">{tower.technology}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("components.map.towerMap.signal")}</span>
                      <span className="font-mono">{tower.signalStrength} dBm</span>
                    </div>
                  </div>
                  {tower.isSuspicious && tower.suspiciousReason && (
                    <div className="mt-2 p-2 bg-destructive/10 rounded text-xs text-destructive font-medium">
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
