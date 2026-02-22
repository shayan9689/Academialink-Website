/**
 * Peer reviews for explore docs. Table: reviews.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Review } from '../types';

const TABLE = 'reviews';

export interface CreateReviewInput {
  doc_id: string;
  user_id: string;
  overall_rating: number;
  rigor: number;
  originality: number;
  clarity: number;
  feedback: string;
  anonymous: boolean;
}

export async function createReview(
  supabase: SupabaseClient,
  input: CreateReviewInput
): Promise<Review | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      doc_id: input.doc_id,
      user_id: input.user_id,
      overall_rating: input.overall_rating,
      rigor: input.rigor,
      originality: input.originality,
      clarity: input.clarity,
      feedback: input.feedback,
      anonymous: input.anonymous,
    })
    .select()
    .single();
  if (error || !data) return null;
  return data as Review;
}

export async function getReviewsByDocId(
  supabase: SupabaseClient,
  docId: string
): Promise<Review[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('doc_id', docId)
    .order('created_at', { ascending: false });
  if (error) return [];
  return (data ?? []) as Review[];
}
