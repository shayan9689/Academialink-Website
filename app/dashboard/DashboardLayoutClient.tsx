'use client';

import { DashboardProvider } from './DashboardContext';

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardProvider>{children}</DashboardProvider>;
}
