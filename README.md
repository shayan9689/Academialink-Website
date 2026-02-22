# Academialink-Website

Academic research repository – Next.js frontend and Supabase backend.

## Structure

```
├── frontend/          # Next.js app (App Router, API routes, UI)
│   ├── app/
│   ├── backend/       # Server logic (auth, db, storage) – used by API routes
│   ├── public/
│   └── ...
├── .env               # Supabase keys (do not commit)
└── package.json       # Runs dev/build/start via frontend
```

## Run locally

1. **Env:** Copy `.env` to `frontend/.env` (or create `frontend/.env` from `frontend/.env.example` with your Supabase keys).
2. **Install:** From repo root run `npm install` in the frontend (or from root: `cd frontend && npm install`).
3. **Dev:** From repo root run `npm run dev` (starts Next.js in `frontend/`).

Backend is used by frontend API routes under `frontend/app/api/`; see `backend/README.md` for Supabase setup.
