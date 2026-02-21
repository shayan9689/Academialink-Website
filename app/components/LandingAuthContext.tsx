'use client';

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import SignInForm from '../sign-in/SignInForm';
import SignUpForm from '../sign-up/SignUpForm';
import styles from './AuthModal.module.css';

export type AuthModalType = 'sign-in' | 'sign-up' | null;

type LandingAuthContextValue = {
  openSignIn: () => void;
  openSignUp: () => void;
  closeModal: () => void;
};

const LandingAuthContext = createContext<LandingAuthContextValue | null>(null);

export function useLandingAuth() {
  const ctx = useContext(LandingAuthContext);
  return ctx;
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

export function LandingAuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [modal, setModal] = useState<AuthModalType>(null);

  const openSignIn = useCallback(() => setModal('sign-in'), []);
  const openSignUp = useCallback(() => setModal('sign-up'), []);
  const closeModal = useCallback(() => setModal(null), []);

  const handleSignInSuccess = useCallback(() => {
    setModal(null);
    router.push('/dashboard');
  }, [router]);

  const switchToSignUp = useCallback(() => setModal('sign-up'), []);
  const switchToSignIn = useCallback(() => setModal('sign-in'), []);

  const value: LandingAuthContextValue = {
    openSignIn,
    openSignUp,
    closeModal,
  };

  return (
    <LandingAuthContext.Provider value={value}>
      {children}
      {modal === 'sign-in' && (
        <div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-modal-title"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.closeBtn}
              aria-label="Close"
              onClick={closeModal}
            >
              <CloseIcon />
            </button>
            <div className={styles.panelLeft}>
              <div className={styles.formWrap}>
                <SignInForm
                  onSwitchToSignUp={switchToSignUp}
                  onSuccess={handleSignInSuccess}
                  titleId="auth-modal-title"
                  hideSignUpRow
                />
              </div>
            </div>
            <div className={styles.panelRight}>
              <h2 className={styles.welcomeHeading}>Welcome back!</h2>
              <p className={styles.welcomeText}>
                We&apos;re glad to see you again. Access your research dashboard, manage your papers,
                and stay connected with the global academic community. Your verified work and peer
                review activity are right where you left them.
              </p>
              <button type="button" className={styles.welcomeCta} onClick={switchToSignUp}>
                No account yet? Sign up
              </button>
            </div>
          </div>
        </div>
      )}
      {modal === 'sign-up' && (
        <div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-modal-title"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className={`${styles.panel} ${styles.panelSignUp}`} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.closeBtn}
              aria-label="Close"
              onClick={closeModal}
            >
              <CloseIcon />
            </button>
            <div className={styles.panelLeft}>
              <div className={styles.formWrap}>
                <SignUpForm onSwitchToSignIn={switchToSignIn} compact titleId="auth-modal-title" hideSignInRow />
              </div>
            </div>
            <div className={styles.panelRight}>
              <h2 className={styles.welcomeHeading}>Join AcademiaLink</h2>
              <p className={styles.welcomeText}>
                Create your researcher profile and join thousands of academics who publish, review,
                and discover verified research. Get transparent peer review, global distribution,
                and recognition for your contributions.
              </p>
              <button type="button" className={styles.welcomeCta} onClick={switchToSignIn}>
                Already a member? Sign in
              </button>
            </div>
          </div>
        </div>
      )}
    </LandingAuthContext.Provider>
  );
}
