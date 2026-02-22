'use client';

import Link from 'next/link';
import { useDashboard } from '../DashboardContext';
import { LogoIcon, LogoIconDark, SearchIcon, BellIcon } from '../../components/Icons';
import ProfileDropdown from './ProfileDropdown';
import PageTransition from '../../components/PageTransition';
import styles from '../page.module.css';

function DashboardIcon({ active }: { active?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  );
}

function PapersIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <path d="M10 9H8" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function ExploreIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

export type DashboardSection = 'dashboard' | 'papers' | 'upload' | 'explore';

function linkClass(styles: Record<string, string>, section: DashboardSection, active: DashboardSection) {
  return section === active ? `${styles.sidebarLink} ${styles.sidebarLinkActive}` : styles.sidebarLink;
}

export interface DashboardShellProps {
  children: React.ReactNode;
  activeSection: DashboardSection;
}

export default function DashboardShell({ children, activeSection }: DashboardShellProps) {
  const { profileOpen, setProfileOpen, setSearchOpen, setNotificationsOpen, setSettingsOpen, theme } = useDashboard();

  return (
    <div className={styles.dashboardLayout}>
      <header className={styles.headerWrap}>
        <div className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <Link href="/dashboard" className={styles.topBarLogo}>
              {theme === 'dark' ? <LogoIconDark className={styles.topBarLogoIcon} /> : <LogoIcon className={styles.topBarLogoIcon} />}
              <span>AcademiaLink</span>
            </Link>
          </div>
          <div className={styles.topBarRight}>
            <button type="button" className={styles.topBarIconBtn} aria-label="Search" onClick={() => setSearchOpen(true)}>
              <SearchIcon />
            </button>
            <button type="button" className={styles.topBarIconBtn} aria-label="Notifications" onClick={() => setNotificationsOpen(true)}>
              <BellIcon />
            </button>
            <button type="button" className={styles.topBarIconBtn} aria-label="Settings" onClick={() => setSettingsOpen(true)}>
              <SettingsIcon />
            </button>
            <Link href="/dashboard/upload" className={styles.uploadBtn}>
              <UploadIcon />
              Upload Paper
            </Link>
            <div className={styles.avatarWrap}>
              <button type="button" className={styles.avatar} onClick={() => setProfileOpen(!profileOpen)} aria-expanded={profileOpen} aria-haspopup="true">DR</button>
              {profileOpen && <ProfileDropdown onClose={() => setProfileOpen(false)} />}
            </div>
          </div>
        </div>
      </header>

      <div className={styles.page}>
        <div className={styles.dashboardBody}>
          <aside className={styles.sidebar}>
            <div className={styles.sidebarInner}>
              <nav className={styles.sidebarNav}>
                <Link href="/dashboard" className={linkClass(styles, 'dashboard', activeSection)}>
                  <DashboardIcon />
                  <span className={styles.sidebarLinkText}>Dashboard</span>
                </Link>
                <Link href="/dashboard/papers" className={linkClass(styles, 'papers', activeSection)}>
                  <PapersIcon />
                  <span className={styles.sidebarLinkText}>My Papers</span>
                </Link>
                <Link href="/dashboard/upload" className={linkClass(styles, 'upload', activeSection)}>
                  <UploadIcon />
                  <span className={styles.sidebarLinkText}>Upload New</span>
                </Link>
                <Link href="/explore" className={linkClass(styles, 'explore', activeSection)}>
                  <ExploreIcon />
                  <span className={styles.sidebarLinkText}>Explore</span>
                </Link>
              </nav>
              <div className={styles.sidebarBottom} />
            </div>
          </aside>

          <main className={styles.main}>
            <PageTransition>{children}</PageTransition>
          </main>
        </div>
      </div>
    </div>
  );
}
