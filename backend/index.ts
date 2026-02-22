/**
 * Backend – single entry for clean imports from app/api and server code.
 *
 * Usage:
 *   import { getSupabaseClient, getCurrentUser } from '@/backend';
 *   import { getPapersByUserId, createPaper } from '@/backend';
 *   import { getExploreDocs, getExploreDocById } from '@/backend';
 *   import { uploadPaperFile } from '@/backend';
 */

export { getSupabaseClient, getSupabaseServiceClient } from './config/supabase';
export {
  createServerClient,
  type CookieAdapter,
} from './config/supabaseServer';
export { getCurrentUser, getSession } from './auth/session';
export { getProfileById, upsertProfile } from './db/profiles';
export {
  getPapersByUserId,
  getPaperById,
  createPaper,
  deletePaper,
  type CreatePaperInput,
} from './db/papers';
export { getExploreDocs, getExploreDocById, getTopics } from './db/docs';
export { createReview, getReviewsByDocId, type CreateReviewInput } from './db/reviews';
export { uploadPaperFile, getPublicUrl, type UploadResult } from './storage/uploads';
export type { Profile, Paper, ExploreDoc, ActivityItem, Review } from './types';
