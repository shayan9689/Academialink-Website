import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient, getExploreDocs } from '@/backend';

/** Explore doc or user paper in the same shape for the Explore page. */
export type ExploreDocItem = {
  id: string;
  title: string;
  topic: string;
  abstract: string;
  authors: string[];
  year: string;
  source: 'explore' | 'mine';
};

export async function GET() {
  const docs = await getExploreDocs();
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

  let myPaperIds = new Set<string>();
  if (user) {
    const { data: myPapers } = await supabase
      .from('papers')
      .select('id')
      .eq('user_id', user.id);
    myPaperIds = new Set((myPapers ?? []).map((p) => p.id));
  }

  const items: ExploreDocItem[] = (docs ?? []).map((d) => ({
    id: d.id,
    title: d.title,
    topic: d.topic,
    abstract: d.abstract ?? '',
    authors: Array.isArray(d.authors) ? d.authors : [],
    year: d.year,
    source: myPaperIds.has(d.id) ? ('mine' as const) : ('explore' as const),
  }));

  return NextResponse.json(items);
}
