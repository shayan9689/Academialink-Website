# Auth setup (Supabase)

## Where passwords and logins are stored

**This app does not store passwords or sessions in its own backend.** All auth is handled by **Supabase Auth**:

- **Passwords** – Stored and hashed by Supabase (never in our `backend/` or database).
- **Sessions / logins** – Supabase issues JWT tokens; the app stores the session in **cookies** (via `@supabase/ssr`) so you stay logged in across refreshes.

So “backend not saving passwords” is expected: our backend only has papers, profiles, reviews, etc. Sign up and sign in go to Supabase; after a successful sign-in, the session is written to cookies and used on every request.

If sign-up or sign-in seems not to “save”:

1. **Email confirmation** – In Supabase: Authentication → Providers → Email. If “Confirm email” is ON, users must click the link in the email before they can sign in. You can turn it OFF for testing.
2. **Cookies** – Ensure your domain and redirect URLs are correct (see below) so the auth callback can set cookies.

---

## Continue with Google not working

For **Continue with Google** (and Apple) to work, you must configure Supabase and Google:

### 1. Supabase Dashboard

1. Open your project → **Authentication** → **Providers**.
2. Enable **Google**.
3. In **URL Configuration** (Authentication → URL Configuration):
   - **Site URL**: your app’s public URL (e.g. `https://your-app.vercel.app` or `http://localhost:3000`).
   - **Redirect URLs**: add exactly:
     - `https://your-app.vercel.app/auth/callback`
     - `http://localhost:3000/auth/callback`  
     (use your real production URL instead of `your-app.vercel.app` if different.)

### 2. Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → **Credentials**.
2. Create an **OAuth 2.0 Client ID** (Application type: **Web application**).
3. Under **Authorized redirect URIs** add the **exact** redirect URL Supabase shows for the Google provider (it looks like `https://<project-ref>.supabase.co/auth/v1/callback`).
4. Copy **Client ID** and **Client secret** into Supabase → Authentication → Providers → Google.

After saving, “Continue with Google” should redirect to Google and then back to your app; the `/auth/callback` route exchanges the code for a session and sets cookies.

---

## Create account page

The create-account (sign-up) form includes:

- **Continue with Google** and **Continue with Apple** at the top (same OAuth flow as sign-in).
- **Email + password** below; that data is sent to Supabase only (no full name or institution stored in auth). Profile details (e.g. name) can be added later in dashboard/settings if you want.
