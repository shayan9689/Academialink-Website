'use client';

import Link from 'next/link';
import { useDashboard } from '../DashboardContext';
import styles from './NotificationsPanel.module.css';

const dummyNotifications = [
  { id: '1', text: 'Dr. Elena Vance reviewed your submission "Ethical Implications of Generative Models".', time: '2 hours ago' },
  { id: '2', text: 'Prof. Marcus J. cited your paper "Neural Architectures for Decentralized Learning".', time: '5 hours ago' },
  { id: '3', text: 'System approved your profile verification.', time: '1 day ago' },
];

export default function NotificationsPanel() {
  const { setNotificationsOpen } = useDashboard();

  return (
    <div className={styles.overlay} onClick={() => setNotificationsOpen(false)}>
      <div className={styles.backdrop} aria-hidden />
      <div className={styles.panel} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Notifications">
        <div className={styles.header}>
          <h2 className={styles.title}>Notifications</h2>
          <button type="button" className={styles.closeBtn} onClick={() => setNotificationsOpen(false)} aria-label="Close">×</button>
        </div>
        <div className={styles.list}>
          {dummyNotifications.map((n) => (
            <div key={n.id} className={styles.item}>
              <p className={styles.text}>{n.text}</p>
              <span className={styles.time}>{n.time}</span>
            </div>
          ))}
        </div>
        <div className={styles.footer}>
          <Link href="/dashboard/notifications" className={styles.viewAll} onClick={() => setNotificationsOpen(false)}>View All</Link>
        </div>
      </div>
    </div>
  );
}
