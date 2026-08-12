import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { TowerMap } from '@/components/map/TowerMap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { fetchRealTowers, type RealTower } from '@/lib/realTowers';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useCountry } from '@/hooks/useCountry';
import { cn } from '@/lib/utils';
import { MapPin, Navigation, RefreshCw, Loader2, ChevronDown, Target, Radio } from 'lucide-react';

const MapPage = () => {
  const { t } = useTranslation();
  const [towers, setTowers] = useState<RealTower[]>([]);
  const [selectedTower, setSelectedTower] = useState<RealTower | null>(null);
  const [isLoadingTowers, setIsLoadingTowers] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [operatorsOpen, setOperatorsOpen] = useState(false);
  const { latitude, longitude, loading: geoLoading, error: geoError, requestLocation, accuracy, hasRealLocation } = useGeolocation();
  const { country, countryName, loading: countryLoading } = useCountry(latitude, longitude);

  // Get map center based on user location
  const mapCenter: [number, number] = [
    latitude || 45.8150,
    longitude || 15.9819
  ];

  // User location for marker
  const userLocation = latitude && longitude ? { lat: latitude, lng: longitude } : null;

  const loadTowers = useCallback(async (lat: number, lng: number) => {
    setIsLoadingTowers(true);
    setLoadError(null);
    const result = await fetchRealTowers(lat, lng, 3000);
    setTowers(result.towers);
    setLoadError(result.error);
    setIsLoadingTowers(false);
  }, []);

  // Load real towers from OpenStreetMap around the user's location
  useEffect(() => {
    if (latitude && longitude) {
      void loadTowers(latitude, longitude);
    }
  }, [latitude, longitude, loadTowers]);

  const handleRefreshTowers = () => {
    if (latitude && longitude) {
      setSelectedTower(null);
      void loadTowers(latitude, longitude);
    }
  };

  const namedTowers = towers.filter((t) => t.name !== null);
  const towersWithOperator = towers.filter((t) => t.operator !== null);

  return (
    <MainLayout>
      <Header
        title={t('pages.map.headerTitle')}
        subtitle={t('pages.map.headerSubtitle')}
      />

      <div className="p-3 md:p-6 space-y-4">
        {/* Location Status Bar - Compact on mobile */}
        <Card className="bg-card/50 border-border">
          <CardContent className="p-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className={cn(
                  "p-2 rounded-lg shrink-0",
                  hasRealLocation ? "bg-success/20" : "bg-warning/20"
                )}>
                  {geoLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  ) : hasRealLocation ? (
                    <Target className="w-4 h-4 text-success" />
                  ) : (
                    <MapPin className="w-4 h-4 text-warning" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">
                    {geoLoading ? t('pages.map.locationStatus.detecting') :
                     hasRealLocation ? t('pages.map.locationStatus.exactLocation') : t('pages.map.locationStatus.defaultLocation')}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono truncate">
                    {latitude?.toFixed(5)}, {longitude?.toFixed(5)}
                    {accuracy && <span className="ml-1">±{Math.round(accuracy)}m</span>}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={requestLocation}
                  disabled={geoLoading}
                  className="flex-1 sm:flex-none h-9"
                >
                  <Navigation className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">{t('pages.map.locationStatus.locate')}</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefreshTowers}
                  disabled={!latitude || isLoadingTowers}
                  className="flex-1 sm:flex-none h-9"
                >
                  <RefreshCw className={cn("w-4 h-4 sm:mr-2", isLoadingTowers && "animate-spin")} />
                  <span className="hidden sm:inline">{t('pages.map.locationStatus.refresh')}</span>
                </Button>
              </div>
            </div>
            {geoError && (
              <p className="text-xs text-warning mt-2">⚠️ {geoError}</p>
            )}
          </CardContent>
        </Card>

        {/* Map - Full width, taller for better zoom exploration */}
        <div className="h-[350px] sm:h-[450px] lg:h-[550px]">
          <ErrorBoundary>
            <TowerMap
              towers={towers}
              center={mapCenter}
              zoom={hasRealLocation ? 14 : 11}
              onTowerClick={setSelectedTower}
              showRangeCircles
              userLocation={userLocation}
              showUserLocation={hasRealLocation}
              minZoom={3}
              maxZoom={19}
            />
          </ErrorBoundary>
        </div>
        <p className="text-xs text-muted-foreground">{t('pages.map.attribution')}</p>

        {loadError && (
          <Card className="bg-warning/10 border-warning/30">
            <CardContent className="p-3 text-xs text-warning">
              {t('pages.map.loadError', { error: loadError })}
            </CardContent>
          </Card>
        )}

        {!isLoadingTowers && !loadError && towers.length === 0 && latitude && longitude && (
          <Card className="bg-card border-border">
            <CardContent className="p-6 text-center text-muted-foreground">
              <Radio className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">{t('pages.map.towersEmpty.title')}</p>
              <p className="text-xs mt-1">{t('pages.map.towersEmpty.body')}</p>
            </CardContent>
          </Card>
        )}

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Tower Stats */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{t('pages.map.towerStats.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between gap-4">
                <div className="text-center flex-1">
                  <p className="text-2xl font-bold">{towers.length}</p>
                  <p className="text-xs text-muted-foreground">{t('pages.map.towerStats.total')}</p>
                </div>
                <div className="text-center flex-1">
                  <p className="text-2xl font-bold text-primary">{namedTowers.length}</p>
                  <p className="text-xs text-muted-foreground">{t('pages.map.towerStats.named')}</p>
                </div>
                <div className="text-center flex-1">
                  <p className="text-2xl font-bold text-success">{towersWithOperator.length}</p>
                  <p className="text-xs text-muted-foreground">{t('pages.map.towerStats.withOperator')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Local Operators (based on user's country) - Collapsible */}
          <Collapsible open={operatorsOpen} onOpenChange={setOperatorsOpen}>
            <Card className="bg-card border-border">
              <CollapsibleTrigger asChild>
                <CardHeader className="pb-2 cursor-pointer hover:bg-muted/50 rounded-t-lg transition-colors">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      {countryLoading ? t('pages.map.operators.detecting') : t('pages.map.operators.title', { country: country.country })}
                    </span>
                    <ChevronDown className={cn(
                      "w-4 h-4 text-muted-foreground transition-transform",
                      operatorsOpen && "rotate-180"
                    )} />
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0 space-y-2">
                  <p className="text-xs text-muted-foreground pb-1">
                    {t('pages.map.operators.mccLabel', { mcc: country.mcc })}{countryName ? ` · ${countryName}` : ''}
                  </p>
                  {country.operators.map(op => (
                    <div key={op.mnc} className="flex items-center gap-2 text-xs p-2 rounded bg-muted/30">
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: op.color }}
                      />
                      <span className="font-medium flex-1">{op.name}</span>
                      <span className="text-muted-foreground">{t('pages.map.operators.mnc')}: {op.mnc}</span>
                    </div>
                  ))}
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Selected Tower Info */}
          {selectedTower ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Radio className="w-4 h-4 text-primary" />
                    {t('pages.map.selectedTower.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('pages.map.selectedTower.name')}</span>
                    <span className="font-mono">{selectedTower.name ?? t('pages.map.selectedTower.unknownName')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('pages.map.selectedTower.operator')}</span>
                    <span className="font-mono">{selectedTower.operator ?? t('pages.map.selectedTower.unknownOperator')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('pages.map.selectedTower.technology')}</span>
                    <span className="font-mono">
                      {selectedTower.technology && selectedTower.technology.length > 0
                        ? selectedTower.technology.join(', ')
                        : t('pages.map.selectedTower.unknownTechnology')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('pages.map.selectedTower.type')}</span>
                    <span className="font-mono">{selectedTower.osmType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('pages.map.selectedTower.id')}</span>
                    <span className="font-mono">{selectedTower.id}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <Card className="bg-card border-border">
              <CardContent className="p-6 text-center text-muted-foreground">
                <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">{t('pages.map.emptyState')}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default MapPage;
