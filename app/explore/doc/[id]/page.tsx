import { notFound } from 'next/navigation';
import { getDocById } from '../../../data/exploreDocs';
import PaperDetailView from './PaperDetailView';

interface DocPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: DocPageProps) {
  const { id } = await params;
  const doc = getDocById(id);
  if (!doc) return { title: 'Document | Academialink' };
  return { title: `${doc.title} | Academialink` };
}

export default async function DocPage({ params }: DocPageProps) {
  const { id } = await params;
  const doc = getDocById(id);
  if (!doc) notFound();

  return <PaperDetailView doc={doc} />;
}
