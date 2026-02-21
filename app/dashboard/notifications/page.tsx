'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import layoutStyles from '../page.module.css';
import styles from './page.module.css';
import { LogoIcon, LogoIconDark, SearchIcon, BellIcon } from '../../components/Icons';
import { useDashboard } from '../DashboardContext';
import ProfileDropdown from '../components/ProfileDropdown';
import SearchModal from '../components/SearchModal';
import NotificationsPanel from '../components/NotificationsPanel';
import SettingsModal from '../components/SettingsModal';
import PageTransition from '../../components/PageTransition';

function DashboardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></svg>
  );
}
function PapersIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" /></svg>
  );
}
function UploadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
  );
}
function ExploreIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
  );
}
function SettingsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
  );
}
function SignOutIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
  );
}

const allNotifications = [
  { id: '1', text: 'Dr. Elena Vance reviewed your submission "Ethical Implications of Generative Models".', time: '2 hours ago' },
  { id: '2', text: 'Prof. Marcus J. cited your paper "Neural Architectures for Decentralized Learning".', time: '5 hours ago' },
  { id: '3', text: 'System approved your profile verification.', time: '1 day ago' },
  { id: '4', text: 'New review request for "Optimizing Transformer Latency".', time: '2 days ago' },
  { id: '5', text: 'Your paper was indexed in IEEE.', time: '3 days ago' },
];

export default function NotificationsPage() {
  const router = useRouter();
  const { profileOpen, setProfileOpen, setSearchOpen, setNotificationsOpen, setSettingsOpen, searchOpen, notificationsOpen, settingsOpen, theme } = useDashboard();

  return (
    <>
      <div className={layoutStyles.dashboardLayout}>
        <header className={layoutStyles.headerWrap}>
          <div className={layoutStyles.topBar}>
            <div className={layoutStyles.topBarLeft}>
              <Link href="/dashboard" className={layoutStyles.topBarLogo}>
                {theme === 'dark' ? <LogoIconDark className={layoutStyles.topBarLogoIcon} /> : <LogoIcon className={layoutStyles.topBarLogoIcon} />}
                <span>AcademiaLink</span>
              </Link>
              <nav className={layoutStyles.topBarNav} aria-label="Main">
                <Link href="/explore">Explore</Link>
                <Link href="/explore">Research</Link>
              </nav>
            </div>
            <div className={layoutStyles.topBarRight}>
              <button type="button" className={layoutStyles.topBarIconBtn} aria-label="Search" onClick={() => setSearchOpen(true)}><SearchIcon /></button>
              <button type="button" className={layoutStyles.topBarIconBtn} aria-label="Notifications" onClick={() => setNotificationsOpen(true)}><BellIcon /></button>
              <button type="button" className={layoutStyles.topBarIconBtn} aria-label="Settings" onClick={() => setSettingsOpen(true)}><SettingsIcon /></button>
              <Link href="/dashboard/upload" className={layoutStyles.uploadBtn}><UploadIcon /> Upload Paper</Link>
              <div className={layoutStyles.avatarWrap}>
                <button type="button" className={layoutStyles.avatar} onClick={() => setProfileOpen(!profileOpen)} aria-expanded={profileOpen} aria-haspopup="true">DR</button>
                {profileOpen && <ProfileDropdown onClose={() => setProfileOpen(false)} />}
              </div>
            </div>
          </div>
        </header>
        <div className={layoutStyles.page}>
          <div className={layoutStyles.dashboardBody}>
            <aside className={layoutStyles.sidebar}>
              <div className={layoutStyles.sidebarInner}>
                <nav className={layoutStyles.sidebarNav}>
                  <Link href="/dashboard" className={layoutStyles.sidebarLink}><DashboardIcon /><span className={layoutStyles.sidebarLinkText}>Dashboard</span></Link>
                  <Link href="/dashboard/papers" className={layoutStyles.sidebarLink}><PapersIcon /><span className={layoutStyles.sidebarLinkText}>My Papers</span></Link>
                  <Link href="/dashboard/upload" className={layoutStyles.sidebarLink}><UploadIcon /><span className={layoutStyles.sidebarLinkText}>Upload New</span></Link>
                  <Link href="/explore" className={layoutStyles.sidebarLink}><ExploreIcon /><span className={layoutStyles.sidebarLinkText}>Explore</span></Link>
                </nav>
                <div className={layoutStyles.sidebarBottom}>
                  <Link href="/sign-in" className={`${layoutStyles.sidebarLink} ${layoutStyles.sidebarLinkSignOut}`} onClick={(e) => { e.preventDefault(); router.push('/sign-in'); }}><SignOutIcon /><span className={layoutStyles.sidebarLinkText}>Sign Out</span></Link>
                </div>
              </div>
            </aside>
            <main className={layoutStyles.main}>
              <PageTransition>
              <div className={styles.content}>
                <h1 className={styles.title}>Notifications</h1>
                <p className={styles.subtitle}>Your recent activity and alerts.</p>
                <ul className={styles.list}>
                  {allNotifications.map((n) => (
                    <li key={n.id} className={styles.item}>
                      <p className={styles.text}>{n.text}</p>
                      <span className={styles.time}>{n.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
              </PageTransition>
            </main>
          </div>
        </div>
      </div>

      {searchOpen && <SearchModal />}
      {notificationsOpen && <NotificationsPanel />}
      {settingsOpen && <SettingsModal />}
    </>
  );
}
