import Link from 'next/link';
import styles from '../terms/page.module.css';

export const metadata = {
  title: 'Cookies | Academialink',
  description: 'Cookie policy for AcademiaLink.',
};

export default function CookiesPage() {
  return (
    <div className={styles.wrap}>
      <Link href="/" className={styles.back}>← Back</Link>
      <h1 className={styles.title}>Cookies</h1>
      <p className={styles.placeholder}>We use essential cookies for authentication and session management. No advertising or tracking cookies are used.</p>
    </div>
  );
}
