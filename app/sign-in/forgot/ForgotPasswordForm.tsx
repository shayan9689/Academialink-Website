'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '../../lib/supabase/client';
import styles from '../page.module.css';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/sign-in` : undefined,
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className={styles.card}>
        <h1 className={styles.cardTitle}>Check your email</h1>
        <p className={styles.cardSubtitle}>
          We sent a password reset link to <strong>{email}</strong>. Click the link to set a new password, then sign in.
        </p>
        <Link href="/sign-in" className={styles.submitBtn} style={{ display: 'inline-block', textAlign: 'center', marginTop: '1rem', textDecoration: 'none' }}>
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <h1 className={styles.cardTitle}>Forgot password?</h1>
      <p className={styles.cardSubtitle}>Enter your email and we’ll send you a link to reset your password.</p>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="forgot-email">Email</label>
          <input
            id="forgot-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            style={{ paddingLeft: '0.75rem' }}
            placeholder="you@example.com"
            autoComplete="email"
            disabled={loading}
          />
        </div>
        {error && <p className={styles.formError}>{error}</p>}
        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? 'Sending…' : 'Send reset link'}
        </button>
      </form>
    </div>
  );
}
