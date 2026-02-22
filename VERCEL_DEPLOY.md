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

## Google & Apple sign-in (OAuth)

The app supports **Continue with Google** and **Continue with Apple**. To enable them:

1. In [Supabase Dashboard](https://supabase.com/dashboard) → your project → **Authentication** → **Providers**, enable **Google** and/or **Apple**.
2. For each provider, add your **Site URL** and **Redirect URL**:
   - **Site URL**: `https://your-domain.com` (or `http://localhost:3000` for local)
   - **Redirect URL**: `https://your-domain.com/auth/callback` (or `http://localhost:3000/auth/callback`)
3. Enter the OAuth client ID and secret from Google Cloud Console (for Google) or Apple Developer (for Apple). Supabase shows the exact fields and links.
