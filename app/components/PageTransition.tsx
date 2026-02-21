'use client';

import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const transition = { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const };

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition}
      style={{ minHeight: '100%' }}
    >
      {children}
    </motion.div>
  );
}
