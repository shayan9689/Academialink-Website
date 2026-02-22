'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ExploreDoc } from '../../../data/exploreDocs';
import ExplorePageHeader from '../../ExplorePageHeader';
import SubmitPeerReviewModal from '../../../components/SubmitPeerReviewModal';
import { timeAgo } from '../../../lib/utils/timeAgo';
import styles from './doc.module.css';

function formatCitation(doc: ExploreDoc, url: string): string {
  const authors = doc.authors?.length ? doc.authors.join(', ') : 'Unknown';
  return `${authors} (${doc.year}). ${doc.title}. AcademiaLink. Retrieved from ${url}`;
}

type ReviewItem = {
  id: string;
  overall_rating: number;
  rigor: number;
  originality: number;
  clarity: number;
  feedback: string;
  anonymous: boolean;
  created_at: string;
};

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
interface PaperDetailViewProps {
  doc: ExploreDoc;
  /** When set, show an "Edit" action in the sidebar (e.g. for "our" docs from dashboard). */
  editHref?: string;
  /** When set (e.g. from dashboard paper view), fetch PDF URL and show document viewer. */
  paperId?: string;
}

export default function PaperDetailView({ doc, editHref, paperId }: PaperDetailViewProps) {
  const pathname = usePathname();
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(!!paperId);
  const [toast, setToast] = useState<{ message: string } | null>(null);
  const tags = [doc.topic, 'Machine Learning', 'Neural Networks', 'Computational Physics'].filter((t, i, a) => a.indexOf(t) === i);
  const date = `October 24, ${doc.year}`;
  const pageUrl = typeof window !== 'undefined' ? window.location.origin + pathname : '';

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = useCallback((message: string) => {
    setToast({ message });
  }, []);

  const handleDownloadPdf = useCallback(() => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank', 'noopener,noreferrer');
      showToast('Opening PDF…');
    } else if (paperId) {
      if (pdfLoading) showToast('Loading PDF…');
      else showToast('No PDF file for this paper.');
    } else {
      showToast('PDF not available for this document.');
    }
  }, [pdfUrl, paperId, pdfLoading, showToast]);

  const handleCite = useCallback(() => {
    const url = typeof window !== 'undefined' ? window.location.href : pageUrl;
    const citation = formatCitation(doc, url);
    navigator.clipboard.writeText(citation).then(
      () => showToast('Citation copied to clipboard'),
      () => showToast('Could not copy citation')
    );
  }, [doc, pageUrl, showToast]);

  const handleShare = useCallback(() => {
    const url = typeof window !== 'undefined' ? window.location.href : pageUrl;
    const title = doc.title;
    const text = [doc.authors?.join(', '), doc.year, doc.abstract?.slice(0, 160)].filter(Boolean).join('. ');
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title, text, url }).then(
        () => showToast('Shared successfully'),
        () => copyUrlFallback(url, showToast)
      );
    } else {
      copyUrlFallback(url, showToast);
    }
  }, [doc, pageUrl, showToast]);

  function copyUrlFallback(url: string, show: (m: string) => void) {
    navigator.clipboard.writeText(url).then(
      () => show('Link copied to clipboard'),
      () => show('Could not copy link')
    );
  }

  useEffect(() => {
    if (!paperId) return;
    let cancelled = false;
    setPdfLoading(true);
    fetch(`/api/papers/${paperId}/file`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { url?: string } | null) => {
        if (!cancelled && data?.url) setPdfUrl(data.url);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setPdfLoading(false);
      });
    return () => { cancelled = true; };
  }, [paperId]);

  const fetchReviews = useCallback(() => {
    setReviewsLoading(true);
    fetch(`/api/reviews?docId=${encodeURIComponent(doc.id)}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data: ReviewItem[]) => setReviews(Array.isArray(data) ? data : []))
      .catch(() => setReviews([]))
      .finally(() => setReviewsLoading(false));
  }, [doc.id]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  useEffect(() => {
    if (!reviewModalOpen) fetchReviews();
  }, [reviewModalOpen, fetchReviews]);

  return (
    <div className={styles.page}>
      <ExplorePageHeader />

      <div className={styles.body}>
        <aside className={styles.sidebar}>
          <nav className={styles.sidebarNav} aria-label="Main">
            <Link href="/dashboard" className={styles.sidebarLink}>
              <DashboardIcon />
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
            <Link href="/explore" className={`${styles.sidebarLink} ${styles.sidebarLinkActive}`}>
              <ExploreIcon />
              <span className={styles.sidebarLinkText}>Explore</span>
            </Link>
          </nav>
        </aside>

        <main className={styles.main}>
          <p className={styles.breadcrumb}>{doc.topic} Journal &gt; Review in Progress</p>
          <h1 className={styles.title}>{doc.title}</h1>
          <p className={styles.authors}>{doc.authors.join(', ')}</p>
          <p className={styles.date}>{date}</p>
          <div className={styles.tags}>
            {tags.map((t) => (
              <span key={t} className={styles.tag}>{t}</span>
            ))}
          </div>

          <section className={styles.docContent} aria-label="Document content">
            <h2 className={styles.docContentTitle}>Abstract</h2>
            <div className={styles.viewerContent}>
              <p className={styles.docAbstract}>{doc.abstract || 'No abstract provided.'}</p>
            </div>
          </section>

          {paperId && (
            <div className={styles.viewer}>
              <div className={styles.viewerToolbar}>
                <span className={styles.viewerPagination}>Document</span>
              </div>
              <div className={styles.viewerContent}>
                {pdfLoading && (
                  <p className={styles.viewerPlaceholder}>Loading PDF…</p>
                )}
                {!pdfLoading && pdfUrl && (
                  <iframe
                    src={pdfUrl}
                    title={`PDF: ${doc.title}`}
                    className={styles.pdfFrame}
                  />
                )}
                {!pdfLoading && !pdfUrl && (
                  <p className={styles.viewerPlaceholder}>No PDF file for this paper.</p>
                )}
              </div>
            </div>
          )}

          {!paperId && (
            <div className={styles.viewer}>
              <div className={styles.viewerToolbar}>
                <span className={styles.viewerPagination}>Full text</span>
              </div>
              <div className={styles.viewerContent}>
                <p className={styles.docAbstract}>{doc.abstract || 'No full text available for this document.'}</p>
              </div>
            </div>
          )}

          <div className={styles.reviewDocWrap}>
            <button type="button" className={styles.reviewBtn} onClick={() => setReviewModalOpen(true)}>
              Review this document
            </button>
          </div>

          <SubmitPeerReviewModal
            open={reviewModalOpen}
            onClose={() => setReviewModalOpen(false)}
            paperTitle={doc.title}
            docId={doc.id}
          />

          <section className={styles.reviews}>
            <h2 className={styles.reviewsTitle}>Peer Reviews ({reviews.length})</h2>
            {reviews.length > 0 && (
              <p className={styles.reviewsRating}>
                {(reviews.reduce((a, r) => a + r.overall_rating, 0) / reviews.length).toFixed(1)} average rating
              </p>
            )}
            <button type="button" className={styles.addReviewBtn} onClick={() => setReviewModalOpen(true)}>+ Add Review</button>
            {reviewsLoading ? (
              <p className={styles.reviewComment} style={{ color: '#94a3b8' }}>Loading reviews…</p>
            ) : reviews.length === 0 ? (
              <p className={styles.reviewComment} style={{ color: '#94a3b8' }}>No reviews yet. Be the first to submit a review.</p>
            ) : (
              <ul className={styles.reviewList}>
                {reviews.map((r) => (
                  <li key={r.id} className={styles.reviewItem}>
                    <div className={styles.reviewHeader}>
                      <span className={styles.reviewName}>{r.anonymous ? 'Verified Peer Reviewer' : 'Peer Reviewer'}</span>
                      <span className={styles.reviewStars}>{'★'.repeat(r.overall_rating)}{'☆'.repeat(4 - r.overall_rating)}</span>
                    </div>
                    <p className={styles.reviewComment}>{r.feedback}</p>
                    <span className={styles.reviewHelpful}>{timeAgo(r.created_at)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>

        <aside className={styles.rightSidebar}>
          {toast && (
            <div className={styles.actionToast} role="status" aria-live="polite">
              {toast.message}
            </div>
          )}
          <div className={styles.actions}>
            {editHref && (
              <Link href={editHref} className={styles.downloadBtn}>
                Edit
              </Link>
            )}
            <button type="button" className={styles.downloadBtn} onClick={handleDownloadPdf} disabled={pdfLoading && !!paperId}>
              {pdfLoading && paperId ? 'Loading…' : 'Download PDF'}
            </button>
            <button type="button" className={styles.actionBtn} onClick={handleCite}>Cite</button>
            <button type="button" className={styles.actionBtn} onClick={handleShare}>Share</button>
          </div>
          <p className={styles.stats}>— citations · — views</p>
          <div className={styles.metaBlock}>
            <h3 className={styles.metaTitle}>DOI</h3>
            <p className={styles.metaValue}>—</p>
          </div>
          <div className={styles.metaBlock}>
            <h3 className={styles.metaTitle}>Authors</h3>
            <p className={styles.metaValue}>
              {doc.authors.length ? doc.authors.join(', ') : '—'}
            </p>
          </div>
          <div className={styles.metaBlock}>
            <h3 className={styles.metaTitle}>Abstract</h3>
            <p className={styles.abstractSnippet}>{doc.abstract.slice(0, 120)}…</p>
            <Link href="#abstract" className={styles.readAbstractLink}>Read Full Abstract</Link>
          </div>
          <div className={styles.related}>
            <div className={styles.relatedHeader}>
              <h3 className={styles.relatedTitle}>Related Research</h3>
              <Link href="/explore" className={styles.viewAllLink}>View All</Link>
            </div>
            <ul className={styles.relatedList}>
              <li className={styles.metaValue}>—</li>
            </ul>
          </div>
          <div className={styles.integrityCard}>
            <h3 className={styles.integrityTitle}>Academic Integrity</h3>
            <p className={styles.integrityText}>This work has been peer-reviewed in line with our guidelines.</p>
          </div>
        </aside>
      </div>

      <footer className={styles.footer}>
        <span>© 2024 AcademiaLink. Academic integrity first.</span>
        <nav className={styles.footerNav}>
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/cookies">Cookies</Link>
        </nav>
      </footer>
    </div>
  );
}
