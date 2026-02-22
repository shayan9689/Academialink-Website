'use client';

import { useState, useEffect } from 'react';
import styles from './SubmitPeerReviewModal.module.css';

const MIN_FEEDBACK_CHARS = 100;

interface SubmitPeerReviewModalProps {
  open: boolean;
  onClose: () => void;
  paperTitle: string;
  /** Explore doc id – required to persist the review */
  docId: string;
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" aria-hidden>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export default function SubmitPeerReviewModal({ open, onClose, paperTitle, docId }: SubmitPeerReviewModalProps) {
  const [overallRating, setOverallRating] = useState(0);
  const [rigor, setRigor] = useState(5);
  const [originality, setOriginality] = useState(5);
  const [clarity, setClarity] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [posted, setPosted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      setPosted(false);
      setError(null);
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const feedbackCount = feedback.length;
  const canSubmit = feedbackCount >= MIN_FEEDBACK_CHARS && overallRating >= 1;

  async function handleSubmit() {
    setError(null);
    if (!canSubmit) {
      if (feedbackCount < MIN_FEEDBACK_CHARS) setError(`Feedback must be at least ${MIN_FEEDBACK_CHARS} characters.`);
      else if (overallRating < 1) setError('Please select an overall recommendation.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          docId,
          overallRating,
          rigor,
          originality,
          clarity,
          feedback: feedback.trim(),
          anonymous,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Failed to submit review');
        setLoading(false);
        return;
      }
      setPosted(true);
      setTimeout(() => onClose(), 1500);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="submit-review-title">
      <div className={styles.backdrop} aria-hidden />
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {posted && (
          <div className={styles.successBanner} role="status" aria-live="polite">
            Posted
          </div>
        )}
        <div className={styles.header}>
          <div>
            <h2 id="submit-review-title" className={styles.title}>Submit Peer Review</h2>
            <p className={styles.subtitle}>Evaluating: &lsquo;{paperTitle}&rsquo;</p>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className={styles.section}>
          <p className={styles.label}>Overall Recommendation</p>
          <div className={styles.stars} role="group" aria-label="Overall rating">
            {[1, 2, 3, 4].map((n) => (
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

        {error && <p className={styles.errorMessage} role="alert">{error}</p>}

        <div className={styles.footer}>
          <span className={styles.creditNote}>
            <span className={styles.infoIcon} aria-hidden>ℹ</span> Public academic credit
          </span>
          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={posted || loading}>Cancel</button>
            <button type="button" className={styles.submitBtn} onClick={handleSubmit} disabled={posted || loading || !canSubmit}>
              {posted ? 'Posted' : loading ? 'Submitting…' : 'Submit Review'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
