'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

function BuildingIcon() {
  return (
    <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M3 21h18" />
      <path d="M5 21V7l8-4v18" />
      <path d="M19 21V11l-6-4" />
      <path d="M9 9v.01M9 12v.01M9 15v.01M9 18v.01" />
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

function CheckIcon() {
  return (
    <svg className={styles.verifiedIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export interface SignUpFormProps {
  /** When provided, "Sign in to AcademiaLink" triggers this instead of navigating */
  onSwitchToSignIn?: () => void;
  /** When true, hide the verified section and partner cards (e.g. in modal) */
  compact?: boolean;
  /** Optional id for the card title (e.g. for modal aria-labelledby) */
  titleId?: string;
  /** When true, hide the "Already a member? Sign in" row (e.g. when sign-in CTA is in a welcome panel) */
  hideSignInRow?: boolean;
}

export default function SignUpForm({ onSwitchToSignIn, compact, titleId, hideSignInRow }: SignUpFormProps = {}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  return (
    <>
      <div className={styles.card}>
        <h1 id={titleId} className={styles.cardTitle}>Create your account</h1>
        <p className={styles.cardSubtitle}>
          Join 50,000+ researchers sharing verified work.
        </p>

        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          <div className={styles.fieldGroup}>
            <label htmlFor="fullname" className={styles.fieldLabel}>
              Full name
            </label>
            <div className={styles.inputWrap}>
              <input
                id="fullname"
                type="text"
                className={`${styles.input} ${styles.inputNoIcon}`}
                placeholder="Dr. Julian Pierce"
                autoComplete="name"
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="affiliation" className={styles.fieldLabel}>
              Affiliation / Institution
            </label>
            <div className={styles.inputWrap}>
              <BuildingIcon />
              <input
                id="affiliation"
                type="text"
                className={styles.input}
                placeholder="Stanford University"
                autoComplete="organization"
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="email" className={styles.fieldLabel}>
              Institutional email
            </label>
            <div className={styles.inputWrap}>
              <input
                id="email"
                type="email"
                className={`${styles.input} ${styles.inputNoIcon}`}
                placeholder="julian.pierce@university.edu"
                autoComplete="email"
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="password" className={styles.fieldLabel}>
              Password
            </label>
            <div className={styles.inputWrap}>
              <LockIcon />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className={styles.input}
                placeholder="••••••••"
                autoComplete="new-password"
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

          <div className={styles.fieldGroup}>
            <label htmlFor="confirm" className={styles.fieldLabel}>
              Confirm password
            </label>
            <div className={styles.inputWrap}>
              <LockIcon />
              <input
                id="confirm"
                type={showConfirm ? 'text' : 'password'}
                className={styles.input}
                placeholder="••••••••"
                autoComplete="new-password"
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowConfirm(!showConfirm)}
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <div className={styles.termsRow}>
            <input
              id="terms"
              type="checkbox"
              className={styles.checkbox}
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
            />
            <label htmlFor="terms" className={styles.termsLabel}>
              I agree to the{' '}
              <Link href="/terms" className={styles.termsLink}>Terms of Service</Link>
              {' '}and{' '}
              <Link href="/privacy" className={styles.termsLink}>Privacy Policy</Link>
              , including researcher data verification.
            </label>
          </div>

          <button type="submit" className={styles.submitBtn}>
            Create Researcher Profile
            <ArrowRightIcon />
          </button>
        </form>

        {!hideSignInRow && (
        <div className={styles.signInRow}>
          <p className={styles.signInText}>
            Already a member?{' '}
            {onSwitchToSignIn ? (
              <button type="button" className={styles.signInLink} onClick={onSwitchToSignIn}>
                Sign in to AcademiaLink
              </button>
            ) : (
              <Link href="/sign-in" className={styles.signInLink}>
                Sign in to AcademiaLink
              </Link>
            )}
          </p>
        </div>
        )}
      </div>

      {!compact && (
      <section className={styles.verifiedSection}>
        <div className={styles.verifiedBadge}>
          <CheckIcon />
          <span className={styles.verifiedText}>Verified Secure Environment</span>
        </div>
        <div className={styles.partnersRow}>
          <div className={styles.partnerCard}>
            <p className={styles.partnerName}>Oxford</p>
            <p className={styles.partnerDesc}>Affiliate Network</p>
          </div>
          <div className={styles.partnerCard}>
            <p className={styles.partnerName}>MIT</p>
            <p className={styles.partnerDesc}>Digital Commons</p>
          </div>
          <div className={styles.partnerCard}>
            <p className={styles.partnerName}>IEEE</p>
            <p className={styles.partnerDesc}>Standard Access</p>
          </div>
          <div className={styles.partnerCard}>
            <p className={styles.partnerName}>CERN</p>
            <p className={styles.partnerDesc}>Open Science</p>
          </div>
        </div>
      </section>
      )}
    </>
  );
}
