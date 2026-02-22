'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import type { ExploreDoc } from '../data/exploreDocs';
import { useAuthOptional } from '../lib/auth/AuthProvider';
import styles from './explore.module.css';

const INITIAL_PAPERS_SHOWN = 2;

const PUB_DATE_OPTIONS = ['Last 30 Days', 'Past Year', 'Past 5 Years', 'Past 10 Years'] as const;
const ACCESS_TYPE_OPTIONS = ['Open Access', 'Institutional', 'Premium Only'] as const;

type PubDateKey = typeof PUB_DATE_OPTIONS[number];
type ExploreDocWithSource = ExploreDoc & { source?: 'explore' | 'mine' };

function parseYear(year: string): number {
  const n = parseInt(String(year || ''), 10);
  return Number.isNaN(n) ? 0 : n;
}

function passesPublicationDateFilter(doc: ExploreDocWithSource, selected: Set<PubDateKey>): boolean {
  if (selected.size === 0) return true;
  const y = parseYear(doc.year);
  const currentYear = new Date().getFullYear();
  for (const key of Array.from(selected)) {
    switch (key) {
      case 'Last 30 Days':
      case 'Past Year':
        if (y >= currentYear - 1) return true;
        break;
      case 'Past 5 Years':
        if (y >= currentYear - 5) return true;
        break;
      case 'Past 10 Years':
        if (y >= currentYear - 10) return true;
        break;
    }
  }
  return false;
}

function normalizeDoc(d: { id: string; title: string; topic: string; abstract: string; authors?: string[] | null; year: string; source?: 'explore' | 'mine' }): ExploreDocWithSource {
  return {
    id: d.id,
    title: d.title,
    topic: d.topic,
    abstract: d.abstract ?? '',
    authors: Array.isArray(d.authors) ? d.authors : [],
    year: d.year,
    source: d.source ?? 'explore',
  };
}

export default function ExploreRepositoryContent() {
  const auth = useAuthOptional();
  const signedIn = !!auth?.user;
  const [toastVisible, setToastVisible] = useState(false);
  const [toastHiding, setToastHiding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewAll, setViewAll] = useState(false);
  const [docs, setDocs] = useState<ExploreDocWithSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [pubDate, setPubDate] = useState<Set<PubDateKey>>(new Set());
  const [accessTypes, setAccessTypes] = useState<Set<string>>(new Set());
  const [peerReviewedOnly, setPeerReviewedOnly] = useState(true);
  const [includePreprints, setIncludePreprints] = useState(false);

  const togglePubDate = useCallback((label: PubDateKey) => {
    setPubDate((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }, []);

  const toggleAccessType = useCallback((label: string) => {
    setAccessTypes((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }, []);

  const resetFilters = useCallback(() => {
    setPubDate(new Set());
    setAccessTypes(new Set());
    setPeerReviewedOnly(true);
    setIncludePreprints(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setFetchError(null);
    fetch('/api/explore/docs')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load papers');
        return res.json();
      })
      .then((data: unknown[]) => {
        if (cancelled) return;
        setDocs((data ?? []).map((d) => normalizeDoc(d as Parameters<typeof normalizeDoc>[0])));
      })
      .catch((err) => {
        if (!cancelled) setFetchError(err instanceof Error ? err.message : 'Failed to load');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    setViewAll(false);
  }, [searchQuery, pubDate, accessTypes, peerReviewedOnly, includePreprints]);

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

  const filteredDocs = docs.filter((doc) => {
    const matchSearch = !searchQuery.trim() || doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || doc.topic.toLowerCase().includes(searchQuery.toLowerCase()) || doc.authors.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchSearch) return false;
    if (!passesPublicationDateFilter(doc, pubDate)) return false;
    return true;
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
            <button type="button" className={styles.resetLink} onClick={resetFilters}>Reset All</button>
          </div>
          <div className={styles.filterSection}>
            <h3 className={styles.filterSectionTitle}>Publication Date</h3>
            {PUB_DATE_OPTIONS.map((label) => (
              <label key={label} className={styles.filterCheck}>
                <input
                  type="checkbox"
                  checked={pubDate.has(label)}
                  onChange={() => togglePubDate(label)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
          <div className={styles.filterSection}>
            <h3 className={styles.filterSectionTitle}>Access Type</h3>
            {ACCESS_TYPE_OPTIONS.map((label) => (
              <label key={label} className={styles.filterCheck}>
                <input
                  type="checkbox"
                  checked={accessTypes.has(label)}
                  onChange={() => toggleAccessType(label)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
          <div className={styles.filterSection}>
            <h3 className={styles.filterSectionTitle}>Status</h3>
            <label className={styles.filterCheck}>
              <input
                type="checkbox"
                checked={peerReviewedOnly}
                onChange={(e) => setPeerReviewedOnly(e.target.checked)}
              />
              <span>Peer Reviewed Only</span>
            </label>
            <label className={styles.filterCheck}>
              <input
                type="checkbox"
                checked={includePreprints}
                onChange={(e) => setIncludePreprints(e.target.checked)}
              />
              <span>Include Pre-prints</span>
            </label>
          </div>
        </aside>

        <div className={styles.papersCol}>
          <div className={styles.papersGrid}>
            {loading ? (
              <p className={styles.emptyState}>Loading papers…</p>
            ) : fetchError ? (
              <p className={styles.emptyState}>{fetchError}</p>
            ) : filteredDocs.length === 0 ? (
              <p className={styles.emptyState}>No papers match your filters.</p>
            ) : (
              displayedDocs.map((doc: ExploreDocWithSource) => {
                const isMine = doc.source === 'mine';
                const href = isMine ? `/dashboard/papers/${doc.id}` : `/explore/doc/${doc.id}`;
                return (
                  <article key={`${doc.source ?? 'explore'}-${doc.id}`} className={styles.paperCard}>
                    <div className={styles.paperCardBody}>
                      {signedIn ? (
                        <>
                          {isMine && <span className={styles.myPaperBadge}>Your submission</span>}
                          <Link href={href} className={styles.paperCardLink}>
                            <h3 className={styles.paperCardTitle}>{doc.title}</h3>
                          </Link>
                        </>
                      ) : (
                        <button type="button" className={styles.paperCardLinkBtn} onClick={showSignInFirst}>
                          <h3 className={styles.paperCardTitle}>{doc.title}</h3>
                        </button>
                      )}
                      <p className={styles.paperCardMeta}>{doc.authors.join(', ')} · {doc.topic} · {doc.year}</p>
                      <p className={styles.paperCardAbstract}>{doc.abstract}</p>
                    </div>
                  </article>
                );
              })
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
