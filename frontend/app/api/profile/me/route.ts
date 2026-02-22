import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@/backend';

const PROFILES_TABLE = 'profiles';

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

  const { data: existing } = await supabase
    .from(PROFILES_TABLE)
    .select('*')
    .eq('id', user.id)
    .single();

  if (existing) {
    return NextResponse.json(existing);
  }

  const { data: profile, error } = await supabase
    .from(PROFILES_TABLE)
    .upsert(
      {
        id: user.id,
        email: user.email ?? '',
        full_name: (user.user_metadata?.full_name as string) ?? null,
        avatar_url: (user.user_metadata?.avatar_url as string) ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(profile);
}
