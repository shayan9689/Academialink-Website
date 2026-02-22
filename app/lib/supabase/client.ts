/**
 * Supabase browser client for client components.
 * Handles auth cookies automatically via @supabase/ssr.
 * Uses placeholders when env is missing so build (e.g. on Vercel) can complete;
 * set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY for real auth.
 */

import { createBrowserClient } from '@supabase/ssr';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-anon-key';

export function createClient() {
  return createBrowserClient(url, anonKey);
}
