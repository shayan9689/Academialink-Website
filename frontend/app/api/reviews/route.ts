import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient, createReview, getReviewsByDocId } from '@/backend';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const docId = searchParams.get('docId');
  if (!docId) {
    return NextResponse.json({ error: 'Missing docId' }, { status: 400 });
  }
  const cookieStore = await cookies();
  const supabase = await createServerClient({
    getAll: () => cookieStore.getAll(),
    setAll: (list) =>
      list.forEach(({ name, value, options }) =>
        cookieStore.set(name, value, options ?? {})
      ),
  });
  const reviews = await getReviewsByDocId(supabase, docId);
  return NextResponse.json(reviews);
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const supabase = await createServerClient({
    getAll: () => cookieStore.getAll(),
    setAll: (list) =>
      list.forEach(({ name, value, options }) =>
        cookieStore.set(name, value, options ?? {})
      ),
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  let body: {
    docId?: string;
    overallRating?: number;
    rigor?: number;
    originality?: number;
    clarity?: number;
    feedback?: string;
    anonymous?: boolean;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const {
    docId,
    overallRating,
    rigor,
    originality,
    clarity,
    feedback,
    anonymous,
  } = body;
  if (!docId || typeof overallRating !== 'number' || typeof rigor !== 'number' || typeof originality !== 'number' || typeof clarity !== 'number' || typeof feedback !== 'string' || typeof anonymous !== 'boolean') {
    return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
  }
  if (feedback.trim().length < 100) {
    return NextResponse.json({ error: 'Feedback must be at least 100 characters' }, { status: 400 });
  }
  const review = await createReview(supabase, {
    doc_id: docId,
    user_id: user.id,
    overall_rating: Math.max(1, Math.min(4, Math.round(overallRating))) || 1,
    rigor: Math.max(0, Math.min(10, Math.round(rigor))),
    originality: Math.max(0, Math.min(10, Math.round(originality))),
    clarity: Math.max(0, Math.min(10, Math.round(clarity))),
    feedback: feedback.trim(),
    anonymous,
  });
  if (!review) {
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
  return NextResponse.json(review);
}
