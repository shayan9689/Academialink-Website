'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon, LogoIcon, ProfileIcon, SearchIcon, SettingsIcon } from '../components/Icons';
import { isSignedIn as checkSignedIn, clearSessionCookie } from '../lib/authCookie';
import styles from './explore.module.css';

export default function ExplorePageHeader() {
  const router = useRouter();
  const profileRef = useRef<HTMLDivElement>(null);
  const [signedIn, setSignedIn] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    setSignedIn(checkSignedIn());
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    if (profileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [profileOpen]);

  const focusRepoSearch = () => {
    const el = document.getElementById('repo-search');
    if (el) {
      el.focus();
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <button type="button" className={styles.backLink} onClick={() => router.back()} aria-label="Back to previous page">
          <ChevronLeftIcon />
          <span>Back</span>
        </button>
        <Link href={signedIn ? '/dashboard' : '/'} className={styles.logoWrap}>
          <LogoIcon className={styles.logoIcon} />
          <span className={styles.logoText}>AcademiaLink</span>
        </Link>
      </div>
      <div className={styles.headerRight}>
        <button type="button" className={styles.headerIconBtn} onClick={focusRepoSearch} aria-label="Focus search">
          <SearchIcon />
        </button>
        {signedIn && (
          <Link href="/dashboard" className={styles.headerIconBtn} aria-label="Settings">
            <SettingsIcon />
          </Link>
        )}
        {signedIn ? (
          <div className={styles.profileWrap} ref={profileRef}>
            <button type="button" className={styles.profileTrigger} aria-label="Profile" aria-expanded={profileOpen} aria-haspopup="true" onClick={() => setProfileOpen(!profileOpen)}>
              <ProfileIcon />
            </button>
            {profileOpen && (
              <div className={styles.profileDropdown} role="menu">
                <Link href="/dashboard" className={styles.profileDropdownLink} onClick={() => setProfileOpen(false)}>Dashboard</Link>
                <button type="button" className={styles.profileDropdownSignOut} onClick={() => { setProfileOpen(false); clearSessionCookie(); router.push('/'); }}>Sign out</button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link href="/sign-in" className={styles.loginLink}>Sign in</Link>
            <Link href="/sign-up" className={styles.btnSignUp}>Sign Up</Link>
          </>
        )}
      </div>
    </header>
  );
}
