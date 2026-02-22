'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDashboard } from '../DashboardContext';
import { timeAgo } from '../../lib/utils/timeAgo';
import styles from './NotificationsPanel.module.css';

type PaperItem = { id: string; title: string; created_at?: string; submitted?: string };

export default function NotificationsPanel() {
  const { setNotificationsOpen, notificationsOpen } = useDashboard();
  const [activities, setActivities] = useState<{ id: string; text: string; time: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!notificationsOpen) return;
    setLoading(true);
    fetch('/api/papers')
      .then((res) => (res.ok ? res.json() : []))
      .then((data: PaperItem[]) => {
        setActivities(
          (Array.isArray(data) ? data : []).slice(0, 10).map((p) => ({
            id: p.id,
            text: `You submitted "${p.title.length > 50 ? `${p.title.slice(0, 50)}…` : p.title}"`,
            time: p.created_at ? timeAgo(p.created_at) : (p.submitted ?? ''),
          }))
        );
      })
      .catch(() => setActivities([]))
      .finally(() => setLoading(false));
  }, [notificationsOpen]);

  return (
    <div className={styles.overlay} onClick={() => setNotificationsOpen(false)}>
      <div className={styles.backdrop} aria-hidden />
      <div className={styles.panel} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Notifications">
        <div className={styles.header}>
          <h2 className={styles.title}>Notifications</h2>
          <button type="button" className={styles.closeBtn} onClick={() => setNotificationsOpen(false)} aria-label="Close">×</button>
        </div>
        <div className={styles.list}>
          {loading && <p className={styles.text} style={{ color: '#94a3b8' }}>Loading…</p>}
          {!loading && activities.length === 0 && <p className={styles.text} style={{ color: '#94a3b8' }}>No recent activity.</p>}
          {!loading && activities.map((n) => (
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
