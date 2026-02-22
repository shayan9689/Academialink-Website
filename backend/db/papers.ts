/**
 * Papers CRUD – user-uploaded papers. Table: papers.
 */

import { getSupabaseClient } from '../config/supabase';
import type { Paper } from '../types';

const TABLE = 'papers';

export interface CreatePaperInput {
  user_id: string;
  title: string;
  topic: string;
  abstract?: string | null;
  authors: string[];
  year: string;
  file_path?: string | null;
}

export async function getPapersByUserId(userId: string): Promise<Paper[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) return [];
  return (data ?? []) as Paper[];
}

export async function getPaperById(paperId: string): Promise<Paper | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', paperId)
    .single();
  if (error || !data) return null;
  return data as Paper;
}

export async function createPaper(input: CreatePaperInput): Promise<Paper | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      user_id: input.user_id,
      title: input.title,
      topic: input.topic,
      abstract: input.abstract ?? null,
      authors: input.authors ?? [],
      year: input.year,
      file_path: input.file_path ?? null,
    })
    .select()
    .single();
  if (error) return null;
  return data as Paper;
}

export async function deletePaper(paperId: string, userId: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', paperId)
    .eq('user_id', userId);
  return !error;
}
