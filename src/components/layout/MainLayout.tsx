import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-background bg-grid">
      <Sidebar />
      <motion.main
        initial={{ marginLeft: 260 }}
        animate={{ marginLeft: 260 }}
        className="min-h-screen"
      >
        {children}
      </motion.main>
    </div>
  );
};
