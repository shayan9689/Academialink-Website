'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import layoutStyles from '../../../page.module.css';
import styles from '../page.module.css';

type PaperRecord = {
  id: string;
  title: string;
  submitted: string;
  status: string;
  category: string;
  citations: number | null;
  isPublic: boolean;
  abstract?: string;
};

const PAPERS_BY_ID: Record<string, PaperRecord> = {
  '1': { id: '1', title: 'Neural Architectures for Decentralized Learning', submitted: 'Oct 12, 2023', status: 'Published', category: 'Computer Science', citations: 124, isPublic: true, abstract: 'We present novel neural architectures designed for federated and decentralized learning settings, improving communication efficiency and convergence rates across heterogeneous devices.' },
  '2': { id: '2', title: 'Ethical Implications of Generative Models in Academia', submitted: 'Nov 04, 2023', status: 'Peer Review', category: 'Ethics', citations: null, isPublic: false, abstract: 'We examine ethical challenges posed by the use of generative AI in academic writing, peer review, and assessment.' },
  '3': { id: '3', title: 'Optimizing Transformer Latency for Edge Devices', submitted: 'Dec 18, 2023', status: 'Draft', category: 'Hardware', citations: null, isPublic: true, abstract: 'This paper addresses latency optimization of transformer models for deployment on resource-constrained edge devices.' },
  '4': { id: '4', title: 'Global Collaboration Networks in 21st Century Physics', submitted: 'Aug 22, 2023', status: 'Published', category: 'Physics', citations: 45, isPublic: true, abstract: 'Analysis of large-scale collaboration patterns in physics research and their impact on citation networks and discovery rates.' },
};

const STORAGE_KEY = 'academialink_paper_edits';

function getStoredEdit(id: string): Partial<PaperRecord> | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const all = JSON.parse(raw) as Record<string, Partial<PaperRecord>>;
    return all[id] ?? null;
  } catch {
    return null;
  }
}

function setStoredEdit(id: string, data: Partial<PaperRecord>) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const all = raw ? JSON.parse(raw) : {};
    all[id] = { ...(all[id] ?? {}), ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {}
}

export default function PaperEditPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : null;
  const base = id ? PAPERS_BY_ID[id] : null;
  const [title, setTitle] = useState(base?.title ?? '');
  const [abstract, setAbstract] = useState(base?.abstract ?? '');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!id || !base) return;
    const edit = getStoredEdit(id);
    if (edit?.title !== undefined) setTitle(edit.title);
    if (edit?.abstract !== undefined) setAbstract(edit.abstract);
  }, [id, base]);

  if (!id || !base) {
    return (
      <div className={layoutStyles.page}>
        <div className={styles.wrap}>
          <p className={styles.notFound}>Paper not found.</p>
          <Link href="/dashboard/papers" className={styles.backLink}>← My Papers</Link>
        </div>
      </div>
    );
  }

  function handleSave() {
    if (!id || !base) return;
    setStoredEdit(id, { title: title.trim() || base.title, abstract: abstract.trim() || base.abstract });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className={layoutStyles.page}>
      <div className={styles.wrap}>
        <div className={styles.toolbar}>
          <Link href={`/dashboard/papers/${id}`} className={styles.backLink}>← Back to paper</Link>
          <button type="button" className={styles.saveBtn} onClick={handleSave}>
            {saved ? 'Saved' : 'Save'}
          </button>
        </div>
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
          <p className={styles.meta}>{base.submitted} · {base.status} · {base.category}{base.citations != null ? ` · ${base.citations} citations` : ''}</p>
          <div className={styles.field}>
            <label className={styles.label}>Abstract / Content</label>
            <textarea
              className={styles.abstractInput}
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              placeholder="Abstract or document content..."
              rows={8}
            />
          </div>
        </article>
      </div>
    </div>
  );
}
