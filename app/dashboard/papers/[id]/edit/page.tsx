'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import layoutStyles from '../../../page.module.css';
import styles from '../page.module.css';

type PaperFromApi = {
  id: string;
  title: string;
  topic: string;
  abstract: string | null;
  authors: string[];
  year: string;
  created_at: string;
  [key: string]: unknown;
};

export default function PaperEditPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : null;
  const [paper, setPaper] = useState<PaperFromApi | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [notFound, setNotFound] = useState(false);
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [abstract, setAbstract] = useState('');
  const [authorsStr, setAuthorsStr] = useState('');
  const [year, setYear] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    fetch(`/api/papers/${id}`)
      .then((res) => {
        if (res.status === 404) {
          setNotFound(true);
          return null;
        }
        return res.ok ? res.json() : null;
      })
      .then((data) => {
        if (!cancelled && data) {
          setPaper(data);
          setTitle(data.title ?? '');
          setTopic(data.topic ?? '');
          setAbstract(data.abstract ?? '');
          setAuthorsStr(Array.isArray(data.authors) ? data.authors.join(', ') : '');
          setYear(data.year ?? new Date().getFullYear().toString());
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [id]);

  function handleSave() {
    if (!id || !paper) return;
    const authors = authorsStr.split(',').map((a) => a.trim()).filter(Boolean);
    setError(null);
    setSaving(true);
    fetch(`/api/papers/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title.trim(),
        topic: topic.trim(),
        abstract: abstract.trim() || null,
        authors,
        year: year.trim(),
      }),
    })
      .then((res) => {
        if (!res.ok) return res.json().then((d) => { throw new Error((d as { error?: string }).error || 'Save failed'); });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Save failed');
      })
      .finally(() => setSaving(false));
  }

  if (!id) {
    return (
      <div className={layoutStyles.page}>
        <div className={styles.wrap}>
          <p className={styles.notFound}>Invalid paper.</p>
          <Link href="/dashboard/papers" className={styles.backLink}>← My Papers</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={layoutStyles.page}>
        <div className={styles.wrap}>
          <p className={styles.notFound}>Loading…</p>
        </div>
      </div>
    );
  }

  if (notFound || !paper) {
    return (
      <div className={layoutStyles.page}>
        <div className={styles.wrap}>
          <p className={styles.notFound}>Paper not found.</p>
          <Link href="/dashboard/papers" className={styles.backLink}>← My Papers</Link>
        </div>
      </div>
    );
  }

  const submitted = new Date(paper.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className={layoutStyles.page}>
      <div className={styles.wrap}>
        <div className={styles.toolbar}>
          <Link href={`/dashboard/papers/${id}`} className={styles.backLink}>← Back to paper</Link>
          <button type="button" className={styles.saveBtn} onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : saved ? 'Saved' : 'Save'}
          </button>
        </div>
        {error && <p className={styles.formError} role="alert">{error}</p>}
        <article className={styles.article}>
          <div className={styles.field}>
            <label className={styles.label}>Title</label>
            <input
              type="text"
              className={styles.titleInput}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Paper title"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Topic / Category</label>
            <input
              type="text"
              className={styles.titleInput}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Computer Science"
            />
          </div>
          <p className={styles.meta}>{submitted}</p>
          <div className={styles.field}>
            <label className={styles.label}>Abstract</label>
            <textarea
              className={styles.abstractInput}
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              placeholder="Abstract or document content..."
              rows={8}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Authors (comma-separated)</label>
            <input
              type="text"
              className={styles.titleInput}
              value={authorsStr}
              onChange={(e) => setAuthorsStr(e.target.value)}
              placeholder="Author One, Author Two"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Year</label>
            <input
              type="text"
              className={styles.titleInput}
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="2024"
            />
          </div>
        </article>
      </div>
    </div>
  );
}
