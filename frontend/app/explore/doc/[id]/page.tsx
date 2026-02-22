import { notFound } from 'next/navigation';
import { getExploreDocById } from '@/backend';
import PaperDetailView from './PaperDetailView';

interface DocPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: DocPageProps) {
  const { id } = await params;
  const doc = await getExploreDocById(id);
  if (!doc) return { title: 'Document | Academialink' };
  return { title: `${doc.title} | Academialink` };
}

export default async function DocPage({ params }: DocPageProps) {
  const { id } = await params;
  const raw = await getExploreDocById(id);
  if (!raw) notFound();
  const doc = {
    ...raw,
    authors: Array.isArray(raw.authors) ? raw.authors : [],
    abstract: raw.abstract ?? '',
  };
  return <PaperDetailView doc={doc} />;
}
