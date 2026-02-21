import styles from './page.module.css';
import SignInForm from './SignInForm';
import LogoLink from '../components/LogoLink';

function DiamondLogo() {
  return (
    <svg className={styles.pageLogoIcon} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M20 2L38 20L20 38L2 20L20 2z"
        fill="#2563eb"
      />
      <path
        d="M20 8L32 20L20 32L8 20L20 8z"
        fill="#fff"
      />
    </svg>
  );
}

export default function SignInPage() {
  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <LogoLink className={styles.pageLogoWrap}>
          <DiamondLogo />
          <span className={styles.pageLogoText}>AcademiaLink</span>
        </LogoLink>
        <p className={styles.pageTagline}>Research Repository</p>
      </header>

      <SignInForm />
    </div>
  );
}
