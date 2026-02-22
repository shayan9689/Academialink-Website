'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDashboard } from '../DashboardContext';
import { useAuth } from '../../lib/auth/AuthProvider';
import { createClient } from '../../lib/supabase/client';
import styles from './SettingsModal.module.css';

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export default function SettingsModal() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { setSettingsOpen, notificationSettings, setNotificationSettings } = useDashboard();
  const [showCredentials, setShowCredentials] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

  function handleClose() {
    setSettingsOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  async function handleCredentialsSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const supabase = createClient();
    const email = user?.email;
    if (!email) {
      setMessage({ type: 'error', text: 'Session missing. Please sign in again.' });
      return;
    }
    if (!currentPassword.trim()) {
      setMessage({ type: 'error', text: 'Please enter your current password.' });
      return;
    }
    if (newPassword) {
      if (newPassword.length < 6) {
        setMessage({ type: 'error', text: 'New password must be at least 6 characters.' });
        return;
      }
      if (newPassword !== confirmPassword) {
        setMessage({ type: 'error', text: 'New passwords do not match.' });
        return;
      }
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: currentPassword,
      });
      if (signInError) {
        setMessage({ type: 'error', text: 'Current password is incorrect.' });
        return;
      }
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        setMessage({ type: 'error', text: error.message });
        return;
      }
      setMessage({ type: 'ok', text: 'Password updated successfully.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => { setShowCredentials(false); setMessage(null); }, 1500);
      return;
    }
    if (newEmail) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: currentPassword,
      });
      if (signInError) {
        setMessage({ type: 'error', text: 'Current password is incorrect.' });
        return;
      }
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) {
        setMessage({ type: 'error', text: error.message });
        return;
      }
      setMessage({ type: 'ok', text: 'Check your new email for the confirmation link.' });
      setCurrentPassword('');
      setNewEmail('');
      setTimeout(() => { setShowCredentials(false); setMessage(null); }, 2000);
      return;
    }
    setMessage({ type: 'error', text: 'Enter a new password or new email to update.' });
  }

  function handleSave() {
    setNotificationSettings(notificationSettings);
    setSettingsOpen(false);
  }

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.backdrop} aria-hidden />
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="settings-title">
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 id="settings-title" className={styles.title}>Settings</h2>
          </div>
          <button type="button" className={styles.closeBtn} onClick={handleClose} aria-label="Close">×</button>
        </div>

        <div className={styles.body}>
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Account & credentials</h3>
            <button type="button" className={styles.changePasswordTrigger} onClick={() => { setMessage(null); setShowCredentials(true); }}>
              Change password
            </button>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Notifications</h3>
            <label className={styles.checkRow}>
              <input
                type="checkbox"
                checked={notificationSettings.email}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, email: e.target.checked })}
              />
              <span>Email notifications</span>
            </label>
            <label className={styles.checkRow}>
              <input
                type="checkbox"
                checked={notificationSettings.push}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, push: e.target.checked })}
              />
              <span>Browser push notifications</span>
            </label>
            <label className={styles.checkRow}>
              <input
                type="checkbox"
                checked={notificationSettings.reviewReminders}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, reviewReminders: e.target.checked })}
              />
              <span>Review reminders</span>
            </label>
          </section>

          <div className={styles.saveRow}>
            <button type="button" className={styles.saveBtn} onClick={handleSave}>Save</button>
          </div>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Account</h3>
            <button
              type="button"
              className={styles.signOutBtn}
              onClick={async () => {
                setSettingsOpen(false);
                await signOut();
                router.push('/');
              }}
            >
              Sign out
            </button>
          </section>
        </div>
      </div>

      {showCredentials && (
        <div className={styles.secondOverlay} onClick={() => setShowCredentials(false)}>
          <div className={styles.secondBackdrop} aria-hidden />
          <div className={styles.secondModal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="change-password-title">
            <div className={styles.secondHeader}>
              <h2 id="change-password-title" className={styles.title}>Change password</h2>
              <button type="button" className={styles.closeBtn} onClick={() => setShowCredentials(false)} aria-label="Close">×</button>
            </div>
            <div className={styles.secondBody}>
              <p className={styles.sectionHint}>Confirm your current password to change email or password.</p>
              <form onSubmit={handleCredentialsSubmit} className={styles.form}>
                <label className={styles.label}>
                  Current password
                  <div className={styles.inputWrap}>
                    <input
                      type={showCurrentPw ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className={styles.input}
                      placeholder="Enter current password"
                      autoComplete="current-password"
                    />
                    <button type="button" className={styles.visibilityBtn} onClick={() => setShowCurrentPw(!showCurrentPw)} aria-label={showCurrentPw ? 'Hide password' : 'Show password'}>
                      {showCurrentPw ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </label>
                <label className={styles.label}>
                  New email (optional)
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className={styles.input}
                    placeholder="New email address"
                    autoComplete="email"
                  />
                </label>
                <label className={styles.label}>
                  New password (optional)
                  <div className={styles.inputWrap}>
                    <input
                      type={showNewPw ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={styles.input}
                      placeholder="New password"
                      autoComplete="new-password"
                    />
                    <button type="button" className={styles.visibilityBtn} onClick={() => setShowNewPw(!showNewPw)} aria-label={showNewPw ? 'Hide password' : 'Show password'}>
                      {showNewPw ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </label>
                <label className={styles.label}>
                  Confirm new password
                  <div className={styles.inputWrap}>
                    <input
                      type={showConfirmPw ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={styles.input}
                      placeholder="Confirm new password"
                      autoComplete="new-password"
                    />
                    <button type="button" className={styles.visibilityBtn} onClick={() => setShowConfirmPw(!showConfirmPw)} aria-label={showConfirmPw ? 'Hide password' : 'Show password'}>
                      {showConfirmPw ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </label>
                {message && <p className={message.type === 'ok' ? styles.messageOk : styles.messageError}>{message.text}</p>}
                <button type="submit" className={styles.submitBtn}>Update</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
