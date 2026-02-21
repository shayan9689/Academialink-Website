'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DownArrowIcon } from './Icons';
import { isSignedIn as checkSignedIn } from '../lib/authCookie';
import { useLandingAuth } from './LandingAuthContext';

interface HeroCtaProps {
  styles: Readonly<Record<string, string>>;
}

export default function HeroCta({ styles }: HeroCtaProps) {
  const landingAuth = useLandingAuth();
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    setSignedIn(checkSignedIn());
  }, []);

  const openSignIn = landingAuth?.openSignIn;

  return (
    <div className={styles.heroCta}>
      {signedIn ? (
        <Link href="/explore" className={styles.btnPrimary}>
          Explore Research
          <DownArrowIcon />
        </Link>
      ) : openSignIn ? (
        <button type="button" className={styles.btnPrimary} onClick={openSignIn}>
          Explore Research
          <DownArrowIcon />
        </button>
      ) : (
        <Link href="/sign-in" className={styles.btnPrimary}>
          Explore Research
          <DownArrowIcon />
        </Link>
      )}
      {openSignIn ? (
        <button type="button" className={styles.btnSecondary} onClick={openSignIn}>
          Upload Your Paper
        </button>
      ) : (
        <Link href="/sign-in" className={styles.btnSecondary}>
          Upload Your Paper
        </Link>
      )}
    </div>
  );
}
