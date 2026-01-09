import { NavLink, useLocation } from 'react-router-dom';
import { Activity, Map, Wifi, AlertTriangle, Settings, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Shield, FileSearch, Info } from 'lucide-react';

const mainNavItems = [
  { to: '/', icon: Activity, label: 'Scan' },
  { to: '/map', icon: Map, label: 'Map' },
  { to: '/network', icon: Wifi, label: 'Network' },
  { to: '/alerts', icon: AlertTriangle, label: 'Alerts' },
];

const allNavItems = [
  { to: '/', icon: Activity, label: 'Live Scan' },
  { to: '/map', icon: Map, label: 'Triangulation Map' },
  { to: '/network', icon: Wifi, label: 'Network Intelligence' },
  { to: '/metadata', icon: FileSearch, label: 'Metadata Analyzer' },
  { to: '/alerts', icon: AlertTriangle, label: 'Alerts & Logs' },
  { to: '/settings', icon: Settings, label: 'Settings' },
  { to: '/about', icon: Info, label: 'About' },
];

export const MobileNav = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border safe-area-bottom lg:hidden">
        <div className="flex items-center justify-around h-16 px-2">
          {mainNavItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all min-w-[60px]',
                  isActive 
                    ? 'text-primary bg-primary/10' 
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <item.icon className={cn('w-5 h-5', isActive && 'text-primary')} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </NavLink>
            );
          })}
          
          {/* More Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground min-w-[60px]">
                <Menu className="w-5 h-5" />
                <span className="text-[10px] font-medium">More</span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-auto max-h-[80vh] rounded-t-xl">
              <SheetHeader className="pb-4">
                <SheetTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Privacy Signal Monitor
                </SheetTitle>
              </SheetHeader>
              <nav className="grid grid-cols-2 gap-2 pb-6">
                {allNavItems.map((item) => {
                  const isActive = location.pathname === item.to;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-lg transition-all',
                        isActive 
                          ? 'bg-primary/10 text-primary border border-primary/30' 
                          : 'bg-muted/50 text-foreground hover:bg-muted'
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </>
  );
};
