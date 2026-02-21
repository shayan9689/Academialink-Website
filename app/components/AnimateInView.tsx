'use client';

import { motion, type Variants } from 'framer-motion';

const defaultVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const defaultTransition = { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const };

type Element = 'div' | 'section' | 'article' | 'aside' | 'header' | 'footer';

interface AnimateInViewProps {
  children: React.ReactNode;
  as?: Element;
  className?: string;
  id?: string;
  /** Delay before animation starts (seconds) */
  delay?: number;
  /** Custom Y offset when hidden (default 24) */
  y?: number;
  /** Reduce motion: skip animation */
  reduceMotion?: boolean;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

export default function AnimateInView({
  children,
  as = 'div',
  className,
  id,
  delay = 0,
  y = 24,
  reduceMotion = false,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
}: AnimateInViewProps) {
  const Component = motion[as];
  const variants: Variants = {
    hidden: { opacity: 0, y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { ...defaultTransition, delay },
    },
  };

  return (
    <Component
      className={className}
      id={id}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -80px 0px', amount: 0.2 }}
      variants={reduceMotion ? undefined : variants}
      transition={defaultTransition}
    >
      {children}
    </Component>
  );
}
