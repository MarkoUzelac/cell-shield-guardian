import { ReactNode, useCallback, useState } from 'react';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { SkipLink } from '@/components/a11y/SkipLink';
import { RouteAnnouncer } from '@/components/a11y/RouteAnnouncer';
import { HtmlLangSync } from '@/components/a11y/HtmlLangSync';
import { KeyboardShortcutsDialog } from '@/components/a11y/KeyboardShortcutsDialog';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

interface MainLayoutProps {
  children: ReactNode;
}

/**
 * Shell layout. Below `lg` the sidebar is replaced by the bottom nav — the
 * breakpoint matches `MobileNav`'s `lg:hidden` so the two can never both show.
 */
export const MainLayout = ({ children }: MainLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  const toggleSidebar = useCallback(() => setCollapsed((prev) => !prev), []);
  const toggleHelp = useCallback(() => setShortcutsOpen((prev) => !prev), []);

  useKeyboardShortcuts({ onToggleHelp: toggleHelp, onToggleSidebar: toggleSidebar });

  return (
    <div className="min-h-dvh bg-background bg-grid">
      <SkipLink />
      <HtmlLangSync />
      <RouteAnnouncer />

      <div className="hidden lg:block">
        <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />
      </div>

      <MobileNav />

      <main
        id="main-content"
        tabIndex={-1}
        className="min-h-dvh w-full pb-20 transition-[padding] duration-250 focus:outline-none lg:pb-0"
        style={{ paddingLeft: 'var(--shell-pad, 0px)' }}
        data-collapsed={collapsed}
      >
        {children}
      </main>

      <KeyboardShortcutsDialog open={shortcutsOpen} onOpenChange={setShortcutsOpen} />

      {/* Desktop-only shell padding, driven by the sidebar width. */}
      <style>{`@media (min-width: 1024px){main{--shell-pad:${collapsed ? 72 : 260}px}}`}</style>
    </div>
  );
};
