/**
 * Supabase browser client for client components.
 * Handles auth cookies automatically via @supabase/ssr.
 */

import { createBrowserClient } from '@supabase/ssr';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function createClient() {
  return createBrowserClient(url, anonKey);
}
