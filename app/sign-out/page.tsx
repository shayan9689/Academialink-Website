'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { clearSessionCookie } from '../lib/authCookie';

export default function SignOutPage() {
  const router = useRouter();

  useEffect(() => {
    clearSessionCookie();
    router.replace('/');
  }, [router]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
      Signing out…
    </div>
  );
}
