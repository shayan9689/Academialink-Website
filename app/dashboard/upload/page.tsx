'use client';

import { useState, useEffect, useRef } from 'react';
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

const MAX_FILE_MB = 50;

export default function UploadPaperPage() {
  const router = useRouter();
  const { profileOpen, setProfileOpen, setSearchOpen, setNotificationsOpen, setSettingsOpen, searchOpen, notificationsOpen, settingsOpen, theme } = useDashboard();
  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [abstract, setAbstract] = useState('');
  const [authors, setAuthors] = useState('');
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleDropzoneClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > MAX_FILE_MB * 1024 * 1024) {
      setError(`File must be under ${MAX_FILE_MB}MB`);
      return;
    }
    if (f.type !== 'application/pdf') {
      setError('Please select a PDF file.');
      return;
    }
    setError(null);
    setFile(f);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const t = title.trim();
    const top = topic.trim();
    if (!t || !top) {
      setError('Title and topic are required.');
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.set('title', t);
      formData.set('topic', top);
      if (abstract.trim()) formData.set('abstract', abstract.trim());
      if (authors.trim()) formData.set('authors', authors.trim());
      formData.set('year', year.trim() || String(new Date().getFullYear()));
      if (file) formData.set('file', file);
      const res = await fetch('/api/papers', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError((data as { error?: string }).error || 'Upload failed');
        setSubmitting(false);
        return;
      }
      router.push('/dashboard/papers');
    } catch {
      setError('Something went wrong');
      setSubmitting(false);
    }
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

              <form className={styles.uploadGrid} onSubmit={handleSubmit}>
                <div>
                  <input
                    id="upload-file-input"
                    type="file"
                    accept=".pdf,application/pdf"
                    className={styles.hiddenInput}
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                  <div
                    className={styles.dropzone}
                    role="button"
                    tabIndex={0}
                    onClick={handleDropzoneClick}
                    onKeyDown={(e) => e.key === 'Enter' && handleDropzoneClick()}
                  >
                    <UploadIcon />
                    <span className={styles.dropzoneTitle}>
                      {file ? file.name : 'Select a Research Paper'}
                    </span>
                    <p className={styles.dropzoneHint}>
                      Click to choose a PDF, or drag and drop. Max {MAX_FILE_MB}MB.
                    </p>
                    <div className={styles.dropzoneTags}>
                      <span className={styles.dropzoneTag}>PDF Only</span>
                      <span className={styles.dropzoneTag}>Max {MAX_FILE_MB}MB</span>
                    </div>
                  </div>

                  <div className={styles.metaSection}>
                    <h3 className={styles.metaTitle}>Paper details</h3>
                    <label className={styles.metaLabel}>
                      Title <span className={styles.required}>*</span>
                      <input type="text" className={styles.metaInput} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Paper title" required />
                    </label>
                    <label className={styles.metaLabel}>
                      Topic / Category <span className={styles.required}>*</span>
                      <input type="text" className={styles.metaInput} value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Computer Science" required />
                    </label>
                    <label className={styles.metaLabel}>
                      Abstract
                      <textarea className={styles.metaTextarea} value={abstract} onChange={(e) => setAbstract(e.target.value)} placeholder="Short abstract (optional)" rows={3} />
                    </label>
                    <label className={styles.metaLabel}>
                      Authors (comma-separated)
                      <input type="text" className={styles.metaInput} value={authors} onChange={(e) => setAuthors(e.target.value)} placeholder="Author One, Author Two" />
                    </label>
                    <label className={styles.metaLabel}>
                      Year
                      <input type="text" className={styles.metaInput} value={year} onChange={(e) => setYear(e.target.value)} placeholder="2024" />
                    </label>
                  </div>

                  {error && <p className={styles.formError} role="alert">{error}</p>}

                  <div className={styles.infoCards}>
                    <div className={styles.infoCard}>
                      <h3 className={styles.infoCardTitle}>Format Requirements</h3>
                      <p className={styles.infoCardText}>Standard A4/Letter sizing, no password protection, embedded fonts.</p>
                    </div>
                    <div className={styles.infoCard}>
                      <h3 className={styles.infoCardTitle}>Submit</h3>
                      <p className={styles.infoCardText}>Ready? Submit your paper to add it to My Papers. PDF is optional.</p>
                      <button type="submit" className={styles.uploadConfirmBtn} disabled={submitting}>
                        {submitting ? 'Submitting…' : 'Submit'}
                      </button>
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
              </form>

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
