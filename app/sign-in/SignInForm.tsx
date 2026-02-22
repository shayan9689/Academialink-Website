'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '../lib/supabase/client';
import styles from './page.module.css';

function EnvelopeIcon() {
  return (
    <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg className={styles.socialBtnIcon} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg className={styles.socialBtnIcon} viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

export interface SignInFormProps {
  /** When provided, "Sign up for free" triggers this instead of navigating */
  onSwitchToSignUp?: () => void;
  /** When provided, called after successful sign-in instead of router.push (e.g. to close modal) */
  onSuccess?: () => void;
  /** Optional id for the card title (e.g. for modal aria-labelledby) */
  titleId?: string;
  /** When true, hide the "Don't have an account?" row (e.g. when signup CTA is in a welcome panel) */
  hideSignUpRow?: boolean;
}

export default function SignInForm({ onSwitchToSignUp, onSuccess, titleId, hideSignUpRow }: SignInFormProps = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const err = searchParams.get('error');
    if (err) setError(decodeURIComponent(err));
  }, [searchParams]);

  const handleOAuthSignIn = async (provider: 'google' | 'apple') => {
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error: err } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (err) {
        const msg =
          err.message?.includes('not enabled') || err.message?.includes('validation_failed')
            ? `${provider === 'google' ? 'Google' : 'Apple'} sign-in is not set up yet. Please use email, or ask the site admin to enable it in Supabase.`
            : err.message;
        setError(msg);
        setLoading(false);
        return;
      }
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      setError('Could not start sign in');
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/dashboard');
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <h1 id={titleId} className={styles.cardTitle}>Sign In</h1>
      <p className={styles.cardSubtitle}>
        Enter your credentials to access your research dashboard.
      </p>

      <div className={styles.socialButtons}>
        <button
          type="button"
          className={styles.socialBtn}
          onClick={() => handleOAuthSignIn('apple')}
          disabled={loading}
        >
          <AppleIcon />
          Continue with Apple
        </button>
        <button
          type="button"
          className={styles.socialBtn}
          onClick={() => handleOAuthSignIn('google')}
          disabled={loading}
        >
          <GoogleIcon />
          Continue with Google
        </button>
      </div>

      <div className={styles.divider}>
        <span className={styles.dividerLine} />
        <span className={styles.dividerText}>Or use email</span>
        <span className={styles.dividerLine} />
      </div>

      {error && (
        <p className={styles.formError} role="alert">
          {error}
        </p>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.fieldGroup}>
          <label htmlFor="email" className={styles.fieldLabel}>
            Email Address
          </label>
          <div className={styles.inputWrap}>
            <EnvelopeIcon />
            <input
              id="email"
              type="email"
              className={styles.input}
              placeholder="name@university.edu"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <div className={styles.fieldLabelRow}>
            <label htmlFor="password" className={styles.fieldLabel}>
              Password
            </label>
            <Link href="/sign-in/forgot" className={styles.forgotLink}>
              Forgot password?
            </Link>
          </div>
          <div className={styles.inputWrap}>
            <LockIcon />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className={styles.input}
              placeholder="••••••••"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>

        <div className={styles.rememberRow}>
          <input
            id="remember"
            type="checkbox"
            className={styles.checkbox}
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <label htmlFor="remember" className={styles.rememberLabel}>
            Remember me
          </label>
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In'}
          <ArrowRightIcon />
        </button>
      </form>

      {!hideSignUpRow && (
      <div className={styles.signUpRow}>
        <p className={styles.signUpText}>
          Don&apos;t have an account?{' '}
          {onSwitchToSignUp ? (
            <button type="button" className={styles.signUpLink} onClick={onSwitchToSignUp}>
              Sign up for free
            </button>
          ) : (
            <Link href="/sign-up" className={styles.signUpLink}>
              Sign up for free
            </Link>
          )}
        </p>
      </div>
      )}
    </div>
  );
}
