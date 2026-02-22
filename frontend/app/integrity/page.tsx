import Link from 'next/link';
import styles from '../terms/page.module.css';

export const metadata = {
  title: 'Academic Integrity Policy | Academialink',
  description: 'Academic Integrity Policy for AcademiaLink.',
};

export default function IntegrityPage() {
  return (
    <div className={styles.wrap}>
      <Link href="/" className={styles.back}>← Back</Link>
      <h1 className={styles.title}>Academic Integrity Policy</h1>
      <p className={styles.placeholder}>We expect all submissions and reviews to meet high standards of academic integrity. Plagiarism and misrepresentation are not permitted.</p>
    </div>
  );
}
