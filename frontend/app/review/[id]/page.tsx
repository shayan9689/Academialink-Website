import { notFound } from 'next/navigation';
import { getExploreDocById } from '@/backend';
import ReviewPageContent from './ReviewPageContent';

interface ReviewPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ReviewPageProps) {
  const { id } = await params;
  const doc = await getExploreDocById(id);
  if (!doc) return { title: 'Review | Academialink' };
  return { title: `Review: ${doc.title} | Academialink` };
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { id } = await params;
  const doc = await getExploreDocById(id);
  if (!doc) notFound();

  return <ReviewPageContent paperTitle={doc.title} docId={doc.id} />;
}
