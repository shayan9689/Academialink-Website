import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@/backend';
import type { Paper } from '@/backend';

const UPLOADS_BUCKET = 'uploads';
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
    created_at: p.created_at,
  };
}

export async function GET() {
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
  const { data: papers, error } = await supabase
    .from(PAPERS_TABLE)
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json((papers ?? []).map((p) => paperToItem(p as Paper)));
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

  const contentType = request.headers.get('content-type') ?? '';
  let title: string;
  let topic: string;
  let abstract: string | null = null;
  let authors: string[] = [];
  let year: string;
  let file: File | null = null;

  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData();
    title = (formData.get('title') as string)?.trim() ?? '';
    topic = (formData.get('topic') as string)?.trim() ?? '';
    const abs = formData.get('abstract');
    abstract = abs != null ? String(abs).trim() || null : null;
    const authorsRaw = formData.get('authors');
    if (authorsRaw != null) {
      const s = String(authorsRaw).trim();
      authors = s ? s.split(',').map((a) => a.trim()).filter(Boolean) : [];
    }
    year = (formData.get('year') as string)?.trim() ?? new Date().getFullYear().toString();
    const f = formData.get('file');
    if (f instanceof File && f.size > 0) file = f;
  } else {
    const body = await request.json();
    title = body.title?.trim() ?? '';
    topic = body.topic?.trim() ?? '';
    abstract = body.abstract?.trim() || null;
    authors = Array.isArray(body.authors) ? body.authors : [];
    year = body.year?.trim() ?? new Date().getFullYear().toString();
  }

  if (!title || !topic) {
    return NextResponse.json(
      { error: 'title and topic are required' },
      { status: 400 }
    );
  }

  let file_path: string | null = null;
  if (file) {
    const filename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `${user.id}/${Date.now()}_${filename}`;
    const { error: uploadError } = await supabase.storage
      .from(UPLOADS_BUCKET)
      .upload(path, file, { upsert: false });
    if (uploadError) {
      return NextResponse.json(
        { error: uploadError.message || 'Upload failed' },
        { status: 500 }
      );
    }
    file_path = path;
  }

  const { data: paper, error: insertError } = await supabase
    .from(PAPERS_TABLE)
    .insert({
      user_id: user.id,
      title,
      topic,
      abstract: abstract ?? null,
      authors: authors ?? [],
      year,
      file_path: file_path ?? null,
    })
    .select()
    .single();

  if (insertError) {
    return NextResponse.json(
      { error: insertError.message || 'Failed to create paper' },
      { status: 500 }
    );
  }
  if (!paper) {
    return NextResponse.json({ error: 'Failed to create paper' }, { status: 500 });
  }
  return NextResponse.json(paperToItem(paper as Paper));
}
