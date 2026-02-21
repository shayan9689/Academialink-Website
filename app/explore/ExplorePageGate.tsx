'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { isSignedIn as checkSignedIn } from '../lib/authCookie';
import { DashboardProvider, useDashboard } from '../dashboard/DashboardContext';
import DashboardShell from '../dashboard/components/DashboardShell';
import SearchModal from '../dashboard/components/SearchModal';
import NotificationsPanel from '../dashboard/components/NotificationsPanel';
import SettingsModal from '../dashboard/components/SettingsModal';
import ExplorePageHeader from './ExplorePageHeader';
import ExploreRepositoryContent from './ExploreRepositoryContent';
import styles from './explore.module.css';

export default function ExplorePageGate() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSignedIn(checkSignedIn());
  }, []);

  /* Until we know auth, show dashboard shell with loading so signed-in users don't see a flash of "Sign in / Sign up" header on refresh */
  if (!mounted || signedIn === null) {
    return (
      <DashboardProvider>
        <DashboardShell activeSection="explore">
          <div className={styles.exploreContentArea}>
            <div className={styles.exploreLoading} aria-live="polite">
              Loading…
            </div>
          </div>
        </DashboardShell>
        <ExploreModals />
      </DashboardProvider>
    );
  }

  if (!signedIn) {
    return (
      <div className={styles.page}>
        <ExplorePageHeader />
        <main className={styles.main}>
          <div className={styles.loginGate}>
            <p className={styles.loginGateMessage}>Sign in first</p>
            <Link href="/sign-in" className={styles.loginGateLink}>
              Sign in
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <DashboardProvider>
      <DashboardShell activeSection="explore">
        <div className={styles.exploreContentArea}>
          <ExploreRepositoryContent />
        </div>
      </DashboardShell>
      <ExploreModals />
    </DashboardProvider>
  );
}

function ExploreModals() {
  const { searchOpen, notificationsOpen, settingsOpen } = useDashboard();
  return (
    <>
      {searchOpen && <SearchModal />}
      {notificationsOpen && <NotificationsPanel />}
      {settingsOpen && <SettingsModal />}
    </>
  );
}
