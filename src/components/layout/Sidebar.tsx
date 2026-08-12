import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { NAV_GROUPS } from './navConfig';
import { LanguageSwitcher } from './LanguageSwitcher';

export const Sidebar = () => {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-sidebar-border bg-sidebar"
    >
      {/* Brand */}
      <div className="border-b border-sidebar-border p-4">
        <NavLink
          to="/"
          className="flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-primary/40 bg-primary/10">
            <Shield className="h-5 w-5 text-primary" aria-hidden="true" />
          </span>
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex min-w-0 flex-col"
              >
                <span className="truncate font-display text-sm font-bold uppercase tracking-tight text-foreground">
                  {t('common.appShortName')}
                </span>
                <span className="eyebrow truncate">{t('common.appVersion')}</span>
              </motion.span>
            )}
          </AnimatePresence>
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        {NAV_GROUPS.map((group, groupIndex) => (
          <div key={group.id} className={cn(groupIndex > 0 && 'mt-5')}>
            {!collapsed && <p className="eyebrow px-3 pb-2">{t(group.titleKey)}</p>}
            {collapsed && groupIndex > 0 && <div className="mx-3 mb-2 border-t border-sidebar-border" />}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      title={collapsed ? t(item.labelKey) : undefined}
                      className={cn(
                        'group flex min-h-11 items-center gap-3 rounded-md px-3 py-2 transition-colors',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        isActive
                          ? 'bg-sidebar-accent text-primary'
                          : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'
                      )}
                    >
                      <item.icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                      {!collapsed && (
                        <span className="truncate text-sm font-medium">{t(item.labelKey)}</span>
                      )}
                      {isActive && !collapsed && (
                        <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="space-y-3 border-t border-sidebar-border p-3">
        {!collapsed && (
          <>
            <LanguageSwitcher variant="compact" />
            <div className="px-1">
              <p className="eyebrow-accent">{t('common.localAnalysis')}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{t('common.localAnalysisHint')}</p>
            </div>
          </>
        )}
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          aria-label={collapsed ? t('common.expandSidebar') : t('common.collapseSidebar')}
          className="flex min-h-11 w-full items-center justify-center rounded-md border border-sidebar-border text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </motion.aside>
  );
};
