'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './CompactPdfViewer.module.css';

type CompactPdfViewerProps = {
  url: string;
  title?: string;
};

export default function CompactPdfViewer({ url, title }: CompactPdfViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [numPages, setNumPages] = useState(1);
  const [page, setPage] = useState(1);
  const [scale, setScale] = useState(1.2);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pdfRef = useRef<{ getPage: (n: number) => Promise<{ getViewport: (opts: { scale: number }) => { width: number; height: number }; render: (opts: unknown) => unknown }>; numPages: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    const loadPdf = async () => {
      try {
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.mjs`;
        const pdf = await pdfjsLib.getDocument({ url }).promise;
        if (cancelled) return;
        pdfRef.current = pdf as typeof pdfRef.current;
        setNumPages(pdf.numPages);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load PDF');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadPdf();
    return () => { cancelled = true; };
  }, [url]);

  useEffect(() => {
    if (!pdfRef.current || !canvasRef.current || page < 1) return;
    let cancelled = false;
    pdfRef.current.getPage(page).then((p) => {
      if (cancelled || !canvasRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const viewport = p.getViewport({ scale });
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      p.render({ canvasContext: ctx, viewport });
    });
    return () => { cancelled = true; };
  }, [page, scale, loading]);

  if (loading) return <div className={styles.bar}>Loading PDF…</div>;
  if (error) return <div className={styles.bar}>{error}</div>;

  return (
    <div className={styles.wrap}>
      <div className={styles.slimBar}>
        <span className={styles.pageLabel}>Page {page} / {numPages}</span>
        <div className={styles.zoomWrap}>
          <button type="button" className={styles.zoomBtn} onClick={() => setScale((s) => Math.max(0.5, s - 0.2))} aria-label="Zoom out">−</button>
          <span className={styles.zoomValue}>{Math.round(scale * 100)}%</span>
          <button type="button" className={styles.zoomBtn} onClick={() => setScale((s) => Math.min(2.5, s + 0.2))} aria-label="Zoom in">+</button>
        </div>
        {numPages > 1 && (
          <div className={styles.pageNav}>
            <button type="button" className={styles.pageBtn} onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>Prev</button>
            <button type="button" className={styles.pageBtn} onClick={() => setPage((p) => Math.min(numPages, p + 1))} disabled={page >= numPages}>Next</button>
          </div>
        )}
      </div>
      <div className={styles.canvasWrap} ref={containerRef}>
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>
    </div>
  );
}
