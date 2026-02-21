'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { EXPLORE_DOCS } from '../data/exploreDocs';
import type { ExploreDoc } from '../data/exploreDocs';
import { isSignedIn as checkSignedIn } from '../lib/authCookie';
import styles from './explore.module.css';

const INITIAL_PAPERS_SHOWN = 2;

export default function ExploreRepositoryContent() {
  const [signedIn, setSignedIn] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastHiding, setToastHiding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewAll, setViewAll] = useState(false);

  useEffect(() => {
    setSignedIn(checkSignedIn());
  }, []);

  useEffect(() => {
    setViewAll(false);
  }, [searchQuery]);

  const showSignInFirst = useCallback(() => {
    setToastVisible(true);
    setToastHiding(false);
  }, []);

  useEffect(() => {
    if (!toastVisible) return;
    const t = setTimeout(() => setToastHiding(true), 1000);
    const t2 = setTimeout(() => {
      setToastVisible(false);
      setToastHiding(false);
    }, 1400);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [toastVisible]);

  const filteredDocs = EXPLORE_DOCS.filter((doc) => {
    const matchSearch = !searchQuery.trim() || doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || doc.topic.toLowerCase().includes(searchQuery.toLowerCase()) || doc.authors.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchSearch;
  });
  const displayedDocs = viewAll ? filteredDocs : filteredDocs.slice(0, INITIAL_PAPERS_SHOWN);
  const hasMore = filteredDocs.length > INITIAL_PAPERS_SHOWN;

  return (
    <>
      <div className={styles.repoHero}>
        <h1 className={styles.repoTitle}>Academic Repository</h1>
        <p className={styles.repoSubtitle}>
          Explore a global network of verified research, peer-reviewed journals, and technical pre-prints.
        </p>
      </div>

      <div className={styles.searchRow}>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon} aria-hidden>⌕</span>
          <input
            id="repo-search"
            type="search"
            className={styles.searchInput}
            placeholder="Search papers by DOI, author, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search papers"
          />
        </div>
        <button type="button" className={styles.searchBtn}>Search</button>
      </div>

      <div className={styles.repoLayout}>
        <aside className={styles.filtersPanel}>
          <div className={styles.filtersHeader}>
            <h2 className={styles.filtersTitle}>Filters</h2>
            <button type="button" className={styles.resetLink}>Reset All</button>
          </div>
          <div className={styles.filterSection}>
            <h3 className={styles.filterSectionTitle}>Publication Date</h3>
            {['Last 30 Days', 'Past Year', 'Past 5 Years', 'Past 10 Years'].map((label) => (
              <label key={label} className={styles.filterCheck}>
                <input type="checkbox" /> <span>{label}</span>
              </label>
            ))}
          </div>
          <div className={styles.filterSection}>
            <h3 className={styles.filterSectionTitle}>Access Type</h3>
            {['Open Access', 'Institutional', 'Premium Only'].map((label) => (
              <label key={label} className={styles.filterCheck}>
                <input type="checkbox" /> <span>{label}</span>
              </label>
            ))}
          </div>
          <div className={styles.filterSection}>
            <h3 className={styles.filterSectionTitle}>Status</h3>
            <label className={styles.filterCheck}>
              <input type="checkbox" defaultChecked /> <span>Peer Reviewed Only</span>
            </label>
            <label className={styles.filterCheck}>
              <input type="checkbox" /> <span>Include Pre-prints</span>
            </label>
          </div>
        </aside>

        <div className={styles.papersCol}>
          <div className={styles.papersGrid}>
            {filteredDocs.length === 0 ? (
              <p className={styles.emptyState}>No papers match your filters.</p>
            ) : (
              displayedDocs.map((doc: ExploreDoc) => (
                <article key={doc.id} className={styles.paperCard}>
                  <div className={styles.paperCardBody}>
                    {signedIn ? (
                      <Link href={`/explore/doc/${doc.id}`} className={styles.paperCardLink}>
                        <h3 className={styles.paperCardTitle}>{doc.title}</h3>
                      </Link>
                    ) : (
                      <button type="button" className={styles.paperCardLinkBtn} onClick={showSignInFirst}>
                        <h3 className={styles.paperCardTitle}>{doc.title}</h3>
                      </button>
                    )}
                    <p className={styles.paperCardMeta}>{doc.authors.join(', ')} · {doc.topic} · {doc.year}</p>
                    <p className={styles.paperCardAbstract}>{doc.abstract}</p>
                  </div>
                </article>
              ))
            )}
          </div>
          {hasMore && (
            <div className={styles.viewAllWrap}>
              <button
                type="button"
                className={styles.viewAllBtn}
                onClick={() => setViewAll(!viewAll)}
              >
                {viewAll ? 'Show less' : 'View all'}
              </button>
            </div>
          )}
        </div>
      </div>

      {toastVisible && (
        <div
          className={`${styles.signInToast} ${toastHiding ? styles.signInToastHide : ''}`}
          role="status"
          aria-live="polite"
        >
          Sign in first
        </div>
      )}
    </>
  );
}
