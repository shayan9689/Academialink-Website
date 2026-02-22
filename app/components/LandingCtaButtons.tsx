'use client';

import { useLandingAuth } from './LandingAuthContext';

interface LandingCtaButtonsProps {
  styles: Readonly<Record<string, string>>;
}

export default function LandingCtaButtons({ styles }: LandingCtaButtonsProps) {
  const landingAuth = useLandingAuth();

  if (landingAuth) {
    return (
      <div className={styles.ctaButtons}>
        <button type="button" className={styles.btnPrimary} onClick={landingAuth.openSignUp}>
          Create Your Account
        </button>
        <a href="#mission" className={styles.ctaLink}>
          Learn about our mission
        </a>
      </div>
    );
  }

  return (
    <div className={styles.ctaButtons}>
      <a href="/sign-up" className={styles.btnPrimary}>
        Create Your Account
      </a>
      <a href="#mission" className={styles.ctaLink}>
        Learn about our mission
      </a>
    </div>
  );
}
