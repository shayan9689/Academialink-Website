import Link from 'next/link';
import styles from '../terms/page.module.css';

export const metadata = {
  title: 'CC BY 4.0 Licensing | Academialink',
  description: 'Licensing information for AcademiaLink content.',
};

export default function LicensePage() {
  return (
    <div className={styles.wrap}>
      <Link href="/" className={styles.back}>← Back</Link>
      <h1 className={styles.title}>CC BY 4.0 Licensing</h1>
      <p className={styles.placeholder}>Content you submit may be made available under Creative Commons Attribution 4.0 (CC BY 4.0) unless otherwise specified.</p>
    </div>
  );
}
