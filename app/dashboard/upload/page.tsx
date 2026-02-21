'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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

export default function UploadPaperPage() {
  const { profileOpen, setProfileOpen, setSearchOpen, setNotificationsOpen, setSettingsOpen, searchOpen, notificationsOpen, settingsOpen, theme } = useDashboard();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
            <button type="button" className={layoutStyles.topBarIconBtn} aria-label="Search" onClick={() => setSearchOpen(true)}>
              <SearchIcon />
            </button>
            <button type="button" className={layoutStyles.topBarIconBtn} aria-label="Notifications" onClick={() => setNotificationsOpen(true)}>
              <BellIcon />
            </button>
            <button type="button" className={layoutStyles.topBarIconBtn} aria-label="Settings" onClick={() => setSettingsOpen(true)}>
              <SettingsIcon />
            </button>
            <Link href="/dashboard/upload" className={layoutStyles.uploadBtn}>
              <UploadIcon />
              Upload Paper
            </Link>
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
                <Link href="/dashboard" className={layoutStyles.sidebarLink}>
                  <DashboardIcon />
                  <span className={layoutStyles.sidebarLinkText}>Dashboard</span>
                </Link>
                <Link href="/dashboard/papers" className={layoutStyles.sidebarLink}>
                  <PapersIcon />
                  <span className={layoutStyles.sidebarLinkText}>My Papers</span>
                </Link>
                <Link href="/dashboard/upload" className={`${layoutStyles.sidebarLink} ${layoutStyles.sidebarLinkActive}`}>
                  <UploadIcon />
                  <span className={layoutStyles.sidebarLinkText}>Upload New</span>
                </Link>
                <Link href="/explore" className={layoutStyles.sidebarLink}>
                  <ExploreIcon />
                  <span className={layoutStyles.sidebarLinkText}>Explore</span>
                </Link>
              </nav>
            </div>
          </aside>

          <main className={layoutStyles.main}>
            <PageTransition>
            <div className={styles.uploadContent}>
              {!mounted ? (
                <div className={layoutStyles.dashboardLoading} aria-live="polite">Loading…</div>
              ) : (
              <>
              <div className={styles.uploadHead}>
                <div>
                  <h1 className={styles.uploadTitle}>Upload Research Paper</h1>
                  <p className={styles.uploadSubtitle}>Share your work with the global research community and receive structured feedback.</p>
                </div>
              </div>

              <div className={styles.steps}>
                <div className={`${styles.step} ${styles.stepActive}`}>
                  <span className={styles.stepNum}>1</span>
                  <span>Upload PDF</span>
                </div>
              </div>

              <div className={styles.uploadGrid}>
                <div>
                  <div className={styles.dropzone} role="button" tabIndex={0}>
                    <UploadIcon />
                    <span className={styles.dropzoneTitle}>Select a Research Paper</span>
                    <p className={styles.dropzoneHint}>Drag and drop your PDF here, or click to browse files from your computer.</p>
                    <div className={styles.dropzoneTags}>
                      <span className={styles.dropzoneTag}>PDF Only</span>
                      <span className={styles.dropzoneTag}>Max 50MB</span>
                    </div>
                  </div>

                  <div className={styles.infoCards}>
                    <div className={styles.infoCard}>
                      <h3 className={styles.infoCardTitle}>Format Requirements</h3>
                      <p className={styles.infoCardText}>Standard A4/Letter sizing, no password protection, embedded fonts.</p>
                    </div>
                    <div className={styles.infoCard}>
                      <h3 className={styles.infoCardTitle}>Submit</h3>
                      <p className={styles.infoCardText}>Ready? Submit your paper to add it to My Papers.</p>
                      <button type="button" className={styles.uploadConfirmBtn}>Submit</button>
                    </div>
                  </div>
                </div>

                <div className={styles.guidelinesCard}>
                  <h3 className={styles.guidelinesTitle}>Submission Guidelines</h3>
                  <ol className={styles.guidelinesList}>
                    <li>Ensure all co-authors have consented to the submission.</li>
                    <li>Abstracts must be between 150-300 words for optimal indexing.</li>
                    <li>Remove any &quot;Track Changes&quot; or comments from your final PDF.</li>
                  </ol>
                </div>
              </div>

              <p className={styles.legalText}>
                By submitting, you agree to our <Link href="/integrity">Academic Integrity Policy</Link> and <Link href="/license">CC BY 4.0 licensing</Link>.
              </p>
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
    </>
  );
}
