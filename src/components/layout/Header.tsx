import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, AlertTriangle, Shield, Clock, Menu, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header = ({ title, subtitle }: HeaderProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alertCount, setAlertCount] = useState(3);
  const isMobile = useIsMobile();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4">
        <div className="min-w-0 flex-1">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg sm:text-2xl font-bold text-foreground truncate"
          >
            {title}
          </motion.h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 truncate">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Time Display - Hidden on mobile */}
          {!isMobile && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="font-mono text-sm text-foreground">
                {currentTime.toLocaleTimeString()}
              </span>
            </div>
          )}

          {/* Security Status - Compact on mobile */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg bg-success/10 border border-success/30">
            <Shield className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-success" />
            <span className="text-xs sm:text-sm font-medium text-success hidden xs:inline">Protected</span>
          </div>

          {/* Alerts Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-9 w-9 sm:h-10 sm:w-10">
                <Bell className="w-4 sm:w-5 h-4 sm:h-5" />
                {alertCount > 0 && (
                  <Badge
                    className={cn(
                      'absolute -top-1 -right-1 w-4 sm:w-5 h-4 sm:h-5 p-0 flex items-center justify-center',
                      'bg-destructive text-destructive-foreground text-[10px] sm:text-xs'
                    )}
                  >
                    {alertCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 sm:w-80 bg-popover border border-border z-50">
              <div className="p-3 border-b border-border">
                <span className="font-semibold text-sm">Recent Alerts</span>
              </div>
              <DropdownMenuItem className="p-3 cursor-pointer focus:bg-muted">
                <div className="flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">IMSI Catcher Detected</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-3 cursor-pointer focus:bg-muted">
                <div className="flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Rapid Tower Handover</p>
                    <p className="text-xs text-muted-foreground">5 minutes ago</p>
                  </div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Disclaimer Banner - Collapsible on mobile */}
      <div className="px-3 sm:px-6 py-1.5 sm:py-2 bg-warning/10 border-t border-warning/30">
        <p className="text-[10px] sm:text-xs text-warning flex items-center gap-1.5 sm:gap-2">
          <AlertTriangle className="w-3 sm:w-3.5 h-3 sm:h-3.5 shrink-0" />
          <span className="line-clamp-1 sm:line-clamp-none">
            <strong>Educational Only:</strong>
            <span className="hidden sm:inline"> Active signal interception may be regulated.</span> Use passively on your own networks.
          </span>
        </p>
      </div>
    </header>
  );
};
