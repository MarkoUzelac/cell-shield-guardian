import { NavLink, useLocation } from 'react-router-dom';
import { 
  Activity, Map, Wifi, AlertTriangle, Settings, Menu, 
  Shield, FileSearch, Info, Radio, X, ChevronRight,
  Bell, Volume2, VolumeX, Power, Crown, Crosshair, ShieldCheck, ListChecks
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';

const mainNavItems = [
  { to: '/', icon: Activity, labelKey: 'nav.homeShort' },
  { to: '/map', icon: Map, labelKey: 'nav.mapShort' },
  { to: '/network', icon: Wifi, labelKey: 'nav.networkShort' },
  { to: '/alerts', icon: AlertTriangle, labelKey: 'nav.alertsShort' },
] as const;

const allNavItems = [
  { to: '/', icon: Activity, labelKey: 'nav.homeLong', descriptionKey: 'nav.homeDescription' },
  { to: '/capabilities', icon: ListChecks, labelKey: 'nav.capabilities', descriptionKey: 'nav.capabilitiesDescription' },
  { to: '/demo', icon: Crosshair, labelKey: 'nav.demo', descriptionKey: 'nav.demoDescription' },
  { to: '/map', icon: Map, labelKey: 'nav.map', descriptionKey: 'nav.mapDescription' },
  { to: '/network', icon: Wifi, labelKey: 'nav.network', descriptionKey: 'nav.networkDescription' },
  { to: '/protection', icon: ShieldCheck, labelKey: 'nav.protection', descriptionKey: 'nav.protectionDescription' },
  { to: '/metadata', icon: FileSearch, labelKey: 'nav.metadata', descriptionKey: 'nav.metadataDescription' },
  { to: '/alerts', icon: AlertTriangle, labelKey: 'nav.alerts', descriptionKey: 'nav.alertsDescription' },
  { to: '/settings', icon: Settings, labelKey: 'nav.settings', descriptionKey: 'nav.settingsDescription' },
  { to: '/about', icon: Info, labelKey: 'nav.about', descriptionKey: 'nav.aboutDescription' },
] as const;

const quickActions = [
  { icon: Bell, label: 'Notifications', badge: 3 },
  { icon: Volume2, label: 'Sound Alerts' },
];

export const MobileNav = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Close sheet when route changes
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border safe-area-bottom lg:hidden">
        <div className="flex items-center justify-around h-16 px-1">
          {mainNavItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  'flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-xl transition-all min-w-[56px] min-h-[48px] active:scale-95 focus:ring-2 focus:ring-primary',
                  isActive 
                    ? 'text-primary bg-primary/10' 
                    : 'text-muted-foreground hover:text-foreground active:bg-muted/50'
                )}
              >
                <item.icon className={cn('w-5 h-5', isActive && 'text-primary')} />
                <span className="text-[10px] font-medium leading-tight">{t(item.labelKey)}</span>
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-1 w-1 h-1 rounded-full bg-primary"
                  />
                )}
              </NavLink>
            );
          })}
          
          {/* More Menu Trigger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button 
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-xl transition-all min-w-[56px] min-h-[48px] active:scale-95 focus:ring-2 focus:ring-primary",
                  "text-muted-foreground hover:text-foreground active:bg-muted/50"
                )}
                aria-label={t('common.moreNavigation')}
              >
                <Menu className="w-5 h-5" />
                <span className="text-[10px] font-medium leading-tight">{t('common.more')}</span>
              </button>
            </SheetTrigger>
            
            <SheetContent 
              side="bottom" 
              className="h-[85vh] rounded-t-2xl p-0 bg-background border-t border-border"
            >
              {/* Header */}
              <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-lg border-b border-border">
                <SheetHeader className="p-4 pb-3">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="flex items-center gap-2 text-base">
                      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Shield className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="font-semibold">{t('common.appName')}</span>
                        <span className="text-[10px] text-muted-foreground font-normal">v1.0</span>
                      </div>
                    </SheetTitle>
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                        <X className="w-4 h-4" />
                      </Button>
                    </SheetClose>
                  </div>
                </SheetHeader>
                
                {/* Status Bar — only verifiable state */}
                <div className="px-4 pb-3 flex items-center justify-end">
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {currentTime.toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto h-[calc(85vh-120px)] pb-safe">
                {/* Quick Actions */}
                <div className="p-4 pb-2">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2">
                    Quick Actions
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      className="h-auto py-3 px-3 justify-start gap-2 bg-card hover:bg-muted/50"
                    >
                      <div className="w-8 h-8 rounded-lg bg-warning/20 flex items-center justify-center">
                        <Bell className="w-4 h-4 text-warning" />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-xs font-medium">Alerts</span>
                        <span className="text-[10px] text-muted-foreground">3 unread</span>
                      </div>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-auto py-3 px-3 justify-start gap-2 bg-card hover:bg-muted/50"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Volume2 className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-xs font-medium">Sound</span>
                        <span className="text-[10px] text-muted-foreground">Enabled</span>
                      </div>
                    </Button>
                  </div>
                </div>

                {/* Pro Upgrade Banner */}
                <div className="px-4 py-2">
                  <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20 border border-primary/30 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <Crown className="w-5 h-5 text-primary shrink-0" />
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground text-sm">Upgrade to Pro</p>
                          <p className="text-[10px] text-muted-foreground">Real-time tower data & advanced alerts</p>
                        </div>
                      </div>
                      <Button size="sm" className="bg-primary hover:bg-primary/90 shrink-0 h-8 text-xs">
                        €9.99/mo
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator className="my-2" />

                {/* Navigation */}
                <div className="p-4 pt-2">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2">
                    Navigation
                  </p>
                  <nav className="space-y-1">
                    {allNavItems.map((item) => {
                      const isActive = location.pathname === item.to;
                      return (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          onClick={() => setOpen(false)}
                          className={cn(
                            'flex items-center gap-3 p-3 rounded-xl transition-all active:scale-[0.98]',
                            isActive 
                              ? 'bg-primary/10 text-primary border border-primary/30' 
                              : 'bg-card text-foreground hover:bg-muted/50 active:bg-muted border border-transparent'
                          )}
                        >
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                            isActive ? "bg-primary/20" : "bg-muted/50"
                          )}>
                            <item.icon className={cn(
                              "w-5 h-5",
                              isActive ? "text-primary" : "text-muted-foreground"
                            )} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className={cn(
                              "text-sm font-medium block",
                              isActive && "text-primary"
                            )}>
                              {t(item.labelKey)}
                            </span>
                            <span className="text-[10px] text-muted-foreground block">
                              {t(item.descriptionKey)}
                            </span>
                          </div>
                          <ChevronRight className={cn(
                            "w-4 h-4 shrink-0",
                            isActive ? "text-primary" : "text-muted-foreground"
                          )} />
                        </NavLink>
                      );
                    })}
                  </nav>
                </div>

                {/* Footer */}
                <div className="p-4 pt-2">
                  <Separator className="mb-4" />
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>{t('common.appName')}</span>
                    <span>Educational Use Only</span>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </>
  );
};
