import { notFound } from 'next/navigation';
import { getDocById } from '../../data/exploreDocs';
import ReviewPageContent from './ReviewPageContent';

interface ReviewPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ReviewPageProps) {
  const { id } = await params;
  const doc = getDocById(id);
  if (!doc) return { title: 'Review | Academialink' };
  return { title: `Review: ${doc.title} | Academialink` };
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { id } = await params;
  const doc = getDocById(id);
  if (!doc) notFound();

  return <ReviewPageContent paperTitle={doc.title} docId={doc.id} />;
}
