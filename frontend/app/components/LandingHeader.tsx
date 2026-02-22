'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LogoIcon,
  SearchIcon,
  BellIcon,
  ProfileIcon,
} from './Icons';
import { useAuth } from '../lib/auth/AuthProvider';
import { useLandingAuth } from './LandingAuthContext';
import styles from './LandingHeader.module.css';

interface LandingHeaderProps {
  styles: Readonly<Record<string, string>>;
}

export default function LandingHeader({ styles: pageStyles }: LandingHeaderProps) {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const landingAuth = useLandingAuth();
  const profileRef = useRef<HTMLDivElement>(null);
  const signedIn = !!user;
  const [profileOpen, setProfileOpen] = useState(false);
  const [loginMessageVisible, setLoginMessageVisible] = useState(false);
  const [loginMessageHiding, setLoginMessageHiding] = useState(false);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    if (profileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [profileOpen]);

  const handleSearchClick = useCallback(() => {
    setLoginMessageVisible(true);
    setLoginMessageHiding(false);
  }, []);

  useEffect(() => {
    if (!loginMessageVisible) return;
    const t = setTimeout(() => {
      setLoginMessageHiding(true);
    }, 1000);
    const t2 = setTimeout(() => {
      setLoginMessageVisible(false);
      setLoginMessageHiding(false);
    }, 1400);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [loginMessageVisible]);

  return (
    <>
      <header className={pageStyles.header}>
        <div className={pageStyles.headerLeft}>
          <Link href={signedIn ? '/dashboard' : '/'} className={pageStyles.logoWrap}>
            <LogoIcon className={pageStyles.logoIconSvg} />
            <span className={pageStyles.logoText}>Academialink</span>
          </Link>
        </div>
        <div className={pageStyles.headerRight}>
          {signedIn ? (
            <>
              <button type="button" className={pageStyles.iconBtn} aria-label="Search" onClick={handleSearchClick}>
                <SearchIcon />
              </button>
              <button type="button" className={pageStyles.iconBtn} aria-label="Notifications">
                <BellIcon />
              </button>
              <div className={styles.profileWrap} ref={profileRef}>
                <button type="button" className={pageStyles.iconBtn} aria-label="Profile" aria-expanded={profileOpen} aria-haspopup="true" onClick={() => setProfileOpen(!profileOpen)}>
                  <ProfileIcon />
                </button>
                {profileOpen && (
                  <div className={styles.profileDropdown} role="menu">
                    <Link href="/dashboard" className={styles.profileDropdownLink} onClick={() => setProfileOpen(false)}>Dashboard</Link>
                    <button type="button" className={styles.profileDropdownSignOut} onClick={async () => { setProfileOpen(false); await signOut(); router.push('/'); }}>Sign out</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button type="button" className={pageStyles.iconBtn} aria-label="Search" onClick={handleSearchClick}>
                <SearchIcon />
              </button>
              <button type="button" className={pageStyles.iconBtn} aria-label="Notifications">
                <BellIcon />
              </button>
              {landingAuth ? (
                <>
                  <button type="button" className={pageStyles.loginLink} onClick={landingAuth.openSignIn}>
                    Sign in
                  </button>
                  <button type="button" className={pageStyles.btnSignUp} onClick={landingAuth.openSignUp}>
                    Create account
                  </button>
                </>
              ) : (
                <>
                  <Link href="/sign-in" className={pageStyles.loginLink}>
                    Sign in
                  </Link>
                  <Link href="/sign-up" className={pageStyles.btnSignUp}>
                    Create account
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </header>

      {loginMessageVisible && (
        <div
          className={`${styles.loginToast} ${loginMessageHiding ? styles.loginToastHide : ''}`}
          role="status"
          aria-live="polite"
        >
          Sign in first
        </div>
      )}
    </>
  );
}
