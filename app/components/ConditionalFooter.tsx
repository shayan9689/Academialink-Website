'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

/**
 * Renders the footer only on non-dashboard pages.
 * Dashboard has its own footer inside the main content column (no sidebar overlay).
 */
export default function ConditionalFooter() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard') ?? false;
  if (isDashboard) return null;
  return <Footer />;
}
