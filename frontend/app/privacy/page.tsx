import Link from 'next/link';
import styles from '../terms/page.module.css';

export const metadata = {
  title: 'Privacy Policy | Academialink',
  description: 'Privacy Policy for AcademiaLink.',
};

export default function PrivacyPage() {
  return (
    <div className={styles.wrap}>
      <Link href="/" className={styles.back}>← Back</Link>
      <h1 className={styles.title}>Privacy Policy</h1>
      <p className={styles.placeholder}>This page will contain our privacy policy. We respect your data and use it only to provide and improve the service.</p>
    </div>
  );
}
