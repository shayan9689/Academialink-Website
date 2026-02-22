'use client';

import { useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDashboard } from '../DashboardContext';
import { useAuth } from '../../lib/auth/AuthProvider';
import styles from './ProfileDropdown.module.css';

export default function ProfileDropdown({ onClose }: { onClose: () => void }) {
  const { user: dashboardUser, setProfileOpen } = useDashboard();
  const { signOut } = useAuth();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setProfileOpen(false);
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setProfileOpen, onClose]);

  async function handleSignOut() {
    setProfileOpen(false);
    await signOut();
    router.push('/');
  }

  return (
    <div ref={ref} className={styles.dropdown} role="menu">
      <div className={styles.userInfo}>
        <p className={styles.userName}>{dashboardUser?.name ?? 'User'}</p>
        <p className={styles.userEmail}>{dashboardUser?.email ?? ''}</p>
      </div>
      <button type="button" className={styles.signOutBtn} onClick={handleSignOut}>
        Sign out
      </button>
    </div>
  );
}
