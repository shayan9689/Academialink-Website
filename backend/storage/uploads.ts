/**
 * File uploads – Supabase Storage bucket for papers/documents.
 */

import { getSupabaseClient } from '../config/supabase';

const BUCKET = 'uploads';

export interface UploadResult {
  path: string;
  error: string | null;
}

export async function uploadPaperFile(
  userId: string,
  file: File | Buffer,
  filename: string
): Promise<UploadResult> {
  const supabase = getSupabaseClient();
  const path = `${userId}/${Date.now()}_${filename}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: false });
  return { path, error: error?.message ?? null };
}

export function getPublicUrl(path: string): string {
  const supabase = getSupabaseClient();
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
