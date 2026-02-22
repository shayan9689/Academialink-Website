import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@/backend';
import type { Paper } from '@/backend';
import type { User } from '@supabase/supabase-js';

const PAPERS_TABLE = 'papers';

function paperToItem(p: Paper) {
  return {
    id: p.id,
    title: p.title,
    submitted: new Date(p.created_at).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    status: 'Published',
    category: p.topic,
    citations: null as number | null,
    isPublic: true,
  };
}

async function getAuthSupabase(): Promise<{ supabase: Awaited<ReturnType<typeof createServerClient>>; user: User } | null> {
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
  if (!user) return null;
  return { supabase, user };
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const auth = await getAuthSupabase();
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const { data: paper, error } = await auth.supabase
    .from(PAPERS_TABLE)
    .select('*')
    .eq('id', id)
    .eq('user_id', auth.user.id)
    .single();
  if (error || !paper) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(paper);
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const auth = await getAuthSupabase();
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json();
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (body.title !== undefined) {
    const t = typeof body.title === 'string' ? body.title.trim() : '';
    if (!t) return NextResponse.json({ error: 'title cannot be empty' }, { status: 400 });
    updates.title = t;
  }
  if (body.topic !== undefined) updates.topic = typeof body.topic === 'string' ? body.topic.trim() : '';
  if (body.abstract !== undefined) updates.abstract = body.abstract == null ? null : String(body.abstract).trim() || null;
  if (body.authors !== undefined) updates.authors = Array.isArray(body.authors) ? body.authors : [];
  if (body.year !== undefined) updates.year = typeof body.year === 'string' ? body.year.trim() : '';

  const { data, error } = await auth.supabase
    .from(PAPERS_TABLE)
    .update(updates)
    .eq('id', id)
    .eq('user_id', auth.user.id)
    .select()
    .single();
  if (error || !data) {
    return NextResponse.json({ error: error?.message || 'Update failed' }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const auth = await getAuthSupabase();
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const { error } = await auth.supabase
    .from(PAPERS_TABLE)
    .delete()
    .eq('id', id)
    .eq('user_id', auth.user.id);
  if (error) {
    return NextResponse.json({ error: 'Not found or delete failed' }, { status: 404 });
  }
  return new NextResponse(null, { status: 204 });
}
