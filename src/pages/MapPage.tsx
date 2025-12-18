import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { TowerMap } from '@/components/map/TowerMap';
import { TriangulationForm } from '@/components/triangulation/TriangulationForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { CellTower } from '@/types/signal';
import { generateMockCellTowers } from '@/lib/mockData';
import { cn } from '@/lib/utils';

const MapPage = () => {
  const [towers, setTowers] = useState<CellTower[]>([]);
  const [selectedTower, setSelectedTower] = useState<CellTower | null>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);

  useEffect(() => {
    setTowers(generateMockCellTowers(15));
  }, []);

  const handleTriangulation = async (data: {
    mcc: string;
    mnc: string;
    lac: string;
    cellId: string;
  }) => {
    setIsLookingUp(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Add a new tower to the map (mock result)
    const newTower: CellTower = {
      id: `tower-lookup-${Date.now()}`,
      mcc: data.mcc || '310',
      mnc: data.mnc || '410',
      lac: data.lac || '12345',
      cellId: data.cellId || '67890',
      lat: 40.7128 + (Math.random() - 0.5) * 0.05,
      lng: -74.006 + (Math.random() - 0.5) * 0.05,
      signalStrength: -70,
      operator: 'AT&T',
      technology: '4G',
      lastSeen: new Date(),
      isSuspicious: false,
    };
    
    setTowers(prev => [...prev, newTower]);
    setSelectedTower(newTower);
    setIsLookingUp(false);
  };

  const suspiciousTowers = towers.filter(t => t.isSuspicious);
  const verifiedTowers = towers.filter(t => !t.isSuspicious);

  return (
    <MainLayout>
      <Header
        title="Triangulation Map"
        subtitle="Cell tower location mapping and triangulation analysis"
      />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map */}
          <div className="lg:col-span-3 h-[600px]">
            <ErrorBoundary>
              <TowerMap
                towers={towers}
                onTowerClick={setSelectedTower}
                showRangeCircles
              />
            </ErrorBoundary>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Triangulation Form */}
            <TriangulationForm
              onSubmit={handleTriangulation}
              isLoading={isLookingUp}
            />

            {/* Tower Stats */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Detected Towers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <Badge variant="secondary">{towers.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Verified</span>
                  <Badge className="bg-success/20 text-success border-success/30">
                    {verifiedTowers.length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Suspicious</span>
                  <Badge variant="destructive">{suspiciousTowers.length}</Badge>
                </div>
              </CardContent>
            </Card>

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
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span
                        className={cn(
                          'w-2 h-2 rounded-full',
                          selectedTower.isSuspicious ? 'bg-destructive' : 'bg-success'
                        )}
                      />
                      {selectedTower.isSuspicious ? 'Suspicious Tower' : 'Verified Tower'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
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
                      <span className="text-muted-foreground">LAC</span>
                      <span className="font-mono">{selectedTower.lac}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Technology</span>
                      <span className="font-mono">{selectedTower.technology}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Signal</span>
                      <span className="font-mono">{selectedTower.signalStrength} dBm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location</span>
                      <span className="font-mono text-xs">
                        {selectedTower.lat.toFixed(4)}, {selectedTower.lng.toFixed(4)}
                      </span>
                    </div>
                    {selectedTower.suspiciousReason && (
                      <div className="mt-3 p-2 rounded bg-destructive/20 text-destructive text-xs">
                        ⚠️ {selectedTower.suspiciousReason}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default MapPage;
