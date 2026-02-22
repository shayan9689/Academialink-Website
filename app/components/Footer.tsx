import Link from 'next/link';
import styles from './Footer.module.css';

function DiamondLogo() {
  return (
    <svg className={styles.brandIcon} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M20 2L38 20L20 38L2 20L20 2z" fill="#2563eb" />
      <path d="M20 8L32 20L20 32L8 20L20 8z" fill="#fff" />
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>
          <DiamondLogo />
          AcademiaLink
        </Link>
        <nav className={styles.nav} aria-label="Footer">
          <Link href="/explore" className={styles.navLink}>Explore</Link>
          <Link href="/integrity" className={styles.navLink}>Integrity</Link>
          <Link href="/terms" className={styles.navLink}>Terms</Link>
          <Link href="/privacy" className={styles.navLink}>Privacy</Link>
          <Link href="/cookies" className={styles.navLink}>Cookies</Link>
          <Link href="/license" className={styles.navLink}>License</Link>
        </nav>
        <p className={styles.copyright}>
          © {year} AcademiaLink. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
