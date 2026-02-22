'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const transition = { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as const };
const stagger = 0.14;

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: stagger, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition },
};

interface HeroAnimatedProps {
  children: React.ReactNode;
  className?: string;
}

export default function HeroAnimated({ children, className }: HeroAnimatedProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <section className={className} style={{ opacity: 0 }} aria-hidden="true">
        {children}
      </section>
    );
  }
  return (
    <motion.section
      className={className}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.section>
  );
}

export function HeroAnimatedItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  );
}
