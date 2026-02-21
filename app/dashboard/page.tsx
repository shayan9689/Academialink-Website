'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { LogoIcon, LogoIconDark, SearchIcon, BellIcon } from '../components/Icons';
import { useDashboard } from './DashboardContext';
import ProfileDropdown from './components/ProfileDropdown';
import SearchModal from './components/SearchModal';
import NotificationsPanel from './components/NotificationsPanel';
import SettingsModal from './components/SettingsModal';
import PaperActionsModal, { type PaperItem } from './components/PaperActionsModal';
import PageTransition from '../components/PageTransition';

function DashboardIcon({ active }: { active?: boolean }) {
  const color = active ? 'currentColor' : 'currentColor';
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" aria-hidden>
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

function SignOutIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

function BarChartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function MoreVerticalIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <circle cx="12" cy="5" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="12" cy="19" r="1.5" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

const initialPapers = [
  { id: '1', title: 'Neural Architectures for Decentralized Learning', submitted: 'Oct 12, 2023', status: 'Published', category: 'Computer Science', citations: 124, isPublic: true },
  { id: '2', title: 'Ethical Implications of Generative Models in Academia', submitted: 'Nov 04, 2023', status: 'Peer Review', category: 'Ethics', citations: null, isPublic: false },
  { id: '3', title: 'Optimizing Transformer Latency for Edge Devices', submitted: 'Dec 18, 2023', status: 'Draft', category: 'Hardware', citations: null, isPublic: true },
  { id: '4', title: 'Global Collaboration Networks in 21st Century Physics', submitted: 'Aug 22, 2023', status: 'Published', category: 'Physics', citations: 45, isPublic: true },
];

const activities = [
  { text: 'Dr. Elena Vance reviewed your submission "Ethical Implications of Generative Models".', time: '2 hours ago' },
  { text: 'Prof. Marcus J. cited your paper "Neural Architectures for Decentralized Learning".', time: '5 hours ago' },
  { text: 'System approved your profile verification.', time: '1 day ago' },
];

export default function DashboardPage() {
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
              <Link href="/dashboard" className={`${styles.sidebarLink} ${styles.sidebarLinkActive}`}>
                <DashboardIcon active />
                <span className={styles.sidebarLinkText}>Dashboard</span>
              </Link>
              <Link href="/dashboard/papers" className={styles.sidebarLink}>
                <PapersIcon />
                <span className={styles.sidebarLinkText}>My Papers</span>
              </Link>
              <Link href="/dashboard/upload" className={styles.sidebarLink}>
                <UploadIcon />
                <span className={styles.sidebarLinkText}>Upload New</span>
              </Link>
              <Link href="/explore" className={styles.sidebarLink}>
                <ExploreIcon />
                <span className={styles.sidebarLinkText}>Explore</span>
              </Link>
            </nav>
            <div className={styles.sidebarBottom} />
          </div>
        </aside>

        <main className={styles.main}>
        <PageTransition>
        <div className={styles.content}>
          {!mounted ? (
            <div className={styles.dashboardLoading} aria-live="polite">Loading…</div>
          ) : (
          <>
          <div className={styles.welcomeRow}>
            <div>
              <h1 className={styles.welcomeTitle}>Welcome back, Dr.</h1>
              <p className={styles.welcomeSubtitle}>Here&apos;s what&apos;s happening with your research today.</p>
            </div>
            <span className={styles.statusBadge}>
              <span className={styles.statusBadgeDots} aria-hidden />
              2 papers are currently in active peer review.
            </span>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statCardIcon}><StarIcon /></div>
              <p className={styles.statCardValue}>02</p>
              <p className={styles.statCardLabel}>Active Reviews</p>
              <p className={styles.statCardMeta}>Pending your feedback · +1 this week</p>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statCardIcon}><PapersIcon /></div>
              <p className={styles.statCardValue}>14</p>
              <p className={styles.statCardLabel}>My Papers</p>
              <p className={styles.statCardMeta}>Total submissions</p>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statCardIcon}><ChartIcon /></div>
              <p className={styles.statCardValue}>2,481</p>
              <p className={styles.statCardLabel}>Total Citations</p>
              <p className={styles.statCardMeta}>Across all publications · +12% growth</p>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statCardIcon}><BarChartIcon /></div>
              <p className={styles.statCardValue}>18</p>
              <p className={styles.statCardLabel}>H-Index</p>
              <p className={styles.statCardMeta}>Academic impact score</p>
            </div>
          </div>

          <div className={styles.twoCol}>
            <div>
              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <div>
                    <h2 className={styles.sectionTitle}>My Research Papers</h2>
                    <p className={styles.sectionSubtitle}>Manage your uploads and monitor publication status.</p>
                  </div>
                  <Link href="/dashboard/upload" className={styles.newPaperBtn}>
                    <PlusIcon />
                    New Paper
                  </Link>
                </div>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Paper Title</th>
                        <th>Status</th>
                        <th>Category</th>
                        <th>Citations</th>
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
                            <span className={`${styles.statusPill} ${p.status === 'Published' ? styles.statusPublished : p.status === 'Peer Review' ? styles.statusReview : styles.statusDraft}`}>
                              {p.status}
                            </span>
                          </td>
                          <td>{p.category}</td>
                          <td>{p.citations ?? '—'}</td>
                          <td>
                            <button type="button" className={styles.actionsBtn} aria-label="More actions" onClick={() => setPaperActionsPaper(p)}>
                              <MoreVerticalIcon />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Link href="/dashboard/papers" className={styles.viewAllLink}>View All</Link>
              </section>

              <div className={styles.bottomCards}>
                <div className={styles.bottomCard}>
                  <h3 className={styles.bottomCardTitle}>
                    <CheckCircleIcon />
                    Ready for Final Submission
                  </h3>
                  <p className={styles.bottomCardTitle} style={{ fontWeight: 400, fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>These papers have completed all peer review stages.</p>
                  <div className={styles.bottomCardItem}>
                    <span className={styles.bottomCardItemTitle}>Quantum entanglement in nei...</span>
                    <button type="button" className={styles.bottomCardIconBtn} aria-label="Dismiss"><XIcon /></button>
                  </div>
                </div>
                <div className={styles.bottomCard}>
                  <h3 className={styles.bottomCardTitle}>
                    <ClockIcon />
                    Action Required
                  </h3>
                  <p className={styles.bottomCardTitle} style={{ fontWeight: 400, fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>Your feedback is needed on these assignments.</p>
                  <div className={styles.bottomCardItem}>
                    <span className={styles.bottomCardItemTitle}>Re: Bio-Inspired AI Syster</span>
                    <span className={styles.bottomCardDue}>Due in 24 hours</span>
                    <button type="button" className={styles.bottomCardIconBtn} aria-label="Open"><ArrowRightIcon /></button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className={styles.activityCard}>
                <h3 className={styles.activityCardTitle}>Recent Activity</h3>
                <p className={styles.activityCardSubtitle}>Stay updated with your research network.</p>
                {activities.map((a, i) => (
                  <div key={i} className={styles.activityItem}>
                    <div className={styles.activityAvatar} aria-hidden>{a.text.slice(0, 2).toUpperCase()}</div>
                    <div>
                      <p className={styles.activityText}>{a.text}</p>
                      <span className={styles.activityTime}>{a.time}</span>
                    </div>
                  </div>
                ))}
                <Link href="/dashboard/notifications" className={styles.activityLink}>View All</Link>
              </div>

              <div className={styles.boostCard}>
                <h3 className={styles.boostTitle}>
                  <ChartIcon />
                  Boost your H-Index
                </h3>
                <p className={styles.boostText}>
                  Publish in open-access repositories and optimize your paper metadata to increase discoverability and citation potential.
                </p>
                <Link href="/dashboard/tips" className={styles.boostLink}>Read more tips →</Link>
              </div>
            </div>
          </div>
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
