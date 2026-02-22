import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@/backend';

const PAPERS_TABLE = 'papers';
const BUCKET = 'uploads';
const SIGNED_URL_EXPIRY = 3600;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
  const { id } = await params;
  const { data: paper, error: paperError } = await supabase
    .from(PAPERS_TABLE)
    .select('file_path')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();
  if (paperError || !paper?.file_path) {
    return NextResponse.json({ error: 'Not found or no file' }, { status: 404 });
  }
  const { data: signed, error: signError } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(paper.file_path, SIGNED_URL_EXPIRY);
  if (signError || !signed?.signedUrl) {
    return NextResponse.json(
      { error: signError?.message ?? 'Failed to get file URL' },
      { status: 500 }
    );
  }
  return NextResponse.json({ url: signed.signedUrl });
}
