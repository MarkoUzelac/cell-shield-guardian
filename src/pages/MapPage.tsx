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
import { CellTower } from '@/types/signal';
import { generateCellTowersAroundLocation } from '@/lib/mockData';
import { CROATIAN_OPERATORS } from '@/lib/croatianOperators';
import { useGeolocation } from '@/hooks/useGeolocation';
import { cn } from '@/lib/utils';
import { MapPin, Navigation, RefreshCw, Loader2 } from 'lucide-react';

const MapPage = () => {
  const [towers, setTowers] = useState<CellTower[]>([]);
  const [selectedTower, setSelectedTower] = useState<CellTower | null>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const { latitude, longitude, loading: geoLoading, error: geoError, requestLocation, accuracy, hasRealLocation } = useGeolocation();

  // Get map center based on user location
  const mapCenter: [number, number] = [
    latitude || 45.8150, // Default Zagreb
    longitude || 15.9819
  ];

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
    // Simulate API lookup
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Find operator by MNC or use default
    const operator = CROATIAN_OPERATORS.find(op => op.mnc === data.mnc) || CROATIAN_OPERATORS[0];
    
    // Add a new tower near user's location
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

      <div className="p-3 md:p-6 space-y-4 md:space-y-6">
        {/* Location Status Bar */}
        <Card className="bg-card/50 border-border">
          <CardContent className="p-3 md:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  hasRealLocation ? "bg-success/20" : "bg-warning/20"
                )}>
                  {geoLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  ) : (
                    <MapPin className={cn(
                      "w-5 h-5",
                      hasRealLocation ? "text-success" : "text-warning"
                    )} />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">
                    {geoLoading ? 'Detecting location...' : 
                     hasRealLocation ? 'Your Location' : 'Default Location (Zagreb)'}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono truncate">
                    {latitude?.toFixed(4)}, {longitude?.toFixed(4)}
                    {accuracy && <span className="ml-2">±{Math.round(accuracy)}m</span>}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={requestLocation}
                  disabled={geoLoading}
                  className="flex-1 sm:flex-none"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Locate Me</span>
                  <span className="sm:hidden">Locate</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefreshTowers}
                  disabled={!latitude}
                  className="flex-1 sm:flex-none"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Refresh Towers</span>
                  <span className="sm:hidden">Refresh</span>
                </Button>
              </div>
            </div>
            {geoError && (
              <p className="text-xs text-warning mt-2">⚠️ {geoError} - Using default location</p>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Map - Full width on mobile */}
          <div className="lg:col-span-3 h-[350px] sm:h-[450px] lg:h-[600px] order-2 lg:order-1">
            <ErrorBoundary>
              <TowerMap
                towers={towers}
                center={mapCenter}
                zoom={hasRealLocation ? 14 : 12}
                onTowerClick={setSelectedTower}
                showRangeCircles
              />
            </ErrorBoundary>
          </div>

          {/* Sidebar - Stack on mobile */}
          <div className="space-y-4 md:space-y-6 order-1 lg:order-2">
            {/* Tower Stats - Horizontal on mobile */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2 md:pb-4">
                <CardTitle className="text-base md:text-lg">Detected Towers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                <div className="grid grid-cols-3 lg:grid-cols-1 gap-2 md:gap-4">
                  <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-1">
                    <span className="text-xs md:text-sm text-muted-foreground">Total</span>
                    <Badge variant="secondary" className="text-xs">{towers.length}</Badge>
                  </div>
                  <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-1">
                    <span className="text-xs md:text-sm text-muted-foreground">Verified</span>
                    <Badge className="bg-success/20 text-success border-success/30 text-xs">
                      {verifiedTowers.length}
                    </Badge>
                  </div>
                  <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-1">
                    <span className="text-xs md:text-sm text-muted-foreground">Suspicious</span>
                    <Badge variant="destructive" className="text-xs">{suspiciousTowers.length}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Croatian Operators */}
            <Card className="bg-card border-border hidden lg:block">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Croatian Operators</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {CROATIAN_OPERATORS.map(op => (
                  <div key={op.mnc} className="flex items-center gap-2 text-xs">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: op.color }}
                    />
                    <span className="font-medium">{op.name}</span>
                    <span className="text-muted-foreground ml-auto">MNC: {op.mnc}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Triangulation Form - Hidden on mobile */}
            <div className="hidden lg:block">
              <TriangulationForm
                onSubmit={handleTriangulation}
                isLoading={isLookingUp}
              />
            </div>

            {/* Selected Tower Info */}
            {selectedTower && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className={cn(
                  'border',
                  selectedTower.isSuspicious
                    ? 'bg-destructive/10 border-destructive/30'
                    : 'bg-card border-border'
                )}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <span
                        className={cn(
                          'w-2 h-2 rounded-full',
                          selectedTower.isSuspicious ? 'bg-destructive' : 'bg-success'
                        )}
                      />
                      {selectedTower.isSuspicious ? 'Suspicious Tower' : 'Verified Tower'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1.5 text-xs md:text-sm">
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
                      <span className="font-mono">
                        {selectedTower.mcc}/{selectedTower.mnc}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Technology</span>
                      <span className="font-mono">{selectedTower.technology}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Signal</span>
                      <span className="font-mono">{selectedTower.signalStrength} dBm</span>
                    </div>
                    {selectedTower.suspiciousReason && (
                      <div className="mt-2 p-2 rounded bg-destructive/20 text-destructive text-xs">
                        ⚠️ {selectedTower.suspiciousReason}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>

        {/* Mobile Triangulation Form */}
        <div className="lg:hidden">
          <TriangulationForm
            onSubmit={handleTriangulation}
            isLoading={isLookingUp}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default MapPage;
