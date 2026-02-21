'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './PaperActionsModal.module.css';

export interface PaperItem {
  id: string;
  title: string;
  submitted: string;
  status: string;
  category: string;
  citations: number | null;
  isPublic: boolean;
}

interface PaperActionsModalProps {
  paper: PaperItem;
  onClose: () => void;
  onRename: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string, isPublic: boolean) => void;
}

export default function PaperActionsModal({ paper, onClose, onRename, onDelete, onToggleVisibility }: PaperActionsModalProps) {
  const [renameValue, setRenameValue] = useState(paper.title);

  useEffect(() => {
    setRenameValue(paper.title);
  }, [paper.title]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  function handleSaveRename() {
    const t = renameValue.trim();
    if (t && t !== paper.title) onRename(paper.id, t);
    onClose();
  }

  function handleDelete() {
    if (typeof window !== 'undefined' && window.confirm('Delete this paper? This cannot be undone.')) {
      onDelete(paper.id);
      onClose();
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.backdrop} aria-hidden />
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="paper-actions-title">
        <div className={styles.header}>
          <h2 id="paper-actions-title" className={styles.title}>{paper.title}</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className={styles.body}>
          <Link href={`/dashboard/papers/${paper.id}`} className={styles.openEditBtn} onClick={() => onClose()}>
            Open / Edit document
          </Link>
          <div className={styles.divider} />
          <div className={styles.renameSection}>
            <div className={styles.optionRow}>
              <span className={styles.optionLabel}>Rename</span>
              <input
                type="text"
                className={styles.renameInput}
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                placeholder="Paper title"
              />
            </div>
            <button type="button" className={styles.saveRenameBtn} onClick={handleSaveRename}>Save new name</button>
          </div>
          <div className={styles.divider} />

          <div className={styles.optionRow}>
            <span className={styles.optionLabel}>Visibility</span>
            <div className={styles.visibilityToggle}>
              <button
                type="button"
                className={`${styles.visibilityBtn} ${paper.isPublic ? styles.visibilityBtnActive : ''}`}
                onClick={() => onToggleVisibility(paper.id, true)}
              >
                Public
              </button>
              <button
                type="button"
                className={`${styles.visibilityBtn} ${!paper.isPublic ? styles.visibilityBtnActive : ''}`}
                onClick={() => onToggleVisibility(paper.id, false)}
              >
                Private
              </button>
            </div>
          </div>

          <div className={styles.actionsRow}>
            <button type="button" className={styles.deleteBtn} onClick={handleDelete}>Delete paper</button>
          </div>
        </div>
      </div>
    </div>
  );
}
