# Backend

Server-side logic for Academialink: Supabase (auth, DB, storage). Use from Next.js API routes and Server Components via `@/backend`.

## Structure

- **config/** – Supabase clients (server + cookie-based for Next.js)
- **auth/** – Session / current user helpers
- **db/** – Data access (profiles, papers, explore_docs)
- **storage/** – File uploads (papers)
- **types/** – Shared TS types

## Env

Copy `.env.example` to `.env.local` and set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (optional, for admin)

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. In SQL Editor, run the schema below (adjust if you already have tables).
3. In Storage, create a bucket named `uploads` (or change `BUCKET` in `storage/uploads.ts`).

### Suggested schema

```sql
-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- User papers
create table if not exists public.papers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  topic text not null,
  abstract text,
  authors text[] default '{}',
  year text not null,
  file_path text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Explore catalog (public docs)
create table if not exists public.explore_docs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  topic text not null,
  abstract text not null,
  authors text[] default '{}',
  year text not null,
  created_at timestamptz default now()
);

-- RLS: papers – owners can write, everyone can read (for Explore catalog)
alter table public.papers enable row level security;
create policy "Anyone can read papers"
  on public.papers for select using (true);
create policy "Users can insert own papers"
  on public.papers for insert with check (auth.uid() = user_id);
create policy "Users can update own papers"
  on public.papers for update using (auth.uid() = user_id);
create policy "Users can delete own papers"
  on public.papers for delete using (auth.uid() = user_id);

-- explore_docs is optional; the app uses papers as the Explore catalog
alter table public.explore_docs enable row level security;
create policy "Explore docs are public read"
  on public.explore_docs for select using (true);

alter table public.profiles enable row level security;
create policy "Users can read/update own profile"
  on public.profiles for all using (auth.uid() = id);

-- Peer reviews (doc_id = paper id from public.papers)
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  doc_id uuid not null references public.papers(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  overall_rating smallint not null check (overall_rating >= 1 and overall_rating <= 4),
  rigor smallint not null check (rigor >= 0 and rigor <= 10),
  originality smallint not null check (originality >= 0 and originality <= 10),
  clarity smallint not null check (clarity >= 0 and clarity <= 10),
  feedback text not null,
  anonymous boolean not null default false,
  created_at timestamptz default now()
);

alter table public.reviews enable row level security;
create policy "Anyone can read reviews"
  on public.reviews for select using (true);
create policy "Authenticated users can insert reviews"
  on public.reviews for insert with check (auth.uid() = user_id);
```

### If you already have the old "Users can CRUD own papers" policy

Run this in the Supabase SQL Editor so everyone can see all papers in Explore:

```sql
drop policy if exists "Users can CRUD own papers" on public.papers;
create policy "Anyone can read papers" on public.papers for select using (true);
create policy "Users can insert own papers" on public.papers for insert with check (auth.uid() = user_id);
create policy "Users can update own papers" on public.papers for update using (auth.uid() = user_id);
create policy "Users can delete own papers" on public.papers for delete using (auth.uid() = user_id);
```

If `reviews.doc_id` still references `explore_docs(id)`, change it to reference `papers(id)` (may require recreating the foreign key).

## Usage

```ts
// In API route or Server Component – with auth from cookies
import { cookies } from 'next/headers';
import {
  createServerClient,
  getPapersByUserId,
  getExploreDocs,
} from '@/backend';

const cookieStore = await cookies();
const supabase = await createServerClient({
  getAll: () => cookieStore.getAll(),
  setAll: (list) =>
    list.forEach(({ name, value, options }) =>
      cookieStore.set(name, value, options)
    ),
});
const { data: { user } } = await supabase.auth.getUser();
const papers = user ? await getPapersByUserId(user.id) : [];
const docs = await getExploreDocs();
```
