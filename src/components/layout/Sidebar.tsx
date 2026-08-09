import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Radio,
  Map,
  FileSearch,
  AlertTriangle,
  Settings,
  Info,
  Shield,
  Activity,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Crosshair,
  ShieldCheck,
  ListChecks,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', icon: Activity, labelKey: 'nav.home' },
  { to: '/capabilities', icon: ListChecks, labelKey: 'nav.capabilities' },
  { to: '/demo', icon: Crosshair, labelKey: 'nav.demo' },
  { to: '/map', icon: Map, labelKey: 'nav.map' },
  { to: '/network', icon: Wifi, labelKey: 'nav.network' },
  { to: '/protection', icon: ShieldCheck, labelKey: 'nav.protection' },
  { to: '/metadata', icon: FileSearch, labelKey: 'nav.metadata' },
  { to: '/alerts', icon: AlertTriangle, labelKey: 'nav.alerts' },
  { to: '/settings', icon: Settings, labelKey: 'nav.settings' },
  { to: '/about', icon: Info, labelKey: 'nav.about' },
] as const;

export const Sidebar = () => {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <motion.aside
      initial={{ width: 260 }}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border z-50 flex flex-col"
    >
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center glow-primary">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col"
              >
                <span className="font-semibold text-foreground">{t('common.appShortName')}</span>
                <span className="text-xs text-muted-foreground">{t('common.appVersion')}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                'flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 min-h-[44px]',
                'hover:bg-sidebar-accent focus:ring-2 focus:ring-primary group',
                isActive && 'bg-sidebar-accent text-primary'
              )}
            >
              <item.icon
                className={cn(
                  'w-5 h-5 transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                )}
              />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className={cn(
                      'text-sm font-medium',
                      isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                    )}
                  >
                    {t(item.labelKey)}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          );
        })}
      </nav>

      {/* Scan Status */}
      <div className="p-3 border-t border-sidebar-border">
        <div className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10',
          collapsed && 'justify-center'
        )}>
          <div className="relative">
            <Radio className="w-5 h-5 text-primary" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-success status-active" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col"
              >
                <span className="text-xs font-medium text-primary">{t('common.localAnalysis')}</span>
                <span className="text-xs text-muted-foreground">{t('common.localAnalysisHint')}</span>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-sidebar-accent border border-sidebar-border flex items-center justify-center hover:bg-primary/20 focus:ring-2 focus:ring-primary transition-colors"
        aria-label={collapsed ? t('common.expandSidebar') : t('common.collapseSidebar')}
      >
        {collapsed ? (
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        )}
      </button>
    </motion.aside>
  );
};
