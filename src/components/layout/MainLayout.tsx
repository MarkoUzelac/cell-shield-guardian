import { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';

interface MainLayoutProps {
  children: ReactNode;
}

/**
 * Shell layout. Below `lg` the sidebar is replaced by the bottom nav — the
 * breakpoint matches `MobileNav`'s `lg:hidden` so the two can never both show.
 */
export const MainLayout = ({ children }: MainLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-dvh bg-background bg-grid">
      <div className="hidden lg:block">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((prev) => !prev)} />
      </div>

      <MobileNav />

      <main
        className="min-h-dvh w-full pb-20 transition-[padding] duration-250 lg:pb-0"
        style={{ paddingLeft: 'var(--shell-pad, 0px)' }}
        data-collapsed={collapsed}
      >
        {children}
      </main>

      {/* Desktop-only shell padding, driven by the sidebar width. */}
      <style>{`@media (min-width: 1024px){main{--shell-pad:${collapsed ? 72 : 260}px}}`}</style>
    </div>
  );
};
