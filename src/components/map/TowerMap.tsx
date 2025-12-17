import { useEffect, useMemo, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CellTower } from '@/types/signal';

// Fix for default marker icons in Leaflet (when using bundlers)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface TowerMapProps {
  towers: CellTower[];
  center?: [number, number];
  zoom?: number;
  onTowerClick?: (tower: CellTower) => void;
  showRangeCircles?: boolean;
}

function getCssColor(variable: string, fallback: string) {
  if (typeof window === 'undefined') return fallback;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  return raw ? `hsl(${raw})` : fallback;
}

function towerPopupHtml(tower: CellTower) {
  const title = tower.isSuspicious ? 'Suspicious Tower' : 'Verified Tower';
  return `
    <div class="tower-popup">
      <div class="tower-popup__header">
        <span class="tower-popup__dot ${tower.isSuspicious ? 'tower-popup__dot--danger' : 'tower-popup__dot--success'}"></span>
        <span class="tower-popup__title">${title}</span>
      </div>

      <div class="tower-popup__rows">
        <div class="tower-popup__row"><span>Operator:</span><span class="tower-popup__mono">${tower.operator}</span></div>
        <div class="tower-popup__row"><span>Cell ID:</span><span class="tower-popup__mono">${tower.cellId}</span></div>
        <div class="tower-popup__row"><span>MCC/MNC:</span><span class="tower-popup__mono">${tower.mcc}/${tower.mnc}</span></div>
        <div class="tower-popup__row"><span>LAC:</span><span class="tower-popup__mono">${tower.lac}</span></div>
        <div class="tower-popup__row"><span>Tech:</span><span class="tower-popup__mono">${tower.technology}</span></div>
        <div class="tower-popup__row"><span>Signal:</span><span class="tower-popup__mono">${tower.signalStrength} dBm</span></div>
      </div>

      ${tower.isSuspicious && tower.suspiciousReason ? `<div class="tower-popup__warn">⚠️ ${tower.suspiciousReason}</div>` : ''}
    </div>
  `;
}

export const TowerMap = ({
  towers,
  center = [40.7128, -74.006],
  zoom = 13,
  onTowerClick,
  showRangeCircles = true,
}: TowerMapProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layersRef = useRef<L.LayerGroup | null>(null);

  const colors = useMemo(() => {
    const primary = getCssColor('--primary', 'hsl(172 66% 50%)');
    const destructive = getCssColor('--destructive', 'hsl(0 72% 51%)');
    return { primary, destructive };
  }, []);

  // init map
  useEffect(() => {
    if (!containerRef.current) return;
    if (mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: true,
      attributionControl: true,
    }).setView(center, zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const group = L.layerGroup().addTo(map);

    mapRef.current = map;
    layersRef.current = group;

    return () => {
      group.clearLayers();
      map.remove();
      mapRef.current = null;
      layersRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // update view
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setView(center, zoom);
  }, [center, zoom]);

  // update towers
  useEffect(() => {
    const map = mapRef.current;
    const group = layersRef.current;
    if (!map || !group) return;

    group.clearLayers();

    towers.forEach((tower) => {
      const color = tower.isSuspicious ? colors.destructive : colors.primary;

      if (showRangeCircles) {
        L.circle([tower.lat, tower.lng], {
          radius: 500,
          color,
          fillColor: color,
          fillOpacity: 0.1,
          weight: 1,
        }).addTo(group);
      }

      const marker = L.marker([tower.lat, tower.lng], {
        icon: L.divIcon({
          className: 'tower-marker-wrapper',
          html: `<div class="tower-marker ${tower.isSuspicious ? 'tower-marker--danger' : 'tower-marker--primary'}">` +
            `<svg class="tower-marker__icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">` +
            `<path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/>` +
            `<path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/>` +
            `<circle cx="12" cy="12" r="2"/>` +
            `<path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/>` +
            `<path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"/>` +
            `</svg>` +
            `${tower.isSuspicious ? '<span class="tower-marker__pulse"></span>' : ''}` +
          `</div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        }),
      }).addTo(group);

      marker.bindPopup(towerPopupHtml(tower), { closeButton: true });

      marker.on('click', () => {
        onTowerClick?.(tower);
      });
    });
  }, [towers, showRangeCircles, onTowerClick, colors]);

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-border">
      <div ref={containerRef} className="w-full h-full" aria-label="Cell tower triangulation map" />
    </div>
  );
};
