import { Fragment, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTranslation } from "react-i18next";

import type { RealTower } from "@/lib/realTowers";

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

// Real, OSM-mapped communication mast icon (single neutral style — we have
// no real basis for classifying any tower as "suspicious").
const towerIcon = new L.DivIcon({
  className: '',
  html: `
    <div style="
      width: 12px;
      height: 12px;
      background: hsl(172 66% 50%);
      border: 2px solid hsl(172 66% 70%);
      border-radius: 50%;
      box-shadow: 0 0 6px hsla(172, 66%, 50%, 0.3);
    "></div>
  `,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

interface TowerMapProps {
  towers: RealTower[];
  center?: [number, number];
  zoom?: number;
  onTowerClick?: (tower: RealTower) => void;
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
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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

        {/* Real OSM tower markers */}
        {towers.map((tower) => (
          <Fragment key={tower.id}>
            {showRangeCircles && (
              <Circle
                center={[tower.lat, tower.lng]}
                radius={300}
                pathOptions={{
                  color: "hsl(172 66% 50%)",
                  fillColor: "hsl(172 66% 50%)",
                  fillOpacity: 0.08,
                  weight: 1,
                }}
              />
            )}

            <Marker
              position={[tower.lat, tower.lng]}
              icon={towerIcon}
              eventHandlers={{
                click: () => onTowerClick?.(tower),
              }}
            >
              <Popup>
                <div className="p-2 min-w-[220px]" tabIndex={0} role="region" aria-label={t("components.map.towerMap.towerDetailsAria", { id: tower.id })}>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-semibold">
                      {tower.name ?? t("components.map.towerMap.unknownName")}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("components.map.towerMap.operator")}</span>
                      <span className="font-mono">{tower.operator ?? t("components.map.towerMap.unknownOperator")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("components.map.towerMap.technology")}</span>
                      <span className="font-mono">
                        {tower.technology && tower.technology.length > 0
                          ? tower.technology.join(', ')
                          : t("components.map.towerMap.unknownTechnology")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("components.map.towerMap.type")}</span>
                      <span className="font-mono">{tower.osmType}</span>
                    </div>
                  </div>
                  <p className="mt-2 text-[10px] text-muted-foreground">
                    {t("components.map.towerMap.attribution")}
                  </p>
                </div>
              </Popup>
            </Marker>
          </Fragment>
        ))}
      </MapContainer>
    </div>
  );
};
