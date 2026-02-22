'use client';

import Link from 'next/link';
import { useAuthOptional } from '../lib/auth/AuthProvider';

interface LogoLinkProps {
  className?: string;
  children: React.ReactNode;
}

export default function LogoLink({ className, children }: LogoLinkProps) {
  const auth = useAuthOptional();
  const signedIn = !!auth?.user;

  return (
    <Link href={signedIn ? '/dashboard' : '/'} className={className}>
      {children}
    </Link>
  );
}
