import Link from 'next/link';
import styles from '../page.module.css';
import LogoLink from '../../components/LogoLink';
import ForgotPasswordForm from './ForgotPasswordForm';

function DiamondLogo() {
  return (
    <svg className={styles.pageLogoIcon} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M20 2L38 20L20 38L2 20L20 2z" fill="#2563eb" />
      <path d="M20 8L32 20L20 32L8 20L20 8z" fill="#fff" />
    </svg>
  );
}

export default function ForgotPasswordPage() {
  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <LogoLink className={styles.pageLogoWrap}>
          <DiamondLogo />
          <span className={styles.pageLogoText}>AcademiaLink</span>
        </LogoLink>
        <p className={styles.pageTagline}>Research Repository</p>
      </header>

      <ForgotPasswordForm />

      <div className={styles.footer}>
        <div className={styles.footerLinks}>
          <Link href="/sign-in">Back to sign in</Link>
        </div>
      </div>
    </div>
  );
}
