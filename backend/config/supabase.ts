/**
 * Supabase server client for use in API routes and server components.
 * Uses service role or anon key from env; prefer anon + RLS in production.
 */

import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !anonKey) {
  throw new Error(
    'Missing Supabase env: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
  );
}

/** Client with anon key – respects RLS. Use in API routes when you have a user session. */
export function getSupabaseClient() {
  return createClient(url!, anonKey!);
}

/** Client with service role – bypasses RLS. Use only in trusted server code. */
export function getSupabaseServiceClient() {
  if (!serviceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for service client');
  }
  return createClient(url!, serviceKey, { auth: { persistSession: false } });
}
