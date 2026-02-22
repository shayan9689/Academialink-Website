import Link from 'next/link';
import styles from './page.module.css';

export const metadata = {
  title: 'Terms of Service | Academialink',
  description: 'Terms of Service for AcademiaLink.',
};

export default function TermsPage() {
  return (
    <div className={styles.wrap}>
      <Link href="/" className={styles.back}>← Back</Link>
      <h1 className={styles.title}>Terms of Service</h1>
      <p className={styles.placeholder}>This page will contain our terms of service. For now, use of the site is subject to standard academic and platform guidelines.</p>
    </div>
  );
}
