'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { getDocsByTopic } from '../data/exploreDocs';
import type { ExploreDoc } from '../data/exploreDocs';
import { isSignedIn as checkSignedIn } from '../lib/authCookie';
import styles from './explore.module.css';

interface ExplorePageContentProps {
  topics: string[];
}

export default function ExplorePageContent({ topics }: ExplorePageContentProps) {
  const [signedIn, setSignedIn] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastHiding, setToastHiding] = useState(false);

  useEffect(() => {
    setSignedIn(checkSignedIn());
  }, []);

  const showSignInFirst = useCallback(() => {
    setToastVisible(true);
    setToastHiding(false);
  }, []);

  useEffect(() => {
    if (!toastVisible) return;
    const t = setTimeout(() => setToastHiding(true), 1000);
    const t2 = setTimeout(() => {
      setToastVisible(false);
      setToastHiding(false);
    }, 1400);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [toastVisible]);

  return (
    <>
      <div className={styles.content}>
        {topics.map((topic) => {
          const docs = getDocsByTopic(topic);
          return (
            <section key={topic} className={styles.topicCard}>
              <h2 className={styles.topicName}>{topic}</h2>
              <ul className={styles.docList}>
                {docs.map((doc: ExploreDoc) => (
                  <li key={doc.id} className={styles.docItem}>
                    {signedIn ? (
                      <Link href={`/explore/doc/${doc.id}`} className={styles.docLink}>{doc.title}</Link>
                    ) : (
                      <button type="button" className={styles.docLinkBtn} onClick={showSignInFirst}>{doc.title}</button>
                    )}
                    <span className={styles.docMeta}>{doc.year}</span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      {toastVisible && (
        <div
          className={`${styles.signInToast} ${toastHiding ? styles.signInToastHide : ''}`}
          role="status"
          aria-live="polite"
        >
          Sign in first
        </div>
      )}
    </>
  );
}
