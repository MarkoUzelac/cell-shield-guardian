import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, Shield, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { NAV_GROUPS, PRIMARY_MOBILE_ITEMS } from './navConfig';
import { LanguageSwitcher } from './LanguageSwitcher';

export const MobileNav = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Close the sheet whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <nav
      className="safe-area-bottom fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-lg lg:hidden"
      aria-label={t('common.moreNavigation')}
    >
      <ul className="flex h-16 items-stretch justify-around px-1">
        {PRIMARY_MOBILE_ITEMS.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <li key={item.to} className="flex-1">
              <NavLink
                to={item.to}
                className={cn(
                  'flex h-full min-h-11 flex-col items-center justify-center gap-1 rounded-lg px-1 transition-colors active:scale-95',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span className="max-w-full truncate text-[10px] font-medium leading-none">
                  {t(item.shortLabelKey)}
                </span>
                <span
                  className={cn('h-0.5 w-5 rounded-full', isActive ? 'bg-primary' : 'bg-transparent')}
                  aria-hidden="true"
                />
              </NavLink>
            </li>
          );
        })}

        <li className="flex-1">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label={t('common.moreNavigation')}
                className="flex h-full min-h-11 w-full flex-col items-center justify-center gap-1 rounded-lg px-1 text-muted-foreground transition-colors active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Menu className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span className="text-[10px] font-medium leading-none">{t('common.more')}</span>
                <span className="h-0.5 w-5" aria-hidden="true" />
              </button>
            </SheetTrigger>

            <SheetContent
              side="bottom"
              className="flex max-h-[88dvh] flex-col rounded-t-2xl border-t border-border bg-background p-0"
            >
              <SheetHeader className="shrink-0 border-b border-border p-4 text-left">
                <div className="flex items-center justify-between gap-3">
                  <SheetTitle className="flex min-w-0 items-center gap-2 text-base">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-primary/40 bg-primary/10">
                      <Shield className="h-4 w-4 text-primary" aria-hidden="true" />
                    </span>
                    <span className="truncate font-display uppercase tracking-tight">
                      {t('common.appShortName')}
                    </span>
                  </SheetTitle>
                  <SheetClose asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-11 w-11 shrink-0"
                      aria-label={t('common.close')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </SheetClose>
                </div>
              </SheetHeader>

              {/* Items first (upper area), destinations reachable by thumb at
                  the bottom via the section switcher below. */}
              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
                <p className="eyebrow pb-2">{t(activeGroup.titleKey)}</p>
                <ul className="grid grid-cols-2 gap-2">
                  {activeGroup.items.map((item) => {
                    const isActive = location.pathname === item.to;
                    return (
                      <li key={item.to}>
                        <NavLink
                          to={item.to}
                          className={cn(
                            'flex h-full min-h-[88px] flex-col justify-between rounded-xl border p-3 transition-colors active:scale-[0.98]',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                            isActive
                              ? 'border-primary/40 bg-primary/10 text-primary'
                              : 'border-border text-foreground'
                          )}
                        >
                          <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                          <span className="mt-2 min-w-0">
                            <span className="block truncate text-sm font-medium">
                              {t(item.labelKey)}
                            </span>
                            <span className="line-clamp-2 text-xs text-muted-foreground">
                              {t(item.descriptionKey)}
                            </span>
                          </span>
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Thumb zone: section switcher + language, pinned to the bottom. */}
              <div className="shrink-0 border-t border-border bg-background p-3 pb-safe">
                <div
                  role="tablist"
                  aria-label={t('common.jumpToSection')}
                  className="grid grid-cols-3 gap-1 rounded-xl border border-border bg-secondary/40 p-1"
                >
                  {NAV_GROUPS.map((group) => {
                    const isSelected = group.id === activeGroup.id;
                    return (
                      <button
                        key={group.id}
                        type="button"
                        role="tab"
                        aria-selected={isSelected}
                        onClick={() => setActiveGroupId(group.id)}
                        className={cn(
                          'min-h-11 rounded-lg px-2 text-xs font-medium uppercase tracking-wide transition-colors active:scale-95',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground'
                        )}
                      >
                        {t(group.titleKey)}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="eyebrow">{t('common.language.label')}</span>
                  <LanguageSwitcher variant="compact" />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </li>
      </ul>
    </nav>
  );
};
