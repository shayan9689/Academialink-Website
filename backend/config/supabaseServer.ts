/**
 * Supabase server client for Next.js – uses cookies for auth.
 * Use in API routes and Server Components; pass Next.js cookie store.
 *
 * Example (in app):
 *   import { cookies } from 'next/headers';
 *   import { createServerClient } from '@/backend';
 *   const supabase = await createServerClient(await cookies());
 */

import { createServerClient as createSSRClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

export interface CookieAdapter {
  getAll(): { name: string; value: string }[];
  setAll(cookies: { name: string; value: string; options?: Record<string, unknown> }[]): void;
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    'Missing Supabase env: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
  );
}

const SUPABASE_URL: string = url;
const SUPABASE_ANON_KEY: string = anonKey;

export async function createServerClient(
  cookieStore: CookieAdapter
): Promise<SupabaseClient> {
  return createSSRClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        try {
          cookieStore.setAll(cookiesToSet);
        } catch {
          // Ignored when called from Server Component (read-only)
        }
      },
    },
  });
}
