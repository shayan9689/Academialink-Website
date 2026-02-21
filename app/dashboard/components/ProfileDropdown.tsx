'use client';

import { useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDashboard } from '../DashboardContext';
import { clearSessionCookie } from '../../lib/authCookie';
import styles from './ProfileDropdown.module.css';

export default function ProfileDropdown({ onClose }: { onClose: () => void }) {
  const { user, setProfileOpen } = useDashboard();
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

  function handleSignOut() {
    setProfileOpen(false);
    clearSessionCookie();
    router.push('/');
  }

  return (
    <div ref={ref} className={styles.dropdown} role="menu">
      <div className={styles.userInfo}>
        <p className={styles.userName}>{user.name}</p>
        <p className={styles.userEmail}>{user.email}</p>
      </div>
      <button type="button" className={styles.signOutBtn} onClick={handleSignOut}>
        Sign out
      </button>
    </div>
  );
}
