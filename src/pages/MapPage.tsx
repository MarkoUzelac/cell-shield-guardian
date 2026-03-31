import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { TowerMap } from '@/components/map/TowerMap';
import { TriangulationForm } from '@/components/triangulation/TriangulationForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CellTower } from '@/types/signal';
import { generateCellTowersAroundLocation } from '@/lib/mockData';
import { CROATIAN_OPERATORS } from '@/lib/croatianOperators';
import { useGeolocation } from '@/hooks/useGeolocation';
import { cn } from '@/lib/utils';
import { MapPin, Navigation, RefreshCw, Loader2, ChevronDown, Target } from 'lucide-react';

const MapPage = () => {
  const [towers, setTowers] = useState<CellTower[]>([]);
  const [selectedTower, setSelectedTower] = useState<CellTower | null>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [operatorsOpen, setOperatorsOpen] = useState(false);
  const { latitude, longitude, loading: geoLoading, error: geoError, requestLocation, accuracy, hasRealLocation } = useGeolocation();

  // Get map center based on user location
  const mapCenter: [number, number] = [
    latitude || 45.8150,
    longitude || 15.9819
  ];

  // User location for marker
  const userLocation = latitude && longitude ? { lat: latitude, lng: longitude } : null;

  // Generate towers around user location when location is available
  useEffect(() => {
    if (latitude && longitude) {
      setTowers(generateCellTowersAroundLocation(latitude, longitude, 15));
    }
  }, [latitude, longitude]);

  const handleTriangulation = async (data: {
    mcc: string;
    mnc: string;
    lac: string;
    cellId: string;
  }) => {
    setIsLookingUp(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const operator = CROATIAN_OPERATORS.find(op => op.mnc === data.mnc) || CROATIAN_OPERATORS[0];
    
    const newTower: CellTower = {
      id: `tower-lookup-${Date.now()}`,
      mcc: data.mcc || '219',
      mnc: data.mnc || '01',
      lac: data.lac || '12345',
      cellId: data.cellId || '67890',
      lat: (latitude || 45.8150) + (Math.random() - 0.5) * 0.02,
      lng: (longitude || 15.9819) + (Math.random() - 0.5) * 0.02,
      signalStrength: -70,
      operator: operator.name,
      technology: '4G',
      lastSeen: new Date(),
      isSuspicious: false,
    };
    
    setTowers(prev => [...prev, newTower]);
    setSelectedTower(newTower);
    setIsLookingUp(false);
  };

  const handleRefreshTowers = () => {
    if (latitude && longitude) {
      setTowers(generateCellTowersAroundLocation(latitude, longitude, 15));
      setSelectedTower(null);
    }
  };

  const suspiciousTowers = towers.filter(t => t.isSuspicious);
  const verifiedTowers = towers.filter(t => !t.isSuspicious);

  return (
    <MainLayout>
      <Header
        title="Cell Tower Map"
        subtitle="Real-time tower mapping near your location"
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
                    {geoLoading ? 'Detecting...' : 
                     hasRealLocation ? 'Your Exact Location' : 'Default (Zagreb)'}
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
                  <span className="hidden sm:inline">Locate</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefreshTowers}
                  disabled={!latitude}
                  className="flex-1 sm:flex-none h-9"
                >
                  <RefreshCw className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Refresh</span>
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

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Tower Stats */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Detected Towers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between gap-4">
                <div className="text-center flex-1">
                  <p className="text-2xl font-bold">{towers.length}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
                <div className="text-center flex-1">
                  <p className="text-2xl font-bold text-success">{verifiedTowers.length}</p>
                  <p className="text-xs text-muted-foreground">Verified</p>
                </div>
                <div className="text-center flex-1">
                  <p className="text-2xl font-bold text-destructive">{suspiciousTowers.length}</p>
                  <p className="text-xs text-muted-foreground">Suspicious</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Croatian Operators - Collapsible */}
          <Collapsible open={operatorsOpen} onOpenChange={setOperatorsOpen}>
            <Card className="bg-card border-border">
              <CollapsibleTrigger asChild>
                <CardHeader className="pb-2 cursor-pointer hover:bg-muted/50 rounded-t-lg transition-colors">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    Croatian Operators
                    <ChevronDown className={cn(
                      "w-4 h-4 text-muted-foreground transition-transform",
                      operatorsOpen && "rotate-180"
                    )} />
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0 space-y-2">
                  {CROATIAN_OPERATORS.map(op => (
                    <div key={op.mnc} className="flex items-center gap-2 text-xs p-2 rounded bg-muted/30">
                      <div 
                        className="w-3 h-3 rounded-full shrink-0" 
                        style={{ backgroundColor: op.color }}
                      />
                      <span className="font-medium flex-1">{op.name}</span>
                      <span className="text-muted-foreground">MNC: {op.mnc}</span>
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
              <Card className={cn(
                'border',
                selectedTower.isSuspicious
                  ? 'bg-destructive/10 border-destructive/30'
                  : 'bg-card border-border'
              )}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <span
                      className={cn(
                        'w-2 h-2 rounded-full',
                        selectedTower.isSuspicious ? 'bg-destructive' : 'bg-success'
                      )}
                    />
                    {selectedTower.isSuspicious ? 'Suspicious Tower' : 'Verified Tower'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Operator</span>
                    <span className="font-mono">{selectedTower.operator}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cell ID</span>
                    <span className="font-mono">{selectedTower.cellId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">MCC/MNC</span>
                    <span className="font-mono">{selectedTower.mcc}/{selectedTower.mnc}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Technology</span>
                    <Badge variant="secondary" className="text-xs h-5">{selectedTower.technology}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Signal</span>
                    <span className="font-mono">{selectedTower.signalStrength} dBm</span>
                  </div>
                  {selectedTower.suspiciousReason && (
                    <div className="mt-2 p-2 rounded bg-destructive/20 text-destructive">
                      ⚠️ {selectedTower.suspiciousReason}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <Card className="bg-card border-border">
              <CardContent className="p-6 text-center text-muted-foreground">
                <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Tap a tower on the map to view details</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Triangulation Form */}
        <TriangulationForm
          onSubmit={handleTriangulation}
          isLoading={isLookingUp}
        />
      </div>
    </MainLayout>
  );
};

export default MapPage;
