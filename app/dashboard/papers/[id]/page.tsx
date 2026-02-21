'use client';

import { useParams } from 'next/navigation';
import { getDocById } from '../../../data/exploreDocs';
import type { ExploreDoc } from '../../../data/exploreDocs';
import PaperDetailView from '../../../explore/doc/[id]/PaperDetailView';

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

function paperToExploreDoc(paper: PaperRecord): ExploreDoc {
  const fromExplore = getDocById(paper.id);
  return {
    id: paper.id,
    title: paper.title,
    topic: paper.category,
    abstract: paper.abstract ?? '',
    authors: fromExplore?.authors ?? ['Author'],
    year: paper.submitted.split(' ').pop() ?? '2023',
  };
}

export default function DashboardPaperViewPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : null;
  const paper = id ? PAPERS_BY_ID[id] : null;

  if (!id || !paper) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Paper not found.</p>
        <a href="/dashboard/papers">← My Papers</a>
      </div>
    );
  }

  const doc = paperToExploreDoc(paper);
  return (
    <PaperDetailView
      doc={doc}
      editHref={`/dashboard/papers/${id}/edit`}
    />
  );
}
