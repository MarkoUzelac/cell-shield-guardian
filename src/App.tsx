import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Heavy or secondary routes are split out so the first paint of the main
// diagnostics dashboard does not carry Leaflet, Recharts or the simulation.
const MapPage = lazy(() => import("./pages/MapPage"));
const MetadataPage = lazy(() => import("./pages/MetadataPage"));
const AlertsPage = lazy(() => import("./pages/AlertsPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const NetworkIntelligencePage = lazy(() => import("./pages/NetworkIntelligencePage"));
const TacticalDashboard = lazy(() => import("./pages/TacticalDashboard"));
const ProtectionGuidePage = lazy(() => import("./pages/ProtectionGuidePage"));
const DemoDashboard = lazy(() => import("./pages/DemoDashboard"));

const queryClient = new QueryClient();

const RouteFallback = () => (
  <div className="flex min-h-dvh items-center justify-center p-6">
    <p className="text-sm text-muted-foreground" role="status">
      Loading…
    </p>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/demo" element={<DemoDashboard />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/metadata" element={<MetadataPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/network" element={<NetworkIntelligencePage />} />
            <Route path="/tactical" element={<TacticalDashboard />} />
            <Route path="/protection" element={<ProtectionGuidePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
