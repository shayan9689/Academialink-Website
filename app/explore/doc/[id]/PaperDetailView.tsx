'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { ExploreDoc } from '../../../data/exploreDocs';
import ExplorePageHeader from '../../ExplorePageHeader';
import SubmitPeerReviewModal from '../../../components/SubmitPeerReviewModal';
import styles from './doc.module.css';

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
const PLACEHOLDER_DOI = '10.1103/PhysRevX.13.011001';
const PLACEHOLDER_REVIEWS = [
  { name: 'Prof. Robert Chen', affiliation: 'Stanford University', rating: 5, comment: 'Rigorous treatment of variational circuits with clear benchmarks. The comparison table in Section 4 is particularly valuable.' },
  { name: 'Dr. Anjali Rao', affiliation: 'MIT CSAIL', rating: 4.5, comment: 'Strong survey. I would have liked to see more on error mitigation in NISQ devices.' },
];
const PLACEHOLDER_RELATED = [
  'Variational Quantum Eigensolvers in 2024',
  'Entanglement Entropy in Deep Q-Learning',
  'Noisy Intermediate-Scale Quantum Algorithms',
];

interface PaperDetailViewProps {
  doc: ExploreDoc;
  /** When set, show an "Edit" action in the sidebar (e.g. for "our" docs from dashboard). */
  editHref?: string;
}

export default function PaperDetailView({ doc, editHref }: PaperDetailViewProps) {
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const tags = [doc.topic, 'Machine Learning', 'Neural Networks', 'Computational Physics'].filter((t, i, a) => a.indexOf(t) === i);
  const date = `October 24, ${doc.year}`;

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

          <div className={styles.viewer}>
            <div className={styles.viewerToolbar}>
              <span className={styles.viewerPagination}>&lt; Page 1 / 24 &gt;</span>
              <span className={styles.viewerZoom}>− 100% +</span>
            </div>
            <div className={styles.viewerContent}>
              <p className={styles.viewerPlaceholder}>
                [Document viewer – paper content would render here]
              </p>
              <p className={styles.viewerCaption}>[Figure 1: Architectural Diagram of Variational Quantum Circuits]</p>
            </div>
          </div>

          <div className={styles.reviewDocWrap}>
            <button type="button" className={styles.reviewBtn} onClick={() => setReviewModalOpen(true)}>
              Review this document
            </button>
          </div>

          <SubmitPeerReviewModal
            open={reviewModalOpen}
            onClose={() => setReviewModalOpen(false)}
            paperTitle={doc.title}
          />

          <section className={styles.reviews}>
            <h2 className={styles.reviewsTitle}>Peer Reviews (2)</h2>
            <p className={styles.reviewsRating}>4.8 average rating</p>
            <button type="button" className={styles.addReviewBtn}>+ Add Review</button>
            <div className={styles.reviewInput}>
              <textarea placeholder="Write your professional critique or feedback..." rows={3} className={styles.reviewTextarea} />
              <button type="button" className={styles.postFeedbackBtn}>Post Feedback</button>
            </div>
            <ul className={styles.reviewList}>
              {PLACEHOLDER_REVIEWS.map((r, i) => (
                <li key={i} className={styles.reviewItem}>
                  <div className={styles.reviewHeader}>
                    <span className={styles.reviewName}>{r.name}</span>
                    <span className={styles.reviewAffiliation}>{r.affiliation}</span>
                    <span className={styles.reviewStars}>{'★'.repeat(Math.floor(r.rating))}{r.rating % 1 ? '½' : ''}</span>
                  </div>
                  <p className={styles.reviewComment}>{r.comment}</p>
                  <div className={styles.reviewActions}>
                    <button type="button" className={styles.reviewAction}>Reply</button>
                    <span className={styles.reviewHelpful}>Helpful (12)</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </main>

        <aside className={styles.rightSidebar}>
          <div className={styles.actions}>
            {editHref && (
              <Link href={editHref} className={styles.downloadBtn}>
                Edit
              </Link>
            )}
            <button type="button" className={styles.downloadBtn}>Download PDF</button>
            <button type="button" className={styles.actionBtn}>Cite</button>
            <button type="button" className={styles.actionBtn}>Share</button>
            <button type="button" className={styles.actionBtn}>Save to My Library</button>
          </div>
          <p className={styles.stats}>124 citations · 3.8k views</p>
          <div className={styles.metaBlock}>
            <h3 className={styles.metaTitle}>DOI</h3>
            <p className={styles.metaValue}>{PLACEHOLDER_DOI}</p>
          </div>
          <div className={styles.metaBlock}>
            <h3 className={styles.metaTitle}>Affiliations</h3>
            <p className={styles.metaValue}>
              {doc.authors.map((a, i) => (
                <span key={i}>{a} – {['MIT Department of Physics', 'Stanford Institute', 'Harvard Research Lab'][i] || 'Institution'}<br /></span>
              ))}
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
              {PLACEHOLDER_RELATED.map((t, i) => (
                <li key={i}><Link href="/explore" className={styles.relatedLink}>{t}</Link></li>
              ))}
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
