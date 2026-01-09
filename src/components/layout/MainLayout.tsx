import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { useIsMobile } from '@/hooks/use-mobile';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background bg-grid">
      {/* Desktop Sidebar - hidden on mobile */}
      {!isMobile && <Sidebar />}
      
      {/* Mobile Bottom Nav */}
      <MobileNav />
      
      <motion.main
        initial={false}
        animate={{ marginLeft: isMobile ? 0 : 260 }}
        transition={{ duration: 0.3 }}
        className={`min-h-screen ${isMobile ? 'pb-20' : ''}`}
      >
        {children}
      </motion.main>
    </div>
  );
};
