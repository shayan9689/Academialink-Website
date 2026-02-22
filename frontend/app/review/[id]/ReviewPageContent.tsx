'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

const MIN_FEEDBACK_CHARS = 100;

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" aria-hidden>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

interface ReviewPageContentProps {
  paperTitle: string;
  docId: string;
}

export default function ReviewPageContent({ paperTitle, docId }: ReviewPageContentProps) {
  const router = useRouter();
  const [overallRating, setOverallRating] = useState(0);
  const [rigor, setRigor] = useState(5);
  const [originality, setOriginality] = useState(5);
  const [clarity, setClarity] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [publicCredit, setPublicCredit] = useState(true);

  const feedbackCount = feedback.length;
  const canSubmit = feedbackCount >= MIN_FEEDBACK_CHARS;

  function handleSubmit() {
    if (!canSubmit) return;
    router.push(`/explore/doc/${docId}`);
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href={`/explore/doc/${docId}`} className={styles.backLink}>← Back to document</Link>
        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>Home</Link>
          <Link href="/explore" className={styles.navLink}>Explore</Link>
          <Link href="/sign-in" className={styles.navLink}>Sign in</Link>
        </nav>
      </header>

      <main className={styles.main}>
        <div className={styles.card}>
          <h1 className={styles.title}>Submit Peer Review</h1>
          <p className={styles.subtitle}>Evaluating: &lsquo;{paperTitle}&rsquo;</p>

          <div className={styles.section}>
            <p className={styles.label}>Overall Recommendation</p>
            <div className={styles.stars} role="group" aria-label="Overall rating">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`${styles.starBtn} ${n <= overallRating ? styles.starFilled : ''}`}
                  onClick={() => setOverallRating(n)}
                  aria-label={`${n} star${n > 1 ? 's' : ''}`}
                >
                  <StarIcon filled={n <= overallRating} />
                </button>
              ))}
            </div>
          </div>

          <div className={styles.sliderGroup}>
            <div className={styles.sliderRow}>
              <label className={styles.sliderLabel}>Methodological Rigor</label>
              <span className={styles.sliderValue}>{rigor}/10</span>
            </div>
            <input type="range" min={0} max={10} value={rigor} onChange={(e) => setRigor(Number(e.target.value))} className={styles.slider} />
          </div>
          <div className={styles.sliderGroup}>
            <div className={styles.sliderRow}>
              <label className={styles.sliderLabel}>Originality & Novelty</label>
              <span className={styles.sliderValue}>{originality}/10</span>
            </div>
            <input type="range" min={0} max={10} value={originality} onChange={(e) => setOriginality(Number(e.target.value))} className={styles.slider} />
          </div>
          <div className={styles.sliderGroup}>
            <div className={styles.sliderRow}>
              <label className={styles.sliderLabel}>Presentation Clarity</label>
              <span className={styles.sliderValue}>{clarity}/10</span>
            </div>
            <input type="range" min={0} max={10} value={clarity} onChange={(e) => setClarity(Number(e.target.value))} className={styles.slider} />
          </div>

          <div className={styles.section}>
            <label className={styles.label}>Detailed Qualitative Feedback</label>
            <textarea
              className={styles.textarea}
              placeholder="Provide a detailed analysis of the strengths, weaknesses, and potential improvements..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={5}
              aria-describedby="feedback-count"
            />
            <p id="feedback-count" className={styles.charCount}>
              {feedbackCount} / {MIN_FEEDBACK_CHARS} min characters
            </p>
          </div>

          <label className={styles.checkboxWrap}>
            <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} className={styles.checkbox} />
            <span className={styles.checkboxLabel}>Submit as Anonymous Reviewer</span>
          </label>
          <p className={styles.anonymousNote}>
            Your name will be hidden from the public and authors. The review will show as &lsquo;Verified Peer Reviewer&rsquo;.
          </p>

          <label className={styles.checkboxWrap}>
            <input type="checkbox" checked={publicCredit} onChange={(e) => setPublicCredit(e.target.checked)} className={styles.checkbox} />
            <span className={styles.checkboxLabel}>
              <span className={styles.infoIcon} aria-hidden>ℹ</span> Public academic credit
            </span>
          </label>

          <div className={styles.footer}>
            <Link href={`/explore/doc/${docId}`} className={styles.cancelBtn}>Cancel</Link>
            <button type="button" className={styles.submitBtn} onClick={handleSubmit} disabled={!canSubmit}>
              Submit Review
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
