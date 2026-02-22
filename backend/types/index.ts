/**
 * Shared backend types for DB entities and API payloads.
 */

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Paper {
  id: string;
  user_id: string;
  title: string;
  topic: string;
  abstract: string | null;
  authors: string[];
  year: string;
  file_path: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExploreDoc {
  id: string;
  title: string;
  topic: string;
  abstract: string;
  authors: string[];
  year: string;
}

export interface ActivityItem {
  id: string;
  user_id: string;
  type: 'upload' | 'view' | 'share' | 'comment';
  title: string;
  doc_id: string | null;
  created_at: string;
}

export interface Review {
  id: string;
  doc_id: string;
  user_id: string;
  overall_rating: number;
  rigor: number;
  originality: number;
  clarity: number;
  feedback: string;
  anonymous: boolean;
  created_at: string;
}
