'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDashboard } from '../DashboardContext';
import styles from './SearchModal.module.css';

type ExploreDocItem = {
  id: string;
  title: string;
  topic: string;
  abstract: string;
  authors: string[];
  year: string;
  source?: 'explore' | 'mine';
};

export default function SearchModal() {
  const { setSearchOpen } = useDashboard();
  const [query, setQuery] = useState('');
  const [docs, setDocs] = useState<ExploreDocItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/explore/docs')
      .then((res) => (res.ok ? res.json() : []))
      .then((data: ExploreDocItem[]) => {
        if (!cancelled) setDocs(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setDocs([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const results = query.trim()
    ? docs.filter(
        (d) =>
          d.title.toLowerCase().includes(query.toLowerCase()) ||
          (d.topic && d.topic.toLowerCase().includes(query.toLowerCase())) ||
          (Array.isArray(d.authors) && d.authors.some((a: string) => a.toLowerCase().includes(query.toLowerCase())))
      )
    : [];

  return (
    <div className={styles.overlay} onClick={() => setSearchOpen(false)}>
      <div className={styles.backdrop} aria-hidden />
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Search">
        <div className={styles.header}>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search papers from all users..."
            className={styles.input}
            autoFocus
          />
          <button type="button" className={styles.closeBtn} onClick={() => setSearchOpen(false)} aria-label="Close">×</button>
        </div>
        <div className={styles.results}>
          {loading && <p className={styles.hint}>Loading…</p>}
          {!loading && !query.trim() && (
            <p className={styles.hint}>Type to search papers by title, topic, or author (from all users).</p>
          )}
          {!loading && query.trim() && results.length === 0 && <p className={styles.empty}>No results for &quot;{query}&quot;</p>}
          {!loading && query.trim() && results.slice(0, 8).map((doc) => {
            const href = doc.source === 'mine' ? `/dashboard/papers/${doc.id}` : `/explore/doc/${doc.id}`;
            return (
              <Link
                key={`${doc.source ?? 'explore'}-${doc.id}`}
                href={href}
                className={styles.resultItem}
                onClick={() => setSearchOpen(false)}
              >
                <span className={styles.resultTitle}>{doc.title}</span>
                <span className={styles.resultMeta}>{doc.topic} · {doc.year}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
