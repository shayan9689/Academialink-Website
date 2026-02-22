import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@/backend';

export async function GET() {
  const cookieStore = await cookies();
  const supabase = await createServerClient({
    getAll: () => cookieStore.getAll(),
    setAll: (list) => {
      list.forEach(({ name, value, options }) =>
        cookieStore.set(name, value, options ?? {})
      );
    },
  });
  const { data: { user } } = await supabase.auth.getUser();
  return NextResponse.json({ user: user ?? null });
}
