import { notFound } from 'next/navigation';

interface DocPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: DocPageProps) {
  await params;
  return { title: 'Document | AcademiaLink' };
}

export default async function DocPage({ params }: DocPageProps) {
  await params;
  notFound();
}
