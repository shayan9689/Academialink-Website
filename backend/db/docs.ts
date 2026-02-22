/**
 * Explore docs – public catalog from papers table.
 * All uploaded papers are visible to everyone (RLS must allow public read on papers).
 */

import { getSupabaseClient } from '../config/supabase';
import type { ExploreDoc } from '../types';

const TABLE = 'papers';

export async function getExploreDocs(limit = 50): Promise<ExploreDoc[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select('id, title, topic, abstract, authors, year')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) return [];
  return (data ?? []).map((row: Record<string, unknown>) => ({
    id: row.id,
    title: row.title,
    topic: row.topic,
    abstract: row.abstract ?? '',
    authors: Array.isArray(row.authors) ? row.authors : [],
    year: row.year ?? '',
  })) as ExploreDoc[];
}

export async function getExploreDocById(id: string): Promise<ExploreDoc | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select('id, title, topic, abstract, authors, year')
    .eq('id', id)
    .single();
  if (error || !data) return null;
  return {
    id: data.id,
    title: data.title,
    topic: data.topic,
    abstract: data.abstract ?? '',
    authors: Array.isArray(data.authors) ? data.authors : [],
    year: data.year ?? '',
  } as ExploreDoc;
}

export async function getTopics(): Promise<string[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select('topic');
  if (error) return [];
  const topics = Array.from(new Set((data ?? []).map((r: { topic: string }) => r.topic)));
  return topics.sort();
}
