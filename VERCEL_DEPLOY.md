# Deploying to Vercel

## 1. Connect the repo

- Go to [vercel.com](https://vercel.com) → **Add New** → **Project**
- Import your Git repo (e.g. `Academialink-Website`)
- **Root Directory**: leave as **.** (project root)
- **Framework Preset**: Next.js (set by `vercel.json`)

## 2. Environment variables

In the project → **Settings** → **Environment Variables**, add the same variables you use in `.env`:

| Variable | Required | Notes |
|----------|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | Only if you use server-only/admin Supabase calls |

Use **Production**, **Preview**, and **Development** as needed (at least Production).

## 3. Deploy

Click **Deploy**. Vercel will run `npm install` and `npm run build` (as in `vercel.json`).

If the build fails, check the build log on Vercel; the same commands run locally with `npm run build`.
