import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <h1 className={styles.title}>404</h1>
        <p className={styles.text}>This page could not be found.</p>
        <nav className={styles.nav}>
          <Link href="/" className={styles.link}>Home</Link>
          <Link href="/explore" className={styles.link}>Explore</Link>
        </nav>
      </div>
    </div>
  );
}
