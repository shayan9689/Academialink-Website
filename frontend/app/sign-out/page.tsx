'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/auth/AuthProvider';

export default function SignOutPage() {
  const router = useRouter();
  const { signOut } = useAuth();

  useEffect(() => {
    signOut().then(() => router.replace('/'));
  }, [router, signOut]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
      Signing out…
    </div>
  );
}
