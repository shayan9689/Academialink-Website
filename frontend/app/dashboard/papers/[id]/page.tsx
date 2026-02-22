'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { ExploreDoc } from '../../../data/exploreDocs';
import PaperDetailView from '../../../explore/doc/[id]/PaperDetailView';

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

function paperToExploreDoc(paper: PaperFromApi): ExploreDoc {
  return {
    id: paper.id,
    title: paper.title,
    topic: paper.topic,
    abstract: paper.abstract ?? '',
    authors: Array.isArray(paper.authors) ? paper.authors : ['Author'],
    year: paper.year ?? new Date(paper.created_at).getFullYear().toString(),
  };
}

export default function DashboardPaperViewPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : null;
  const [paper, setPaper] = useState<PaperFromApi | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [notFound, setNotFound] = useState(false);

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
        if (!cancelled && data) setPaper(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [id]);

  if (!id) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Invalid paper.</p>
        <Link href="/dashboard/papers">← My Papers</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading…</p>
      </div>
    );
  }

  if (notFound || !paper) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Paper not found.</p>
        <Link href="/dashboard/papers">← My Papers</Link>
      </div>
    );
  }

  const doc = paperToExploreDoc(paper);
  return (
    <PaperDetailView
      doc={doc}
      editHref={`/dashboard/papers/${id}/edit`}
      paperId={id}
    />
  );
}
