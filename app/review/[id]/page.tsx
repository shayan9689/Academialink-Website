import { notFound } from 'next/navigation';

interface ReviewPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ReviewPageProps) {
  await params;
  return { title: 'Review | AcademiaLink' };
}

export default async function ReviewPage() {
  notFound();
}
