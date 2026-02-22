/**
 * Auth helpers: get current user/session for API routes and server components.
 * Uses Supabase auth; call from server only.
 */

import { getSupabaseClient } from '../config/supabase';
import type { User } from '@supabase/supabase-js';

export async function getCurrentUser(): Promise<User | null> {
  const supabase = getSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getSession() {
  const supabase = getSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}
