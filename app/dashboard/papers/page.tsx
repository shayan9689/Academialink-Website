'use client';

import { useState, useEffect } from 'react';
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
import PaperActionsModal, { type PaperItem } from '../components/PaperActionsModal';
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
function MoreVerticalIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" /></svg>
  );
}

const initialPapers: PaperItem[] = [
  { id: '1', title: 'Neural Architectures for Decentralized Learning', submitted: 'Oct 12, 2023', status: 'Published', category: 'Computer Science', citations: 124, isPublic: true },
  { id: '2', title: 'Ethical Implications of Generative Models in Academia', submitted: 'Nov 04, 2023', status: 'Peer Review', category: 'Ethics', citations: null, isPublic: false },
  { id: '3', title: 'Optimizing Transformer Latency for Edge Devices', submitted: 'Dec 18, 2023', status: 'Draft', category: 'Hardware', citations: null, isPublic: true },
  { id: '4', title: 'Global Collaboration Networks in 21st Century Physics', submitted: 'Aug 22, 2023', status: 'Published', category: 'Physics', citations: 45, isPublic: true },
];

export default function MyPapersPage() {
  const router = useRouter();
  const { profileOpen, setProfileOpen, setSearchOpen, setNotificationsOpen, setSettingsOpen, searchOpen, notificationsOpen, settingsOpen, theme } = useDashboard();
  const [mounted, setMounted] = useState(false);
  const [papers, setPapers] = useState<PaperItem[]>(initialPapers);
  const [paperActionsPaper, setPaperActionsPaper] = useState<PaperItem | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleRenamePaper(id: string, newTitle: string) {
    setPapers((prev) => prev.map((p) => (p.id === id ? { ...p, title: newTitle } : p)));
  }
  function handleDeletePaper(id: string) {
    setPapers((prev) => prev.filter((p) => p.id !== id));
  }
  function handleToggleVisibility(id: string, isPublic: boolean) {
    setPapers((prev) => prev.map((p) => (p.id === id ? { ...p, isPublic } : p)));
  }

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
            </div>
            <div className={layoutStyles.topBarRight}>
              <button type="button" className={layoutStyles.topBarIconBtn} aria-label="Search" onClick={() => setSearchOpen(true)}><SearchIcon /></button>
              <button type="button" className={layoutStyles.topBarIconBtn} aria-label="Notifications" onClick={() => setNotificationsOpen(true)}><BellIcon /></button>
              <button type="button" className={layoutStyles.topBarIconBtn} aria-label="Settings" onClick={() => setSettingsOpen(true)}><SettingsIcon /></button>
              <Link href="/dashboard/upload" className={layoutStyles.uploadBtn}><UploadIcon /> Upload Paper</Link>
              <div className={layoutStyles.avatarWrap}>
                <button type="button" className={layoutStyles.avatar} onClick={() => setProfileOpen(!profileOpen)} aria-expanded={profileOpen}>DR</button>
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
                  <Link href="/dashboard/papers" className={`${layoutStyles.sidebarLink} ${layoutStyles.sidebarLinkActive}`}><PapersIcon /><span className={layoutStyles.sidebarLinkText}>My Papers</span></Link>
                  <Link href="/dashboard/upload" className={layoutStyles.sidebarLink}><UploadIcon /><span className={layoutStyles.sidebarLinkText}>Upload New</span></Link>
                  <Link href="/explore" className={layoutStyles.sidebarLink}><ExploreIcon /><span className={layoutStyles.sidebarLinkText}>Explore</span></Link>
                </nav>
                <div className={layoutStyles.sidebarBottom} />
              </div>
            </aside>
            <main className={layoutStyles.main}>
              <PageTransition>
              <div className={styles.content}>
                {!mounted ? (
                  <div className={layoutStyles.dashboardLoading} aria-live="polite">Loading…</div>
                ) : (
                <>
                <h1 className={styles.title}>My Research Papers</h1>
                <p className={styles.subtitle}>View and manage all your submissions.</p>
                <div className={styles.headerRow}>
                  <Link href="/dashboard/upload" className={styles.newPaperBtn}>+ New Paper</Link>
                </div>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Paper Title</th>
                        <th>Status</th>
                        <th>Category</th>
                        <th>Citations</th>
                        <th>Visibility</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {papers.map((p) => (
                        <tr key={p.id}>
                          <td>
                            <Link href={`/dashboard/papers/${p.id}`} className={styles.paperTitleLink}>{p.title}</Link>
                            <p className={styles.tableSub}>Submitted: {p.submitted}</p>
                          </td>
                          <td>
                            <span className={`${styles.statusPill} ${p.status === 'Published' ? styles.statusPublished : p.status === 'Peer Review' ? styles.statusReview : styles.statusDraft}`}>{p.status}</span>
                          </td>
                          <td>{p.category}</td>
                          <td>{p.citations ?? '—'}</td>
                          <td>{p.isPublic ? 'Public' : 'Private'}</td>
                          <td>
                            <button type="button" className={styles.actionsBtn} aria-label="More actions" onClick={() => setPaperActionsPaper(p)}><MoreVerticalIcon /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {papers.length === 0 && <p className={styles.empty}>No papers yet. <Link href="/dashboard/upload">Upload your first paper</Link>.</p>}
                </>
                )}
              </div>
              </PageTransition>
            </main>
          </div>
        </div>
      </div>

      {searchOpen && <SearchModal />}
      {notificationsOpen && <NotificationsPanel />}
      {settingsOpen && <SettingsModal />}
      {paperActionsPaper && (
        <PaperActionsModal
          paper={papers.find((p) => p.id === paperActionsPaper.id) ?? paperActionsPaper}
          onClose={() => setPaperActionsPaper(null)}
          onRename={handleRenamePaper}
          onDelete={handleDeletePaper}
          onToggleVisibility={handleToggleVisibility}
        />
      )}
    </>
  );
}
