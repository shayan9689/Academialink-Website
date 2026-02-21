'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useDashboard } from '../DashboardContext';
import { EXPLORE_DOCS } from '../../data/exploreDocs';
import styles from './SearchModal.module.css';

export default function SearchModal() {
  const { setSearchOpen } = useDashboard();
  const [query, setQuery] = useState('');
  const results = query.trim()
    ? EXPLORE_DOCS.filter(
        (d) =>
          d.title.toLowerCase().includes(query.toLowerCase()) ||
          d.topic.toLowerCase().includes(query.toLowerCase()) ||
          d.authors.some((a) => a.toLowerCase().includes(query.toLowerCase()))
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
          {!query.trim() && (
            <p className={styles.hint}>Type to search papers by title, topic, or author (from all users).</p>
          )}
          {query.trim() && results.length === 0 && <p className={styles.empty}>No results for &quot;{query}&quot;</p>}
          {query.trim() && results.slice(0, 8).map((doc) => (
            <Link
              key={doc.id}
              href={`/explore/doc/${doc.id}`}
              className={styles.resultItem}
              onClick={() => setSearchOpen(false)}
            >
              <span className={styles.resultTitle}>{doc.title}</span>
              <span className={styles.resultMeta}>{doc.topic} · {doc.year}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
