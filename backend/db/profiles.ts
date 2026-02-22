/**
 * Profile CRUD – Supabase table: profiles (id uuid PK/FK to auth.users).
 */

import { getSupabaseClient } from '../config/supabase';
import type { Profile } from '../types';

const TABLE = 'profiles';

export async function getProfileById(userId: string): Promise<Profile | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', userId)
    .single();
  if (error || !data) return null;
  return data as Profile;
}

export async function upsertProfile(
  userId: string,
  payload: { email: string; full_name?: string; avatar_url?: string }
): Promise<Profile | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .upsert(
      {
        id: userId,
        email: payload.email,
        full_name: payload.full_name ?? null,
        avatar_url: payload.avatar_url ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    )
    .select()
    .single();
  if (error) return null;
  return data as Profile;
}
